
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    if (window.google?.translate?.TranslateElement) {
      initializeGoogleTranslate();
      return;
    }

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");

      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      document.body.appendChild(script);
    }

    function initializeGoogleTranslate() {
      const container = document.getElementById(
        "google_translate_element"
      );

      if (!container || container.dataset.initialized) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,mr",
          autoDisplay: false
        },
        "google_translate_element"
      );

      container.dataset.initialized = "true";
    }

    return () => {
      // Keep the global callback available for the script.
    };
  }, []);

  return <div id="google_translate_element" />;
}
