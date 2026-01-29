import { motion } from "framer-motion";
import { revealUp, zoomIn } from "../animations/zaarixAnimations";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#050816] py-20">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        {/* Opening Hours Card */}
        <motion.div
          variants={zoomIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 
                     backdrop-blur-xl rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Opening Hours
          </h2>

          <ul className="text-gray-300 space-y-3 text-sm">
            <li className="flex justify-between border-b border-white/10 pb-2">
              Monday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              Tuesday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              Wednesday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              Thursday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              Friday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              Saturday <span>10AM - 7PM</span>
            </li>
            <li className="flex justify-between text-red-400 font-medium">
              Sunday <span>OFF</span>
            </li>
          </ul>
        </motion.div>

      </div>
    </section>
  );
}
