import React, { useEffect, useState } from "react";
import "../styles.css";
import Logo from '../assets/logo.svg'
import lens from '../assets/lens.svg'
// import QRCodeScanner from '../Components/QRCodeScanner';
import { QrReader } from "react-qr-reader";
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import CompanyInfoPopup from "../Components/BoycottPopup";
import Investigations from "../Components/Investigations";

function HomePage() {

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companies, setCompanies] = useState([]);

  // For QR CODE SCAN:
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState('No result');
  const [boycottText, setboycottText] = useState("");
  // *****

  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesCollection = collection(db, 'companies');
      const companiesSnapshot = await getDocs(companiesCollection);

      const companiesData = companiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCompanies(companiesData);
    };

    fetchCompanies();
  }, []);



  const handleSearch = async (searchText) => {
    setSearch(searchText);
    if (searchText) {

      function queryCompanies(searchText) {
        return companies.filter(company => company.name.toString().toLowerCase().includes(searchText.toLowerCase())).slice(0, 10);
      }

      setSuggestions(queryCompanies(searchText));
    } else {
      setSuggestions([]);
    }
  };


  const isBoycott = (company) => {
    // Show the popup and set the selected company
    setShowPopup(true);
    setSelectedCompany(company);
    setSuggestions([]); // Clear the suggestions when opening the modal
    setSearch('');
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCompany(null);
  };

  // For QR CODE SCAN:

  const handleScan = async (scanData) => {
    setLoadingScan(true);

    if (scanData && scanData !== '') {
      // Query Firestore to check if the received URL exists in the 'companies' collection
      const companiesCollection = collection(db, 'companies');
      const q = query(companiesCollection, where('url', '==', scanData));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const boycott = data.boycott; // Assuming "boycott" is a field in your Firestore document

          if (boycott === true) {
            // If "boycott" field equals true, log a message
            setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Israeli occupation<br />هذه الشركة تدعم الاحتلال الإسرائيلي</p>)
          } else {
            // "boycott" is not true
            setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Palestine<br />هذه الشركة تدعم فلسطين </p>)
          }
        });
      } else {
        // URL does not exist in Firestore
        console.log('URL not found in Firestore:', scanData);
        setboycottText(<p className="text-center font-semibold text-md mb-0">Not recognised</p>)
      }

      setData(scanData);
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };
  // *****

  return (
    <div className="flex justify-center w-full text-[#212529]">
      <div className="container px-3">
        <div className="my-12 flex justify-center items-center">
          <img className="w-[200px]" src={Logo} alt="" />
        </div>

        <div className="mt-0 mb-12 flex justify-center items-center">
          <p className="text-center mb-0 lg:text-[2em] about-text">A platform encouraging mindful consumer choices by providing information on companies that support the illegal Israeli Occupation of Palestine.<br />منصة تشجع على اتخاذ قرارات استهلاكية مدروسة عن طريق توفير معلومات حول الشركات التي تدعم الاحتلال الإسرائيلي غير القانوني في فلسطين</p>
        </div>

        <form className="relative" id="searchForm" width="100%">
          <div className="bar">
            <input
              type="text"
              name="search"
              id="searchInput"
              className="searchbar"
              placeholder="Search here"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
              type="button"
              className="lens-div"
              onClick={() => {
                setStartScan(!startScan);
                setData('No result');
              }}
            >
              <img className="lens" id="searchByCamera" src={lens} alt="" title="Search by Image" />
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded shadow-lg absolute z-10 bg-white w-full">
              {suggestions.map((company) => (
                <React.Fragment key={company.id}>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer text-left pl-4"
                    onClick={() => isBoycott(company)}
                  >
                    {company.name}
                  </li>
                  <hr />
                </React.Fragment>
              ))}
            </ul>
          )}
        </form>

        {showPopup && selectedCompany && (
          <CompanyInfoPopup company={selectedCompany} onClose={closePopup} />
        )}

        {/* QR Code Scanner: */}
        {/* <QRCodeScanner /> */}

        <div>
          {/* <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 my-5"
            onClick={() => {
              setStartScan(!startScan);
              setData('No result');
            }}
          >
            {startScan ? "Stop Scan" : "Start Scan"}
          </button> */}
          {startScan && (
            <div className="mt-5">
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
            </div>
          )}
          {startScan && (
            <>
              {data !== "" && (
                <div className="mt-5">
                  {data !== "No result"
                    ? <a className=" text-green-600" href={data}>{data}</a>
                    :
                    <>
                      <p>{data}</p>
                      {boycottText}
                    </>
                  }
                </div>
              )}
            </>
          )}

          {loadingScan && <p>Loading</p>}
        </div>

        <Investigations />
      </div>
    </div>
  );
}

export default HomePage;