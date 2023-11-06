import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';

const QrCodeScanner = () => {
  const [qrCode, setQrCode] = useState('');
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setQrCode(data);
      // You can handle the QR code data here
    }
  };

  const handleCapture = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.openImageDialog();
    }
  };

  const scannerSettings = {
    facingMode: 'environment', // Use the rear camera
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">QR Code Scanner</h1>
      <QrReader
        ref={qrReaderRef}
        onScan={handleScan}
        onError={(error) => console.log(error)}
        style={{ width: '100%' }}
        constraints={scannerSettings}
      />
      <button
        onClick={handleCapture}
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Capture
      </button>
      {qrCode && (
        <p className="mt-4">
          QR Code: <span className="font-semibold">{qrCode}</span>
        </p>
      )}
    </div>
  );
};

export default QrCodeScanner;
