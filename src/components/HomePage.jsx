
import { useState } from "react";
import HotelDetailsForm from "./HotelDetailsForm";
import ExcelUpload from "./ExcelUpload";
import Header from "./Header";
import Stepper from "./Stepper";
import ThemeSelection from "./ThemeSelection";
import ReviewMenuSetup from "./ReviewMenuSetup";    


export default function HomePage() {
  const [step, setStep] = useState(1);
  const [hotel, setHotel] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("classic");

  function handleHotelSubmit(details) {
    setHotel(details);
    setStep(2);
  }

  function handleMenuContinue(items) {
    setMenuItems(items);
    setStep(3);
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <main className="min-h-screen bg-[#F7F2E8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
         <Header />

        {/* Stepper */}
         <Stepper step={step} />


        {/* Step content */}
        <section className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-8">
          {step === 1 && (
              <HotelDetailsForm
                onSubmit={handleHotelSubmit}
              />
          )}

          {step === 2 && (
              <ExcelUpload
                onBack={goBack}
                onContinue={handleMenuContinue}
              />
          )}

          {step === 3 && (
            <ThemeSelection
              onBack={goBack}
              onContinue={handleMenuContinue}
              theme={selectedTheme}
              hotel={hotel}
            />
          )}

          {step === 4 && (
            <ReviewMenuSetup
              onBack={goBack}
              onContinue={handleMenuContinue}
              menuItems={menuItems}
              hotel={hotel}
              theme={selectedTheme}
            />
          )}
        </section>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Simple menus. Better dining experiences.
        </footer>
      </div>
    </main>
  );
}
