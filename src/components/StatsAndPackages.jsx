import { useState } from "react";
import { motion } from "framer-motion";
import { revealUp, zoomIn } from "../animations/zaarixAnimations";

import ConsultationForm from "./ConsultationForm";

import LogoInfoPage from "./LogoInfoPage";
import EcommerceInfoPage from "./EcommerceInfoPage";
import AndroidInfoPage from "./AndroidInfoPage";
import SoftwareInfoPage from "./SoftwareInfoPage";
import SocialMediaInfoPage from "./SocialMediaInfoPage";

import AnimatedBackground from "../components/AnimatedBackground";

export default function StatsAndPackages() {
  const [openForm, setOpenForm] = useState(false);

  const [showLogoPage, setShowLogoPage] = useState(false);
  const [showEcomPage, setShowEcomPage] = useState(false);
  const [showAndroidPage, setShowAndroidPage] = useState(false);
  const [showSoftwarePage, setShowSoftwarePage] = useState(false);
  const [showSocialPage, setShowSocialPage] = useState(false);

  // Conditional pages
  if (showLogoPage) return <LogoInfoPage closePage={() => setShowLogoPage(false)} />;
  if (showEcomPage) return <EcommerceInfoPage closePage={() => setShowEcomPage(false)} />;
  if (showAndroidPage) return <AndroidInfoPage closePage={() => setShowAndroidPage(false)} />;
  if (showSoftwarePage) return <SoftwareInfoPage closePage={() => setShowSoftwarePage(false)} />;
  if (showSocialPage) return <SocialMediaInfoPage closePage={() => setShowSocialPage(false)} />;

  return (
    <>
      <section id ="Packages" className="relative overflow-hidden bg-[#050816] py-20">

        {/* Animated Background */}
        <AnimatedBackground />

        <div className="relative z-10">


          {/* ===== PACKAGES ===== */}
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-12">
              Our Packages
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <PackageCard
                tag="Popular"
                title="Website Development"
                price="₹11,999+"
                features={[
                  "Domain & Hosting",
                  "Secure Website (SSL)",
                  "SEO Optimization",
                  "Advanced Support"
                ]}
                onClick={() => setShowEcomPage(true)}
              />

              <PackageCard
                tag="Professional"
                title="Android App Development"
                price="₹40,000+"
                features={[
                  "Clean UI/UX",
                  "Secure Login",
                  "API Integration",
                  "Play Store Support"
                ]}
                highlight
                onClick={() => setShowAndroidPage(true)}
              />

              <PackageCard
                tag="Marketing"
                title="Social Media & SEO"
                price="₹3,000+/month"
                features={[
                  "Social Media Handling",
                  "SEO Services",
                  "Google Ads",
                  "Audience Growth"
                ]}
                onClick={() => setShowSocialPage(true)}
              />

              <PackageCard
                tag="Starter"
                title="Logo Designing"
                price="₹999/-"
                features={[
                  "2D–3D Logo Concepts",
                  "Business Card",
                  "Letterhead",
                  "Envelope",
                  "Logo Intro Video"
                ]}
                onClick={() => setShowLogoPage(true)}
              />

              <PackageCard
                tag="Enterprise"
                title="Custom Software Development"
                price="₹30,000+"
                features={[
                  "CRM / ERP Systems",
                  "Billing & Inventory",
                  "HR & Attendance",
                  "Custom Business Software"
                ]}
                onClick={() => setShowSoftwarePage(true)}
              />

            </div>
          </motion.div>

        </div>
      </section>

      {/* Consultation Popup */}
      <ConsultationForm
        isOpen={openForm}
        closeForm={() => setOpenForm(false)}
      />
    </>
  );
}

/* ===== Reusable Components ===== */

function StatCard({ icon, value, label }) {
  return (
    <motion.div
      variants={zoomIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-3xl font-bold text-blue-400">{value}</h3>
      <p className="text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

function PackageCard({ tag, title, price, features, onClick, highlight }) {
  return (
    <motion.div
      variants={zoomIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`border border-white/10 backdrop-blur-xl rounded-xl p-8 hover:scale-105 transition
      ${highlight 
        ? "bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border-blue-400/40 scale-105" 
        : "bg-white/5"}`}
    >
      <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
        {tag}
      </span>

      <h3 className="text-xl font-semibold text-white mt-4">{title}</h3>

      <p className="text-4xl font-bold text-blue-400 mt-4">{price}</p>

      <ul className="text-gray-300 text-sm mt-6 space-y-3 text-left">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-400 
                   text-white py-2 rounded-lg font-medium 
                   shadow-lg shadow-blue-500/40 
                   hover:scale-105 transition"
      >
        Book Now
      </button>
    </motion.div>
  );
}
