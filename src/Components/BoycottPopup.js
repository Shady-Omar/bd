import React, { useEffect } from "react";
import { useState } from "react";

const CompanyInfoPopup = ({ company, onClose }) => {

  const [boycottText, setboycottText] = useState("");
  
  useEffect(() => {
    if (company.boycott === true) {
      console.log('j');
      setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Israeli occupation<br/>هذه الشركة تدعم الاحتلال الإسرائيلي</p>)
    } else {
      console.log('k');
      setboycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Palestine<br/>هذه الشركة تدعم فلسطين </p>)
    }
  }, []);
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-md w-[90%] lg:w-[50%]">
        
        <div className="modal-body" id="resultModalBody">
          <ul className="list-group my-12">
            <li className="list-group-item border-0">
              <h2 className="font-bold text-center text-4xl mb-4">"{company.name}"</h2>
              {boycottText}
            </li>
          </ul>
        </div>
        <button onClick={onClose} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
          Close
        </button>
      </div>
    </div>
  );
};

export default CompanyInfoPopup;
