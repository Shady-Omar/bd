import React from "react";
import Logo from '../assets/logo.svg'
import QRCodeScanner from '../Components/QRCodeScanner';

function HomePage() {
  

  return (
    <div className="flex justify-center w-full text-[#212529]">
      <div className="container">
        <div className="my-12 flex justify-center items-center">
          <img className="w-[250px]" src={Logo} alt=""/>
        </div>

        <div className="mt-0 mb-12 flex justify-center items-center">
          <p className="text-center mb-0 text-[2em]">A platform promoting conscientious consumerism by identifying/facilitating access to information about which companies do or do not support the illegal Israeli Occupation of Palestine.<br />منصة تدعم الاستهلاك الواعي من خلال تسهيل معرفة الشركات التي تدعم وتلك التي لا تدعم الاحتلال الإسرائيلي الغاشم لفلسطين</p>
        </div>

        <form method="post" id="searchForm" width="100%">
          <div className="bar">
            <input type="text" name="search" id="searchInput" className="searchbar" placeholder="Search here" />
            {/* <div className="lens-div">
              <img className="lens" id="searchByCamera" src="https://cdn.bdnaash.com/images/lens.svg" title="Search by Image" alt="" />
            </div> */}
          </div>
        </form>

        {/* QR Code Scanner: */}
        <QRCodeScanner />


        <div id="requestCountersDiv" className="flex justify-center items-center flex-col my-12">
          <p className="mb-0 text-[2rem] font-bold" id="requestCounters">12,306,115</p>
          <p className="mb-0 text-[1.75rem] font-bold">عدد التحريات</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;