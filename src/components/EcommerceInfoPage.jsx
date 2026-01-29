import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import ecommerce1 from "../assets/ecommerce1.jpg";
import ecommerce2 from "../assets/ecommerce2.jpg";
import ecommerce3 from "../assets/ecommerce3.jpg";

export default function EcommerceInfoPage({ closePage }) {
  const [openForm, setOpenForm] = useState(false);

  // 👉 Local images array
  const ecommerceImages = [ecommerce1, ecommerce2, ecommerce3];

  return (
    <>
      <section className="bg-[#050816] min-h-screen py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto">

          {/* ===== HERO HEADING ===== */}
          <h1 className="text-4xl font-bold mb-4">
            E-Commerce Website Development
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            In today’s digital world, customers prefer shopping online.
            A professional E-Commerce website allows your business to sell
            products 24×7, reach customers globally, and increase revenue
            without physical store limitations.
            Zaarix builds fast, secure, and conversion-optimized online stores
            designed to scale with your business.
          </p>

          {/* ===== IMAGES ===== */}
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {ecommerceImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Ecommerce"
                className="rounded-xl drop-shadow-2xl hover:scale-105 transition duration-300"
              />
            ))}
          </div>

          {/* ===== BENEFITS ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Benefits of an E-Commerce Website
          </h2>

          <ul className="text-gray-300 space-y-3 mb-10">
            <li>✔ Sell products 24×7 without location limits</li>
            <li>✔ Reach national & international customers</li>
            <li>✔ Automated order & inventory management</li>
            <li>✔ Secure online payment integration</li>
            <li>✔ Higher sales & brand visibility</li>
            <li>✔ Data insights for better marketing decisions</li>
          </ul>

          {/* ===== WHY ZAARIX ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Zaarix OPC Pvt. Ltd.?
          </h2>

          <ul className="text-gray-300 space-y-3 mb-14">
            <li>✔ 100% Custom UI/UX Design</li>
            <li>✔ Mobile-First Responsive Development</li>
            <li>✔ SEO & Speed Optimized Stores</li>
            <li>✔ Secure Payment Gateway Setup</li>
            <li>✔ Admin Dashboard & Order Panel</li>
            <li>✔ Ongoing Support & Maintenance</li>
          </ul>

          {/* ===== PACKAGES ===== */}
          <h2 className="text-3xl font-bold text-center mb-10">
            E-Commerce Development Packages
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">

            {/* Basic */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8">
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Basic Store
              </span>
              <h3 className="text-xl font-semibold text-white mt-4">
                Starter E-Commerce
              </h3>
              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹11,999 – ₹15,000
              </p>
              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Up to 20 Products</li>
                <li>✔ Basic UI Design</li>
                <li>✔ Payment Gateway</li>
                <li>✔ Mobile Responsive</li>
              </ul>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 
                            border border-blue-400/40 backdrop-blur-xl 
                            rounded-xl p-8 scale-105">
              <span className="bg-cyan-400 text-black text-xs px-3 py-1 rounded-full">
                Professional
              </span>
              <h3 className="text-xl font-semibold text-white mt-4">
                Business E-Commerce
              </h3>
              <p className="text-3xl font-bold text-blue-300 mt-4">
                ₹15,000 – ₹40,000
              </p>
              <ul className="text-gray-200 text-sm mt-6 space-y-3">
                <li>✔ Unlimited Products</li>
                <li>✔ Premium UI/UX</li>
                <li>✔ Advanced Filters</li>
                <li>✔ Admin Dashboard</li>
                <li>✔ SEO Optimization</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8">
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Enterprise
              </span>
              <h3 className="text-xl font-semibold text-white mt-4">
                Advanced E-Commerce
              </h3>
              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹40,000 – ₹1,00,000+
              </p>
              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Multi-Vendor Marketplace</li>
                <li>✔ Custom Integrations</li>
                <li>✔ CRM / ERP Connection</li>
                <li>✔ High Security Setup</li>
                <li>✔ Scalable Architecture</li>
              </ul>
            </div>

          </div>

          {/* ===== CTA ===== */}
          <div className="text-center">
            <button
              onClick={() => setOpenForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 
                         px-10 py-3 rounded-lg text-white font-medium 
                         shadow-lg shadow-blue-500/40 
                         hover:scale-105 transition"
            >
              Let’s Build Your Online Store
            </button>

            <br /><br />

            <button
              onClick={closePage}
              className="mb-10 inline-flex items-center gap-2 
                         bg-white/5 border border-white/15 
                         px-5 py-2 rounded-lg text-blue-300 
                         backdrop-blur-md shadow-lg shadow-blue-500/20
                         hover:bg-blue-500/20 hover:text-white transition"
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
