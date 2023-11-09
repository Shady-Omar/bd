import React, { useEffect } from "react";
import { useState } from "react";
import closeIcon from '../assets/close-icon.svg'

const CompanyInfoPopup = ({ company, onClose }) => {

  const [boycottText, setBoycottText] = useState("");
  const [boycottBorder, setBoycottBorder] = useState("");
  
  useEffect(() => {
    if (company.boycott === true) {
      setBoycottBorder('0.5rem solid red');
      setBoycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Israeli occupation<br/>هذه الشركة تدعم الاحتلال الإسرائيلي</p>)
    } else {
      setBoycottBorder('0.5rem solid green');
      setBoycottText(<p className="text-center font-semibold text-lg mb-0">This brand supports the Palestine<br/>هذه الشركة تدعم فلسطين </p>)
    }
  }, []);
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-md w-[90%] lg:w-[50%]" style={{border: boycottBorder }}>
        <div className="w-full flex justify-end">
          <button onClick={onClose} type="button" className="scale-150">
            <img src={closeIcon} alt="" />
          </button>
        </div>
        <div className="modal-body" id="resultModalBody">
          <ul className="list-group my-12">
            <li className="list-group-item border-0">
              <h2 className="font-bold text-center text-4xl mb-4">"{company.name}"</h2>
              {boycottText}
            </li>
          </ul>
        </div>
       
      </div>
    </div>
  );
};

export default CompanyInfoPopup;
