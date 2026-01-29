import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import software1 from "../assets/software1.jpg";
import software2 from "../assets/software2.jpg";
import software3 from "../assets/software3.jpg";

export default function SoftwareInfoPage({ closePage }) {
  const [openForm, setOpenForm] = useState(false);

  const softwareImages = [software1, software2, software3];

  return (
    <>
      <section className="bg-[#050816] min-h-screen py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto">

          {/* ===== HEADER ===== */}
          <h1 className="text-4xl font-bold mb-4">
            Custom Software Development
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Every growing business needs smart systems to manage operations efficiently.  
            Custom software solutions such as CRM, ERP, Billing, Inventory, HRMS, 
            and Attendance Systems help automate workflows, reduce manual work, 
            and improve productivity.  
            Zaarix builds scalable, secure, and fully customized software 
            designed to match your exact business processes.
          </p>

          {/* ===== IMAGES (FIXED SIZE) ===== */}
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {softwareImages.map((img, i) => (
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

          {/* ===== SOFTWARE TYPES ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Types of Business Software We Build
          </h2>

          <ul className="text-gray-300 space-y-3 mb-10">
            <li>✔ CRM (Customer Relationship Management)</li>
            <li>✔ ERP (Enterprise Resource Planning)</li>
            <li>✔ Billing & Invoicing Systems</li>
            <li>✔ Inventory Management Software</li>
            <li>✔ HR & Attendance Management Systems</li>
            <li>✔ School / Institute Management Software</li>
            <li>✔ Fully Custom Business Applications</li>
          </ul>

          {/* ===== BENEFITS ===== */}
          <h2 className="text-3xl font-bold mb-4">
            Benefits of Custom Software
          </h2>

          <ul className="text-gray-300 space-y-3 mb-14">
            <li>✔ Automates business operations</li>
            <li>✔ Reduces human errors</li>
            <li>✔ Saves time and cost</li>
            <li>✔ Real-time data tracking</li>
            <li>✔ Better decision making</li>
            <li>✔ Secure and scalable systems</li>
          </ul>

          {/* ===== PRICING ===== */}
          <h2 className="text-3xl font-bold text-center mb-10">
            Software Development Packages
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">

            {/* Basic */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-8">
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Basic Software
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Standard Business Software
              </h3>

              <p className="text-3xl font-bold text-blue-400 mt-4">
                ₹30,000 – ₹1,00,000
              </p>

              <ul className="text-gray-300 text-sm mt-6 space-y-3">
                <li>✔ Ready-made modules</li>
                <li>✔ Basic UI Dashboard</li>
                <li>✔ User Login System</li>
                <li>✔ Database Setup</li>
                <li>✔ Basic Reports</li>
              </ul>
            </div>

            {/* Custom */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 
                            border border-blue-400/40 backdrop-blur-xl 
                            rounded-xl p-8 scale-105">

              <span className="bg-cyan-400 text-black text-xs px-3 py-1 rounded-full">
                Custom Solution
              </span>

              <h3 className="text-xl font-semibold mt-4">
                Fully Customized Software
              </h3>

              <p className="text-3xl font-bold text-blue-300 mt-4">
                ₹1,00,000 – ₹3,00,000+
              </p>

              <ul className="text-gray-200 text-sm mt-6 space-y-3">
                <li>✔ Tailored to your workflow</li>
                <li>✔ Advanced dashboards</li>
                <li>✔ API Integrations</li>
                <li>✔ High-level security</li>
                <li>✔ Scalable architecture</li>
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
              Let’s Build Your Software
            </button>

            <br /><br />

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
