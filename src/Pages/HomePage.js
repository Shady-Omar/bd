import React, { useEffect, useState } from "react";
import Logo from '../assets/logo.svg'
import QRCodeScanner from '../Components/QRCodeScanner';
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
        return companies.filter(company => company.name.toLowerCase().includes(searchText.toLowerCase()));
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

  return (
    <div className="flex justify-center w-full text-[#212529]">
      <div className="container px-3">
        <div className="my-12 flex justify-center items-center">
          <img className="w-[250px]" src={Logo} alt=""/>
        </div>

        <div className="mt-0 mb-12 flex justify-center items-center">
          <p className="text-center mb-0 text-[2em] about-text">A platform promoting conscientious consumerism by identifying/facilitating access to information about which companies do or do not support the illegal Israeli Occupation of Palestine.<br />منصة تدعم الاستهلاك الواعي من خلال تسهيل معرفة الشركات التي تدعم وتلك التي لا تدعم الاحتلال الإسرائيلي الغاشم لفلسطين</p>
        </div>

        <form className="relative" method="post" id="searchForm" width="100%">
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
                    <hr/>
                  </React.Fragment>
                ))}
              </ul>
            )}
        </form>

        {showPopup && selectedCompany && (
          <CompanyInfoPopup company={selectedCompany} onClose={closePopup} />
        )}

        {/* QR Code Scanner: */}
        <QRCodeScanner />


        <Investigations/>
      </div>
    </div>
  );
}

export default HomePage;