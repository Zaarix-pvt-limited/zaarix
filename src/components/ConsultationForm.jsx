import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function ConsultationForm({ isOpen, closeForm }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    emailjs.init("4SPbEcXklnGZRq_ao"); // public key
  }, []);

  if (!isOpen) return null;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    emailjs.send(
      "service_l159u8m",          // service id
      "template_xxxxx",           // ❗ REAL TEMPLATE ID
      formData
    )
    .then(() => {
      alert("MAIL SENT SUCCESSFULLY ✅");
      closeForm();
    })
    .catch((err) => {
      console.log("ERROR:", err);
      alert("MAIL FAILED ❌ Check console");
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="phone" onChange={handleChange} placeholder="Phone" />
      <textarea name="message" onChange={handleChange} placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  );
}