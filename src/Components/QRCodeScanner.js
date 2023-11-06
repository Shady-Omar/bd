import "../styles.css";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = () => {
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");
  const [scannedLink, setScannedLink] = useState(""); // New state variable for scanned link

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log("Scanned data:", scanData);
    if (scanData && scanData !== "") {
      console.log("Scanned:", scanData);
      setData(scanData);
      setScannedLink(scanData); // Update scanned link state
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>Hello CodeSandbox</h1>

      <button
        onClick={() => {
          setStartScan(!startScan);
        }}
      >
        {startScan ? "Stop Scan" : "Start Scan"}
      </button>
      {startScan && (
        <>
          <QrReader
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "300px" }}
            constraints={{ facingMode: "environment" }}
          />
        </>
      )}
      {loadingScan && <p>Loading</p>}
      {data !== "" && (
        <div>
          <p>{data}</p>
          <p>Scanned Link: {scannedLink}</p> {/* Display scanned link */}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
