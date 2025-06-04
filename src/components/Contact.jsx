import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { EarthCanvas } from "./canvas";

const Contact = () => {
  const formRef = useRef();
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_tiz4tf5",
        "template_4t2ddnv",
        {
          from_name: form.name,
          to_name: "Alonso",
          from_email: form.email,
          to_email: "alonso.castillogon@gmail.com",
          message: form.message,
        },
        "Ni8_bJo79S9blNaUH"
      )
      .then(
        () => {
          setLoading(false);
          {
            setSuccess(true);
          }
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setSuccess(false);
          console.log(error);
          setLoading(false);
        }
      );
  };

  return (
    <div
      className={`xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] relative w-full max-w-2xl px-6 py-10"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl pointer-events-none"></div>
        <div className="relative z-10 backdrop-blur-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 violet-gradient opacity-5"></div>
          <div className="relative z-10 text-center pb-8 pt-6">
            <p className="text-gray-300 text-base font-medium mb-2">
              Ponte en contacto
            </p>
            <h3 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Contacto.
              </span>
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mt-2 mb-2"></div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative z-10 mt-4 flex flex-col gap-8 px-4 pb-8"
          >
            <label className="flex flex-col text-left">
              <span className="text-gray-200 font-medium mb-4">Tu Nombre</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Escribe tu nombre"
                className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg py-4 px-6 font-medium outline-none"
              />
            </label>

            <label className="flex flex-col text-left">
              <span className="text-gray-200 font-medium mb-4">Tu Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Escribe tu email"
                className="bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 rounded-lg shadow-lg py-4 px-6 font-medium outline-none"
              />
            </label>

            <label className="flex flex-col text-left">
              <span className="text-gray-200 font-medium mb-4">Tu Mensaje</span>
              <textarea
                rows="7"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Escribe tu mensaje"
                className="resize-none bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 min-h-24 rounded-lg shadow-lg py-4 px-6 font-medium outline-none"
              />
            </label>
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
            {success === true && (
              <span className="block text-green-400 text-sm font-medium text-center mt-2">
                Gracias, te contactaremos pronto
              </span>
            )}
            {success === false && (
              <span className="block text-red-400 text-sm font-medium text-center mt-2">
                Algo salió mal, inténtalo de nuevo
              </span>
            )}
          </form>
        </div>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

const WrappedContact = SectionWrapper(Contact, "contact");
export default WrappedContact;
