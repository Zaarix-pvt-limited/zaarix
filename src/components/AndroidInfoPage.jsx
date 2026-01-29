import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import android1 from "../assets/android1.jpg";
import android2 from "../assets/android2.jpg";
import android3 from "../assets/android3.jpg";
export default function AndroidInfoPage({ closePage }) {
  const [openForm, setOpenForm] = useState(false);

  const androidImages = [
    android1,android2,android3
  ];

  return (
    <>
      <section className="bg-[#050816] min-h-screen py-20 px-6 text-white">

        {/* Back Button */}
    

        <div className="max-w-6xl mx-auto">

          {/* ===== HEADER ===== */}
          <h1 className="text-4xl font-bold mb-4">
            Android App Development
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Mobile apps have become essential for modern businesses.  
            A powerful Android application helps you connect directly with customers,
            automate services, and build long-term brand loyalty.  
            Zaarix develops secure, fast, and user-friendly Android applications
            tailored to your business goals.
          </p>

          {/* ===== IMAGES ===== */}
         <div className="grid md:grid-cols-3 gap-8 mb-14">
            {androidImages.map((img, i) => (
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
          {/* ===== BENEFITS ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Benefits of an Android Application
          </h2>

          <ul className="text-gray-300 space-y-3 mb-10">
            <li>✔ Direct communication with customers</li>
            <li>✔ Faster service delivery</li>
            <li>✔ Increased customer engagement</li>
            <li>✔ Strong brand presence on mobile</li>
            <li>✔ Push notifications for marketing</li>
            <li>✔ Scalable digital growth</li>
          </ul>

          {/* ===== WHY ZAARIX ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Zaarix OPC Pvt. Ltd.?
          </h2>

          <ul className="text-gray-300 space-y-3 mb-14">
            <li>✔ Modern UI/UX focused design</li>
            <li>✔ Secure Login & Authentication</li>
            <li>✔ API & Database Integration</li>
            <li>✔ Admin Dashboard & Control Panel</li>
            <li>✔ Play Store Deployment Support</li>
            <li>✔ Long-term Maintenance & Support</li>
          </ul>

          {/* ===== PRICING TIERS ===== */}
          <h2 className="text-3xl font-bold text-center mb-10">
            Android App Development Packages
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">

            {/* Basic */}
            <div className="bg-white/5 border border-white/10 
                            backdrop-blur-xl rounded-xl p-8">

              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Basic App
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Starter Android App
              </h3>

              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹40,000 – ₹1,50,000
              </p>

              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Clean UI Design</li>
                <li>✔ Static Content</li>
                <li>✔ Contact / Inquiry Form</li>
                <li>✔ Play Store Setup</li>
              </ul>
            </div>

            {/* Medium */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 
                            border border-blue-400/40 
                            backdrop-blur-xl rounded-xl p-8 scale-105">

              <span className="bg-cyan-400 text-black text-xs px-3 py-1 rounded-full">
                Professional
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Business Android App
              </h3>

              <p className="text-3xl font-bold text-blue-300 mt-4">
                ₹1,50,000 – ₹4,00,000
              </p>

              <ul className="text-gray-200 text-sm mt-6 space-y-3">
                <li>✔ Secure Login System</li>
                <li>✔ API Integration</li>
                <li>✔ Admin Dashboard</li>
                <li>✔ Push Notifications</li>
                <li>✔ Database Integration</li>
              </ul>
            </div>

            {/* Advanced */}
            <div className="bg-white/5 border border-white/10 
                            backdrop-blur-xl rounded-xl p-8">

              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Advanced
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Custom Enterprise App
              </h3>

              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹4,00,000+
              </p>

              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Fully Custom Features</li>
                <li>✔ High-Level Security</li>
                <li>✔ ERP / CRM Integration</li>
                <li>✔ Scalable Architecture</li>
                <li>✔ Long-Term Support</li>
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
              Let’s Build Your Android App
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
