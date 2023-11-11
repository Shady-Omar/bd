// Unused Code:

// import "../styles.css";
// import { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import { db } from '../firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';

// const QRCodeScanner = () => {
//   const [startScan, setStartScan] = useState(false);
//   const [loadingScan, setLoadingScan] = useState(false);
//   const [data, setData] = useState('No result');
//   const [boycottText, setboycottText] = useState("");
//   // const [scannedLink, setScannedLink] = useState(""); // New state variable for scanned link

//   const handleScan = async (scanData) => {
//     setLoadingScan(true);

//     if (scanData && scanData !== '') {
//       // Query Firestore to check if the received URL exists in the 'companies' collection
//       const companiesCollection = collection(db, 'companies');
//       const q = query(companiesCollection, where('url', '==', scanData));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const boycott = data.boycott; // Assuming "boycott" is a field in your Firestore document

//           if (boycott === true) {
//             // If "boycott" field equals true, log a message
//             setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Israeli occupation<br/>هذه الشركة تدعم الاحتلال الإسرائيلي</p>)
//           } else {
//             // "boycott" is not true
//             setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Palestine<br/>هذه الشركة تدعم فلسطين </p>)
//           }
//         });
//       } else {
//         // URL does not exist in Firestore
//         console.log('URL not found in Firestore:', scanData);
//         setboycottText(<p className="text-center font-semibold text-md mb-0">Not recognised</p>)
//       }

//       setData(scanData);
//       setStartScan(false);
//       setLoadingScan(false);
//     }
//   };

//   const handleError = (err) => {
//     console.error(err);
//   };

//   return (
//     <div>
//       <button
//         className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 my-5"
//         onClick={() => {
//           setStartScan(!startScan);
//           setData('No result');
//         }}
//       >
//         {startScan ? "Stop Scan" : "Start Scan"}
//       </button>
//       {startScan && (
//         <>
//           <QrReader
//             delay={1000}
//             onError={handleError}
//             onScan={handleScan}
//             style={{ width: "300px" }}
//             onResult={(result, error) => {
//               if (!!result) {
//                 setData(result?.text);
//                 setStartScan(!startScan);
//               }
    
//               if (!!error) {
//                 console.info(error);
//               }
//             }}
//             constraints={{ facingMode: "environment" }}
//           />
//         </>
//       )}
//       {data !== "" && (
//         <div>
//           {data !== "No result"
//             ? <a className=" text-green-600" href={data}>{data}</a>
//             :
//               <>
//                 <p>{data}</p>
//                 {boycottText}
//               </>
//           }
//         </div>
//       )}
//       {loadingScan && <p>Loading</p>}
//     </div>
//   );
// };

// export default QRCodeScanner;
