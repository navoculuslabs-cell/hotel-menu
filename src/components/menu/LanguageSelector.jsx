
import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" }
];

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (code) => {
    if (code === "en") {
      // Reset Google Translate language cookie
      const hostname = window.location.hostname;

      document.cookie =
        "googtrans=/en/en; path=/; max-age=0";

      document.cookie =
        "googtrans=/en/en; path=/";

      document.cookie =
        `googtrans=/en/en; path=/; domain=${hostname}`;

      document.cookie =
        `googtrans=/en/en; path=/; domain=.${hostname}`;

      // Also reset Google Translate dropdown
      const googleSelect = document.querySelector(".goog-te-combo");

      if (googleSelect) {
        googleSelect.value = "";
      }

      setLanguage("en");

      // Reload after resetting cookie
      window.location.reload();

      return;
    }

    const googleSelect = document.querySelector(".goog-te-combo");

    if (!googleSelect) {
      console.error("Google Translate is not initialized");
      return;
    }

    googleSelect.value = code;

    googleSelect.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    setLanguage(code);
  };

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
