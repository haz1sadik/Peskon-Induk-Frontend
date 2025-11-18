import { Instagram, Tiktok, Youtube } from "../../assets/icons";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-white shadow-[0_1px_20px_0_rgba(0,0,0,0.07)]">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-25 py-10 flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Left: Logos + Socials */}
          <div className="flex flex-col items-center md:items-start gap-6">
            {/* Logos */}
            <div className="flex items-center justify-center gap-3 min-w-90">
              <img src="/PESKON2025_Logo.png" alt="peskon2025" className="h-7 md:h-10.75"/>
              <img src="/UPM_Putra_Logo.png" alt="upm putra" className="h-14 md:h-17 object-contain"/>
            </div>

            {/* Follow us */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-gray-800 font-medium">Follow us</p>
              <div className="flex gap-5">
                <a href="https://www.instagram.com/peskon_upm?utm_source=ig_web_button_share_sheet&igsh=NjFkbWJ6NHJ6NXR4" target="_blank">
                  <Instagram />
                </a>
                <a href="https://www.tiktok.com/@peskon_upm?_t=ZS-90kzIb9oDYn&_r=1" target="_blank">
                  <Tiktok />
                </a>
                <a href="https://www.youtube.com/@UniversitiPutraMalaysia" target="_blank">
                  <Youtube />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <h2 className="text-lg font-extrabold tracking-widest">
              CONTACT US
            </h2>
            <div className="w-30 md:w-70 h-0.5 bg-black mb-2"></div>
            <p className="font-semibold">
              <span className="font-normal">Whatsapp:</span><br/> +6013-301 8512 - Cik Ezzah
            </p>
            <p className="font-semibold">
              <span className="font-normal">Whatsapp:</span><br/> +6019-310 2870 - Cik Najiheen
            </p>

          </div>
        </div>

        <div className="bg-gray-100 py-5">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 Sonetra. All rights reserved
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
