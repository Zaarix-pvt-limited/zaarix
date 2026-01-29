import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import logo1 from "../assets/logo1.jpg";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";

export default function LogoInfoPage({ closePage }) {
  const [openForm, setOpenForm] = useState(false);

  // Unsplash high-quality logo mockups
  const logos = [
      logo1,logo2,logo3
  ];

  return (
    <>
      <section className="bg-[#050816] min-h-screen py-20 px-6 text-white">

  

        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <h1 className="text-4xl font-bold mb-4">
            Why a Professional Logo Matters
          </h1>

          <p className="text-gray-400 mb-10 leading-relaxed">
            A logo is the face of your brand. It creates the first impression,
            builds trust, and makes your business instantly recognizable.
            A professionally designed logo communicates credibility and value.
          </p>

          {/* Logo Samples */}
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {logos.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Logo Sample"
                className="rounded-xl drop-shadow-2xl hover:scale-105 transition duration-300"
              />
            ))}
          </div>

          {/* Why Choose Zaarix */}
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Zaarix OPC Pvt. Ltd.?
          </h2>

          <ul className="text-gray-300 space-y-3 mb-10">
            <li>✔ 100% Unique & Custom Logo Concepts</li>
            <li>✔ Professional Branding Experts</li>
            <li>✔ Unlimited Revisions Until Satisfaction</li>
            <li>✔ High-Resolution & All File Formats</li>
            <li>✔ Fast Turnaround Time</li>
            <li>✔ Trusted by 500+ Happy Clients</li>
          </ul>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setOpenForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 
                         px-8 py-3 rounded-lg text-white font-medium 
                         shadow-lg shadow-blue-500/40 
                         hover:scale-105 transition"
            >
              Let’s Do It
            </button>
            <br></br><br></br>
                <button
          onClick={closePage}
          className="mb-10 inline-flex items-center gap-2 
                     bg-white/5 border border-white/15 
                     px-5 py-2 rounded-lg text-blue-300 
                     backdrop-blur-md shadow-lg shadow-blue-500/20
                     hover:bg-blue-500/20 hover:text-white 
                     transition duration-300"
        >
          ← Back to Packages
        </button>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <ConsultationForm
        isOpen={openForm}
        closeForm={() => setOpenForm(false)}
      />
    </>
  );
}
