import { useState } from "react";
import { motion } from "framer-motion";
import { revealUp } from "../animations/zaarixAnimations";
import AnimatedBackground from "./AnimatedBackground";
import ConsultationForm from "./ConsultationForm";

export default function AboutUs() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 bg-[#050816] flex items-center"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Gradient Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">

        {/* Heading */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-5xl font-extrabold text-white">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Discover who we are and what drives our digital creativity
          </p>
        </motion.div>

        {/* Text Content */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed space-y-6"
        >
          <p>
            We craft innovative Web Applications, APIs, and Web Design solutions
            that empower businesses to connect, engage, and grow in the digital era.
          </p>

          <p>
            From responsive websites to interactive web apps — we build fast,
            scalable, and visually stunning digital experiences.
          </p>

          <p>
            Our passion lies in next-gen UI, animations, and clean code that
            keep users engaged and brands ahead of the curve.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 justify-items-center">

          {[
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "5+", label: "Years Experience" },
            { value: "24/7", label: "Support" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 
                         rounded-2xl px-6 py-7 text-center w-[170px]
                         shadow-lg shadow-blue-500/10"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {item.value}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">{item.label}</p>
            </motion.div>
          ))}

        </div>

        {/* CTA Button */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <button
            onClick={() => setOpenForm(true)}
            className="relative px-10 py-4 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-blue-500 to-purple-500
                       shadow-xl shadow-blue-500/40
                       hover:scale-105 transition duration-300"
          >
            Get a Free Consultation
          </button>
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
