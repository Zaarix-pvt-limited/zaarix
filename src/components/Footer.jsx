import { motion } from "framer-motion";
import {
  revealUp,
  zoomIn,
  staggerContainer,
} from "../animations/zaarixAnimations";
import logoText from "../assets/logo-text.png";

import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-[#050816] pt-20 pb-8 overflow-hidden"
    >
      {/* Glow background */}
      <div className="absolute -top-10 left-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Glass Container */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10"
        >
          {/* Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-10"
          >
            {/* Brand */}
            <motion.div variants={revealUp}>
              <img
                src={logoText}
                alt="Zaarix Logo"
                className="h-[40px] w-auto scale-[3.5] origin-left drop-shadow-xl"
              />

              <p className="text-gray-400 mt-6 text-sm leading-relaxed">
                Zaarix OPC Pvt. Ltd. is a creative digital agency dedicated to
                transforming ideas into powerful online experiences. We
                specialize in modern web design, full-stack development. Our
                mission is to help brands stand out in the digital world through
                innovation, performance, and strategy-driven design. With a
                client-first approach and a passion for excellence, we deliver
                results that build trust, visibility, and long-term growth.
              </p>

              <div className="mt-4 h-[3px] w-16 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"></div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://www.facebook.com/share/14UMHA1qWtX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500 transition"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>

                <a
                  href="https://www.instagram.com/zaarix_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center hover:bg-pink-500 transition"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={revealUp}>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#home" className="hover:text-blue-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-blue-400 transition"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-blue-400 transition"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-blue-400 transition"
                  >
                    AboutUs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={revealUp}>
              <h3 className="text-white font-semibold mb-4">What We Do</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Custom Web Design</li>
                <li>2D-3D logo Design</li>

                <li>Mobile App Development</li>
                <li>Full-Stack Development</li>
                <li>E-Commerce Solutions</li>
                <li>SEO & Digital Marketing</li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={zoomIn}>
              <h3 className="text-white font-semibold mb-4">Get in Touch</h3>

              <ul className="space-y-4 text-gray-400 text-sm mb-6">
                {/* Address */}
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                  <span>
                    1st Floor, 10/43, Anurag Nagar, Balkeshwar, Kamla Nagar,
                    Agra – 282005
                  </span>
                </li>

                {/* Phone */}
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <a
                    href="tel:+918755466995"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    +91 87554 66995
                  </a>
                </li>

                {/* Email */}
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <a
                    href="mailto:contact@zaarix.com"
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    contact@zaarix.com
                  </a>
                </li>
              </ul>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-blue-500/20">
                <iframe
                  title="Zaarix Location"
                  src="https://www.google.com/maps?q=Agra%20Uttar%20Pradesh&output=embed"
                  width="100%"
                  height="180"
                  loading="lazy"
                  className="w-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Line */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Zaarix — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
