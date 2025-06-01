import React from "react";

const LanguageToggle = ({ language, toggleLanguage }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative bg-gray-800 rounded-full p-1 border border-gray-600 shadow-lg flex flex-row">
        {/* Background slider */}
        <div
          className={`absolute top-1 w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            language === "es" ? "translate-x-0" : "translate-x-12"
          }`}
        />

        {/* Spanish option */}
        <button
          onClick={() => language !== "es" && toggleLanguage()}
          className={`relative z-10 flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${
            language === "es" ?
              "text-white font-semibold"
            : "text-gray-400 hover:text-gray-200"
          }`}
          aria-label="Cambiar a Español"
        >
          <span className="text-lg">🇪🇸</span>
        </button>

        {/* English option */}
        <button
          onClick={() => language !== "en" && toggleLanguage()}
          className={`relative z-10 flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${
            language === "en" ?
              "text-white font-semibold"
            : "text-gray-400 hover:text-gray-200"
          }`}
          aria-label="Switch to English"
        >
          <span className="text-lg">🇺🇸</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
