import { useState } from "react";
import ConsultationForm from "./ConsultationForm";

import logoIcon from "../assets/logo-image.png";
import logoText from "../assets/logo-text.png";

export default function Navbar() {
  const [openForm, setOpenForm] = useState(false);
  const [active, setActive] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);

  const menu = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Packages", id: "Packages" },
    { name: "Contact", id: "contact" },
  ];

  function handleScroll(item) {
    setActive(item.name);
    setMobileMenu(false);
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 z-50 
                      bg-[#050816]/85 backdrop-blur-lg 
                      border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleScroll({ name: "Home", id: "home" })}
          >
            <img
              src={logoIcon}
              alt="Zaarix Logo Icon"
              className="w-10 h-10 scale-160 drop-shadow-2xl"
            />
            <img
              src={logoText}
              alt="Zaarix Logo Text"
              className="h-[34px] w-auto scale-350 origin-left drop-shadow-xl"
            />
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-10 font-medium text-[15px]">
            {menu.map((item) => (
              <li
                key={item.name}
                onClick={() => handleScroll(item)}
                className="relative cursor-pointer group"
              >
                <span
                  className={`transition-colors duration-300 ${
                    active === item.name
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {item.name}
                </span>

                <span
                  className={`absolute left-0 -bottom-2 h-[2px] 
                  bg-gradient-to-r from-blue-400 to-cyan-300 
                  rounded-full transition-all duration-300
                  ${active === item.name ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </li>
            ))}
          </ul>

          {/* DESKTOP CTA */}
          <button
            onClick={() => setOpenForm(true)}
            className="hidden md:block bg-gradient-to-r from-blue-500 to-cyan-400 
                       text-white px-5 py-2 rounded-lg font-medium 
                       shadow-lg shadow-blue-500/40 
                       hover:scale-105 transition duration-300"
          >
            Get a Free Consultation
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden bg-[#050816] border-t border-white/10">
            <ul className="flex flex-col text-center py-4 gap-4 font-medium">
              {menu.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleScroll(item)}
                  className={`cursor-pointer ${
                    active === item.name ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </li>
              ))}

              {/* MOBILE CTA */}
              <button
                onClick={() => {
                  setOpenForm(true);
                  setMobileMenu(false);
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 
                           text-white px-5 py-2 rounded-lg font-medium 
                           mx-6"
              >
                Get a Free Consultation
              </button>
            </ul>
          </div>
        )}
      </nav>

      <ConsultationForm
        isOpen={openForm}
        closeForm={() => setOpenForm(false)}
      />
    </>
  );
}
