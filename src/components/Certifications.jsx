import { motion } from "framer-motion";
import { revealUp, zoomIn, staggerContainer } from "../animations/zaarixAnimations";

import iso1 from "../assets/zaarix-iso1.png";
import iso2 from "../assets/zaarix-iso2.png";
import iso3 from "../assets/zaarix-iso3.png";

export default function Certifications() {
  return (
    <section className="relative bg-[#050816] py-20 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute left-10 top-0 w-100 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute right-10 bottom-0 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <motion.h2
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-3"
        >
          Globally Certified Excellence
        </motion.h2>

        <motion.p
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-gray-400 max-w-xl mx-auto mb-10"
        >
          Our processes and services are validated by internationally 
          recognized ISO certifications ensuring quality, security, and reliability.
        </motion.p>

        {/* Certificates Card */}
        <motion.div
          variants={zoomIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 
                     rounded-2xl px-10 py-8 inline-block"
        >
          {/* Stagger Logos */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-14"
          >
            {/* ISO 1 */}
            <motion.div variants={revealUp} className="group">
              <img 
                src={iso1} 
                alt="ISO 9001 Certification" 
                className="h-32 md:h-36 scale-110 grayscale 
                           group-hover:grayscale-0 group-hover:scale-125 
                           transition duration-300 drop-shadow-2xl"
              />
              <p className="text-gray-300 text-sm mt-4">
                ISO 20000: Service & <br></br>
                Management
              </p>
            </motion.div>

            {/* ISO 2 */}
            <motion.div variants={revealUp} className="group">
              <img 
                src={iso2} 
                alt="ISO 27001 Certification" 
                className="h-32 md:h-36 scale-110 grayscale 
                           group-hover:grayscale-0 group-hover:scale-125 
                           transition duration-300 drop-shadow-2xl"
              />
              <p className="text-gray-300 text-sm mt-4">
                ISO 9001: Quality
              </p>
            </motion.div>

            {/* ISO 3 */}
            <motion.div variants={revealUp} className="group">
              <img 
                src={iso3} 
                alt="ISO 14001 Certification" 
                className="h-32 md:h-36 scale-110 grayscale 
                           group-hover:grayscale-0 group-hover:scale-125 
                           transition duration-300 drop-shadow-2xl"
              />
              <p className="text-gray-300 text-sm mt-4">
                ISO 27001: Security
              </p>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
