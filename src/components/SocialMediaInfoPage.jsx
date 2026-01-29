import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import social1 from "../assets/social1.jpg";
import social2 from "../assets/social2.jpg";
import social3 from "../assets/social3.jpg";



export default function SocialMediaInfoPage({ closePage }) {
  const [openForm, setOpenForm] = useState(false);

  const marketingImages = [
    social1,social2,social3
  ];

  return (
    <>
      <section className="bg-[#050816] min-h-screen py-20 px-6 text-white">


        <div className="max-w-6xl mx-auto">

          {/* ===== HEADER ===== */}
          <h1 className="text-4xl font-bold mb-4">
            Social Media Marketing & SEO Services
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            In today’s digital era, your brand’s online presence decides how 
            fast your business grows. Social Media Marketing, SEO, and Google Ads 
            help you reach the right audience, build trust, and generate 
            consistent leads.  
            Zaarix delivers result-driven digital marketing strategies 
            designed to increase visibility, engagement, and sales.
          </p>

          {/* ===== IMAGES ===== */}
          
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {marketingImages.map((img, i) => (
              <div 
                key={i} 
                className="w-full h-64 rounded-xl overflow-hidden"
              >
                <img
                  src={img}
                  alt="Software Development"
                  className="w-full h-full object-cover 
                             rounded-xl drop-shadow-2xl 
                             hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>

          {/* ===== SERVICES OFFERED ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Our Digital Marketing Services
          </h2>

          <ul className="text-gray-300 space-y-3 mb-10">
            <li>✔ Social Media Account Handling (Instagram, Facebook, LinkedIn)</li>
            <li>✔ Content Creation & Creative Posts</li>
            <li>✔ Audience Growth & Engagement</li>
            <li>✔ SEO (Search Engine Optimization)</li>
            <li>✔ Google Ads & Paid Campaign Management</li>
            <li>✔ Performance Tracking & Reports</li>
          </ul>

          {/* ===== BENEFITS ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Benefits of Digital Marketing
          </h2>

          <ul className="text-gray-300 space-y-3 mb-14">
            <li>✔ Increase brand awareness</li>
            <li>✔ Generate quality leads</li>
            <li>✔ Improve Google ranking</li>
            <li>✔ Target the right audience</li>
            <li>✔ Higher conversion rates</li>
            <li>✔ Cost-effective marketing</li>
          </ul>

          {/* ===== PRICING ===== */}
          <h2 className="text-3xl font-bold text-center mb-10">
            Digital Marketing Packages
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">

            {/* Social Media */}
            <div className="bg-white/5 border border-white/10 
                            backdrop-blur-xl rounded-xl p-8">

              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Social Media
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Social Media Handling
              </h3>

              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹3,000 – ₹10,000 / month
              </p>

              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Creative Post Design</li>
                <li>✔ Caption Writing</li>
                <li>✔ Page Management</li>
                <li>✔ Engagement Growth</li>
              </ul>
            </div>

            {/* SEO */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 
                            border border-blue-400/40 
                            backdrop-blur-xl rounded-xl p-8 scale-105">

              <span className="bg-cyan-400 text-black text-xs px-3 py-1 rounded-full">
                SEO Service
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Search Engine Optimization
              </h3>

              <p className="text-3xl font-bold text-blue-300 mt-4">
                ₹8,000 – ₹25,000 / month
              </p>

              <ul className="text-gray-200 text-sm mt-6 space-y-3">
                <li>✔ Keyword Research</li>
                <li>✔ On-Page SEO</li>
                <li>✔ Off-Page SEO</li>
                <li>✔ Google Ranking Growth</li>
              </ul>
            </div>

            {/* Google Ads */}
            <div className="bg-white/5 border border-white/10 
                            backdrop-blur-xl rounded-xl p-8">

              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Google Ads
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Ads Campaign Management
              </h3>

              <p className="text-3xl font-bold text-blue-400 mt-4">
                As per Ads Budget
              </p>

              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Campaign Setup</li>
                <li>✔ Target Audience Selection</li>
                <li>✔ Conversion Optimization</li>
                <li>✔ Performance Reports</li>
              </ul>
            </div>

          </div>

          {/* ===== FINAL CTA ===== */}
          <div className="text-center">
            <button
              onClick={() => setOpenForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 
                         px-10 py-3 rounded-lg text-white font-medium 
                         shadow-lg shadow-blue-500/40 
                         hover:scale-105 transition"
            >
              Let’s Grow Your Brand
            </button><br></br><br></br>
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
