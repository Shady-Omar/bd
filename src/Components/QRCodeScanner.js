import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = React.forwardRef((props, ref) => {
  const [qrscan, setQrscan] = useState('No result');
  const [scanning, setScanning] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const qrRef = ref || useRef(null); // Use the forwarded ref or create a new one

  const handleScan = (data) => {
    if (data) {
      setQrscan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

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
        </div>
      ) : (
        scanButton
      )}
      <p>{qrscan}</p>
    </div>
  );
});

export default QRCodeScanner;
