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
    const adminPasskey = import.meta.env?.VITE_ADMIN_PASSKEY; // fallback

    if (passkey === adminPasskey) {
      try {
        // Store the passkey (you can add encryption later)
        localStorage.setItem("accessKey", passkey);
        handleClose();
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
  const handleClose = () => {
    setPasskey("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Verificación de acceso administrador
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Para acceder al modo de administrador, ingresa tu clave de acceso.
        </p>

        <div className="mb-4">
          <input
            type="password"
            maxLength={6}
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Ingresa la clave de 6 dígitos"
            className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={validatePasskey}
          disabled={passkey.length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Ingresar clave de administrador
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
