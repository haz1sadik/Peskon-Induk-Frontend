import React from "react";
import upm from '../assets/logoupm.png';
import mpp from '../assets/logompp.png';
import mahsuri from '../assets/logomahsuri.png';
import mevent from '../assets/logomevent.png';
import karta from '../assets/logokarta.png';
import paynet from '../assets/logopaynet.png';
import sonetra from '../assets/logosonetra.png';

const EventPartners = () => {
  const partners = [
    upm,
    mpp,
    mahsuri,
    mevent,
    karta,
    paynet,
    sonetra,
  ];

  return (
    <section className="w-full bg-white py-14 px-6 md:px-16">
      <h2 className="text-center text-black-800 md:text-3xl font-extrabold mb-10">
        Event Partners
      </h2>

      <div className="flex flex-wrap justify-center gap-x-40 gap-y-10">
        {partners.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-36 h-36"
          >
            <img
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventPartners;
