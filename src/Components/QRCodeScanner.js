import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = React.forwardRef((props, ref) => {
  const [qrscan, setQrscan] = useState('No result');
  const [scanning, setScanning] = useState(false);
  const qrRef = ref || useRef(null);

  const handleScan = (data) => {
    if (data) {
      setQrscan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    // Get user media with specific constraints to choose the rear camera
    const constraints = {
      video: {
        facingMode: 'environment', // Use 'environment' for rear camera
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // Attach the stream to the QR code scanner
        qrRef.current.openImageDialog = () => {};
        qrRef.current.handleUserMedia(null, stream);
      })
      .catch((error) => {
        console.error('Error accessing the rear camera:', error);
      });

  }, [qrRef]);

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const scanButton = scanning ? (
    <button
      onClick={stopScanning}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded hover-bg-red-700"
    >
      Stop Scanning
    </button>
  ) : (
    <button
      onClick={startScanning}
      className="bg-green-500 text-white font-bold py-2 px-4 rounded hover-bg-green-700"
    >
      Start Scanning
    </button>
  );

  return (
    <div>
      {scanning ? (
        <div>
          <QrReader
            ref={qrRef}
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ height: 250, width: 250 }}
          />
          {scanButton}
          <p>{qrscan}</p>
        </div>
      ) : (
        scanButton
      )}
    </div>
  );
});

export default QRCodeScanner;
