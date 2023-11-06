import "../styles.css";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = () => {
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState('No result');
  // const [scannedLink, setScannedLink] = useState(""); // New state variable for scanned link

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log("Scanned data:", scanData);
    if (scanData && scanData !== "") {
      console.log("Scanned:", scanData);
      setData(scanData);
      // setScannedLink(scanData); // Update scanned link state
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <button
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-5"
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
            onResult={(result, error) => {
              if (!!result) {
                setData(result?.text);
                setStartScan(!startScan);
              }
    
              if (!!error) {
                console.info(error);
              }
            }}
            constraints={{ facingMode: "environment" }}
          />
        </>
      )}
      {loadingScan && <p>Loading</p>}
      {data !== "" && (
        <div>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
