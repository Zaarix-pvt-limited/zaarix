import { useState } from "react";
import { motion } from "framer-motion";
import ConsultationForm from "./ConsultationForm";
import laptopImage from "../assets/laptop.png";
import AnimatedBackground from "./AnimatedBackground";
import { revealUp, slideLeft, slideRight, textVariant } from "../animations/zaarixAnimations";

const headingText = "We Design Stunning Websites That Boost Your Business";

export default function Hero() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#050816]"
    >
      <AnimatedBackground />

      {/* Gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center pt-32 z-10">

        {/* LEFT CONTENT */}
        <motion.div variants={slideLeft} initial="hidden" animate="visible">

          {/* Typing Heading */}
          <motion.h1
            initial="hidden"
            animate="visible"
            className="text-5xl font-bold leading-tight text-white"
          >
            {headingText.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={textVariant}
              >
                {char}
              </motion.span>
            ))}

            {/* Blinking Cursor */}
            <motion.span
              className="text-blue-500"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              |
            </motion.span>
          </motion.h1>

          {/* Paragraph Reveal */}
          <motion.p variants={revealUp} className="text-gray-400 mt-6">
            At Zaarix, we design and develop modern, high-performance websites
            that help brands stand out online.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={revealUp} className="flex gap-4 mt-8">
            <button
              onClick={() => setOpenForm(true)}
              className="bg-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-600 transition"
            >
              Get a Free Consultation
            </button>

            <a href="#projects">
              <button className="border border-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-500/10 transition">
                View Our Work
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="visible"
          className="hidden md:flex justify-center relative"
        >
          <div className="absolute w-96 h-96 bg-blue-500/40 blur-3xl rounded-full"></div>

          <motion.img
            src={laptopImage}
            alt="Zaarix Laptop"
            className="relative w-[520px] drop-shadow-2xl animate-float"
            variants={revealUp}
          />
        </motion.div>

      </div>

      {/* POPUP FORM */}
      <ConsultationForm
        isOpen={openForm}
        closeForm={() => setOpenForm(false)}
      />
    </section>
  );
}
