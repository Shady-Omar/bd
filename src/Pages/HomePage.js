import React, { useEffect, useState, useMemo } from "react";
import "../styles.css";
import Logo from '../assets/logo-cut.png'
import lens from '../assets/lens.svg'
// import QRCodeScanner from '../Components/QRCodeScanner';
import { QrReader } from "react-qr-reader";
import { db, algoliaIndex } from '../firebase';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import CompanyInfoPopup from "../Components/BoycottPopup";
import Investigations from "../Components/Investigations";
import { doc } from "firebase/firestore";
import debounce from 'lodash.debounce';

function HomePage() {

  const [suggestions, setSuggestions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);


  // For QR CODE SCAN:
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState('No result');
  const [boycottText, setboycottText] = useState("");
  // *****




  async function queryCompanies(searchText) {
    let companiesData = [];
    await algoliaIndex
      .search(searchText, { hitsPerPage: 5 })
      .then(async ({ hits }) => {
        for (const hit of hits) {
          try {
            const docRef = doc(db, hit.path);
            const docSnap = await getDoc(docRef);
            companiesData = ([...companiesData, { id: docSnap.id, ...docSnap.data() }])
          } catch (error) {
            console.error('Error fetching document:', error);
          }
        }
      })
      .catch(err => {
        console.log(`This is an error ${err}`);
      });


    return companiesData;
  }


  const handleSearch = async (searchText) => {
    if (searchText) {
      const suggestions = await queryCompanies(searchText);
      console.log(`suggestions count is ${suggestions.length}`);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleSearch, 300);
  }, []);

  const isBoycott = (company) => {
    // Show the popup and set the selected company
    setShowPopup(true);
    setSelectedCompany(company);
    setSuggestions([]); // Clear the suggestions when opening the modal
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
            setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Palestine<br />.هذه الشركة تدعم فلسطين</p>)
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
    <div className="flex flex-col items-center justify-center w-full text-[#212529]">
      <div className="container px-3 w-[90%] lg:w-[80%]">
        <div className="mt-20 mb-5 flex justify-center items-center">
          <img className="w-1/3 lg:w-1/5" src={Logo} alt="" />
        </div>

        <div className="mt-0 mb-12 flex justify-center items-center">
          <p className="text-center mb-0 lg:text-[2em] about-text " >
            A platform encouraging mindful consumer choices by providing information on companies that support the illegal Israeli Occupation of Palestine.
            <br />
            منصة تشجع على اتخاذ قرارات استهلاكية مدروسة عن طريق توفير معلومات حول الشركات التي تدعم الاحتلال الإسرائيلي غير القانوني في فلسطين.
          </p>
        </div>

        <form className="relative rounded-[30px] bg-white" id="searchForm" width="100%">
          <div className="bar">
            <input
              type="text"
              name="search"
              id="searchInput"
              className="searchbar"
              placeholder="Search name here"
              onChange={(e) => debouncedResults(e.target.value)}
            />

          </div>
          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded shadow-lg z-10 bg-white w-full">
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
      <footer className="w-full">
        <div className="flex justify-center items-center " style={{ height: '75px', borderTop: '1px solid #e3e3e3' }}>
          <a style={{ color: 'black', fontSize: '26px' }} href="https://www.instagram.com/jcimovement/" target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          {/* <a className="mx-2" style={{color: 'black', fontSize: '26px'}} href="" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a> */}
        </div>
      </footer>
    </div>
  );
}

export default HomePage;