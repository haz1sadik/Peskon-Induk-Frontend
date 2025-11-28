import React from "react";
import upmLogo from "/upmLogo.png";
import mEventLogo from "/MEVENT_Logo.png";
import MPPUPMLogo from "/MPPUOM_Logo.png";
import SonetraLogo from "/Sonetra_Logo.png";
import PayNetLogo from "/paynet-seeklogo.png";
import MahsariGroupLogo from "/MahsariGroup_Logo.png";
import koperasiSiswazah from "/koperasiSiswazah.png";
import delicaChocolate from "/delicaChocolate.png";
import easyGlobal from "/easyGlobal.png";
import olivko from "/olivko.png";
import yayasanMahabbah from "/yayasanMahabbah.png";
import maryKay from "/maryKay.png";
import hotlinkLogo from "/hotlinkLogo.png";
import monsterEnergy from "/monsterEnergy.png";
import mvLogo from "/mvLogo.png";
import upmEsportsClub from "/upmEsportsClub.png";
import usPizza from "/usPizza.png";
import redApe from "/redApe.png";
import kartaLogo from "/kartaLogo.jpg";
import rhbGroup from "/rhbGroup.png";

const EventPartners = () => {
  const partners = [
    { src: upmLogo, alt: "UPM logo" },
    { src: "/PESKON2025_Logo.png", alt: "PESKON 2025 logo" },
    { src: mEventLogo, alt: "MEVENT logo" },
    { src: MPPUPMLogo, alt: "MPP UPM logo" },
    { src: PayNetLogo, alt: "PayNet logo" },
    { src: MahsariGroupLogo, alt: "Mahsari Group logo" },
    { src: koperasiSiswazah, alt: "Koperasi Siswazah logo" },
    { src: delicaChocolate, alt: "Delica Chocolate logo" },
    { src: easyGlobal, alt: "Easy Global logo" },
    { src: olivko, alt: "Olivko logo" },
    { src: yayasanMahabbah, alt: "Yayasan Mahabbah logo" },
    { src: maryKay, alt: "Mary Kay logo" },
    { src: hotlinkLogo, alt: "Hotline logo" },
    { src: monsterEnergy, alt: "Monster Energy logo" },
    { src: mvLogo, alt: "MV logo" },
    { src: upmEsportsClub, alt: "UPM Esports Club logo" },
    { src: usPizza, alt: "US Pizza logo" },
    { src: redApe, alt: "Red Ape logo" },
    { src: kartaLogo, alt: "Karta logo" },
    { src: rhbGroup, alt: "RHB Group logo" },
  ];

  return (
    <div className="lg:px-37 md:px-22 px-[3.7rem] lg:py-14 md:py-[3.2rem] py-[2.2rem]">
      <h1 className="text-peskonrun-primary font-bold lg:text-4xl md:text-[2rem] text-3xl text-center">
        Event Partners
      </h1>

      {/* Static logos, responsive layout */}
      <div className="pt-16">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {partners.map((logo, i) => (
            <div key={i} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-14 lg:h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Website Powered By */}
      <div className="flex flex-col justify-center items-center gap-6 mt-16">
        <h1 className="font-semibold text-lg md:text-2xl">
          Website Powered By
        </h1>
        <img
          src={SonetraLogo}
          alt="Sonetra logo"
          className="h-14 md:h-20 object-contain"
        />
      </div>
    </div>
  );
};

export default EventPartners;
