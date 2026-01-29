import { useState } from "react";
import { motion } from "framer-motion";
import { revealUp, zoomIn, slideLeft } from "../animations/zaarixAnimations";
import ConsultationForm from "./ConsultationForm";
import AnimatedBackground from "../components/AnimatedBackground";

export default function FinalCTA() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#050816] py-20">

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Glow Overlays (optional) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to <span className="text-blue-400">Elevate</span> Your Business?
          </h2>

          <p className="text-gray-400 text-lg">
            Partner with Zaarix to build digital experiences that stand out and drive real growth.
          </p>

          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✔</span>
              <span><b>Customized Web Solutions</b> tailored to your business goals.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✔</span>
              <span><b>Cutting-Edge Technology Stack</b> for high performance and scalability.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✔</span>
              <span><b>Modern Excellence in Web Design</b> that captivates and converts.</span>
            </li>
          </ul>
        </motion.div>

        {/* RIGHT CTA CARD */}
        <motion.div
          variants={zoomIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl text-center space-y-6">
            <h3 className="text-2xl font-semibold text-white">
              Start Your Project Today
            </h3>

            <p className="text-gray-400">
              Get a free consultation and let’s build something amazing together.
            </p>

            <button
              onClick={() => setOpenForm(true)}
              className="bg-blue-500 px-8 py-3 rounded-lg text-white font-medium 
                         hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
            >
              Request Consultation
            </button>
          </div>
        </motion.div>

      </div>

      {/* Consultation Modal */}
      <ConsultationForm 
        isOpen={openForm}
        closeForm={() => setOpenForm(false)}
      />
    </section>
  );
}
