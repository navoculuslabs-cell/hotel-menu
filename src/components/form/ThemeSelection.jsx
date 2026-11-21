const ThemeSelection = ({ onBack, onContinue, theme, hotel }) => {
  return (
    <section className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-8">
    <p className="text-xs font-bold uppercase tracking-widest text-[#A08448]">
      Step 3
    </p>

    <h2 className="mt-2 text-2xl font-bold text-[#244B3B]">
      Choose your menu theme
    </h2>

    <p className="mt-2 text-sm text-gray-600">
      Select the design for {hotel?.name}.
    </p>

    <button
      type="button"
      onClick={() => setTheme("classic")}
      className={`mt-6 w-full rounded-xl border-2 p-5 text-left transition ${
        theme === "classic"
          ? "border-[#244B3B] bg-[#F7F2E8]"
          : "border-[#E7E0D2] hover:border-[#A08448]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#244B3B]">
          Classic
        </span>

        {theme === "classic" && (
          <span className="text-sm font-semibold text-[#244B3B]">
            ✓ Selected
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Cream background, elegant green accents,
        and a clean text-based menu.
      </p>
    </button>

    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-[#244B3B] px-5 py-3 font-semibold text-[#244B3B] hover:bg-[#F7F2E8]"
      >
        ← Back
      </button>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-xl bg-[#244B3B] px-5 py-3 font-semibold text-white hover:bg-[#19382B]"
      >
        Continue to preview →
      </button>
    </div>
  </section>
  )
}

export default ThemeSelection;