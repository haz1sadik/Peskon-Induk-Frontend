import React from "react";
import upmLogo from "/upmLogo.png";
import mEventLogo from "/MEVENT_Logo.png";
import MPPUPMLogo from "/MPPUOM_Logo.png";
import SonetraLogo from "/Sonetra_Logo.png";
import PayNetLogo from "/paynet-seeklogo.png";
import MahsariGroupLogo from "/MahsariGroup_Logo.png";

const EventPartners = () => {
  return (
    <div className="lg:px-37 md:px-22 px-[3.7rem] lg:py-14 md:py-[3.2rem] py-[2.2rem]">
      <h1 className="text-peskonrun-primary font-bold lg:text-4xl md:text-[2rem] text-3xl text-center">
        Event Partners
      </h1>

      <div className="hidden md:flex flex-col justify-center items-center gap-14 ">
        <div className="grid grid-cols-4 lg:gap-12 md:gap-8 justify-center items-center pt-16">
          <img src={upmLogo} alt="upm logo" className="lg:h-18 md:h-18 h-12 object-contain" />
          <img
            src="/PESKON2025_Logo.png"
            alt="peskon logo"
            className="lg:h-16 md:h-18 h-12 object-contain"
          />
          <img
            src={mEventLogo}
            alt="mevent logo"
            className="lg:h-24 md:h-25 h-12 rounded-2xl"
          />
          <img
            src={MPPUPMLogo}
            alt="mpp upm logo"
            className="lg:h-28 md:h-26 h-12"
          />
          <div></div>
          <img
            src={PayNetLogo}
            alt="mpp upm logo"
            className="lg:h-15 md:h-10 h-8"
          />
          <img
            src={MahsariGroupLogo}
            alt="mpp upm logo"
            className="lg:h-28 md:h-22 h-8"
          />
        </div>
        <h1 className="font-semibold text-2xl">Website Powered By</h1>
        <div className="flex lg:gap-12 -mt-30 md:gap-8 justify-center items-center pt-16">
          <img
            src={SonetraLogo}
            alt="upm logo"
            className="lg:h-20 md:h-20 h-12"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-10 items-center justify-center">
        <div className="grid grid-cols-2 gap-y-10 gap-7 justify-items-center place-items-center mt-8 px-4">
          <img src={upmLogo} alt="UPM logo" className="h-12" />
          <img src="/PESKON2025_Logo.png" alt="peskon logo" className="h-12" />
          <img src={mEventLogo} alt="mevent logo" className="h-18 rounded-2xl" />
          <img src={MPPUPMLogo} alt="mpp upm logo" className="h-20" />
          <img src={PayNetLogo} alt="paynet logo" className="h-10 object-contain" />
          <img src={MahsariGroupLogo} alt="mahsari group logo" className="h-20" />
        </div>
        <h1 className="font-semibold text-lg md:text-2xl">Website Powered By</h1>
        <img src={SonetraLogo} alt="sonetra logo" className="h-15 -mt-10" />
      </div>
    </div>
  );
};

export default EventPartners;
