import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  // Validate the entered passkey
  const validatePasskey = (e) => {
    e.preventDefault();

    // For now, use a simple comparison - you can add encryption later
    const adminPasskey = import.meta.env?.VITE_ADMIN_PASSKEY || "123456"; // fallback

    if (passkey === adminPasskey) {
      try {
        // Store the passkey (you can add encryption later)
        localStorage.setItem("accessKey", passkey);
        closeModal();
        navigate("/dashboard");
      } catch (error) {
        console.error("Error storing key:", error);
        setError("Error al procesar la clave. Intenta de nuevo.");
      }
    } else {
      setError("Clave de acceso incorrecta");
    }
  };

  // Close modal and reset states
  const closeModal = () => {
    setPasskey("");
    setError("");
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-primary/95 backdrop-blur-md border border-white/20 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Verificación de acceso administrador
          </h2>
          <button
            onClick={closeModal}
            className="text-secondary hover:text-white text-2xl transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <p className="text-secondary mb-6 text-sm">
          Para acceder al modo de administrador, ingresa tu clave de acceso.
        </p>

        <div className="mb-6">
          <input
            type="password"
            maxLength={6}
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Ingresa la clave de 6 dígitos"
            className="w-full p-4 bg-tertiary/50 border border-white/20 rounded-lg text-center text-lg tracking-widest text-white placeholder-secondary focus:outline-none focus:border-white/40 focus:bg-tertiary/70 transition-all duration-200"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-400/10 p-2 rounded-lg border border-red-400/20">
            {error}
          </p>
        )}

        <button
          onClick={validatePasskey}
          disabled={passkey.length !== 6}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
        >
          Ingresar clave de administrador
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
