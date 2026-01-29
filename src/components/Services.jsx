import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { revealUp, cardStack } from "../animations/zaarixAnimations";
import AnimatedBackground from "../components/AnimatedBackground";

const API = "http://localhost:5000";

const defaultServices = [
  { title: "Custom Web Design", icon: "💻" },
  { title: "E-Commerce Solutions", icon: "🛒" },
  { title: "Mobile App Development", icon: "📱" },
  { title: "SEO & Marketing", icon: "🚀" },
  { title: "Logo Design", icon: "🎨" },
  { title: "Business Card Design", icon: "💳" },
  { title: "Banner Design", icon: "🖼️" },
  { title: "Flyer Design", icon: "📄" },
];

export default function Services() {
  const [dbServices, setDbServices] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/services`)
      .then(res => res.json())
      .then(setDbServices)
      .catch(err => console.log("API Error:", err));
  }, []);

  const mergedServices = [
    ...defaultServices,
    ...dbServices.filter(
      db => !defaultServices.some(def => def.title === db.title)
    )
  ];

  return (
    <section 
      id="services"
      className="relative overflow-hidden py-20 min-h-[600px] bg-[#050816]"
    >
      
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">

        <motion.h2
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-4xl font-bold mb-12 text-white"
        >
          Our <span className="text-blue-400">Services</span>
        </motion.h2>

        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mergedServices.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardStack}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur rounded-xl p-6 text-center
                         border border-white/10 shadow-lg shadow-black/40
                         hover:-translate-y-2 hover:shadow-blue-500/40 transition"
            >
              <div className="text-4xl mb-4">
                {s.icon || "💡"}
              </div>
              <h3 className="font-semibold text-white">
                {s.title}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
