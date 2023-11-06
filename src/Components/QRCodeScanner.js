import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
  const [result, setResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />

      {result ? (
        <div>
          <p>QR Code Scanned Successfully!</p>
          <p>Result: {result}</p>
        </div>
      ) : null}
    </div>
  );
};

export default QRCodeScanner;
