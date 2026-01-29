import { useState } from "react";
import emailjs from "@emailjs/browser";


const SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID ;
const TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID ;
const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY ;

export default function ConsultationForm({ isOpen, closeForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setStatusMessage("");
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatusMessage("");

    try {
      
      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service || "Not specified",
        message: formData.message,
      
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        { publicKey: PUBLIC_KEY }
      );

      if (result.status !== 200) {
        throw new Error("EmailJS failed");
      }

      setStatusMessage("Your request has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });

      
      setTimeout(() => {
        setStatusMessage("");
        closeForm();
      }, 1200);
    } catch (err) {
      console.error("EmailJS submit error:", err);
      setStatusMessage(
        "Could not send your request. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#050816] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Free Consultation
          </h2>
          <button
            type="button"
            onClick={closeForm}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Fill in your details and we&apos;ll get back to you on{" "}
          <span className="text-blue-400 font-medium">call or email</span>{" "}
          within a few hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Phone<span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Service (optional)
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-[#050816] text-gray-400">
                Select a service
              </option>
              <option value="Web Development" className="bg-[#050816]">
                Web Development
              </option>
              <option value="Ecommerce" className="bg-[#050816]">
                Ecommerce Store
              </option>
              <option value="App Development" className="bg-[#050816]">
                Android / iOS App
              </option>
              <option value="Branding & Logo" className="bg-[#050816]">
                Branding & Logo
              </option>
              <option value="Social Media" className="bg-[#050816]">
                Social Media Marketing
              </option>
              <option value="Other" className="bg-[#050816]">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Project Details<span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us briefly about your project, goals or any questions you have."
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">{errors.message}</p>
            )}
          </div>

          {statusMessage && (
            <p className="text-sm text-center text-blue-300">{statusMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}