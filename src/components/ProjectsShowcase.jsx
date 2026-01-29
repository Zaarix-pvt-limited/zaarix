/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { revealUp, zoomIn } from "../animations/zaarixAnimations";
import AnimatedBackground from "../components/AnimatedBackground";

import project1 from "../assets/project1.jpg";
import project5 from "../assets/project5.jpg";
import project4 from "../assets/project4.jpg";

const API = "http://localhost:5000";

const defaultProjects = [
  {
    title: "Corporate Business Site",
    category: "UI/UX Design",
    image: project1,
    link: "https://corporateweb-01.netlify.app/"
  },
  {
    title: "Ecommerce Website",
    category: "Brand Identity",
    image: project4,
    link: "https://trendaro-2225.netlify.app/"
  },

  {
    title: "A Photogallery Website",
    category: "UI Design",
    image: project5,
    link: "https://photovault2225.netlify.app/"
  }
];

export default function ProjectsShowcase() {
  const [dbProjects, setDbProjects] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then(res => res.json())
      .then(setDbProjects)
      .catch(err => console.log("API Error:", err));
  }, []);

  const mergedProjects = [
    ...defaultProjects,
    ...dbProjects.filter(
      db => !defaultProjects.some(def => def.title === db.title)
    )
  ];

  return (
    <section 
      id="projects" 
      className="relative overflow-hidden bg-[#050816] py-20"
    >
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-bold text-white">
            Our Latest <span className="text-blue-400">Projects</span>
          </h2>
          <p className="text-gray-400 mt-3">
            Explore some of the recent work crafted by Zaarix for growing brands.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mergedProjects.map((project, index) => (
            <motion.div
              key={index}
              variants={zoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden 
                         border border-white/10 bg-white/5 backdrop-blur-lg
                         hover:scale-[1.02] transition duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-60 object-cover"
              />

              <div className="p-5 space-y-2">
                <p className="text-blue-400 text-sm">
                  {project.category || "Project"}
                </p>

                <h3 className="text-white text-xl font-semibold">
                  {project.title}
                </h3>

                <a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  View Project
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
