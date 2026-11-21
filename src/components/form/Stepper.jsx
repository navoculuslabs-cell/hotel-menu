

const Stepper = ({ step }) => { 

    const STEPS = [
        { title: "Hotel details", short: "Details" },
        { title: "Upload menu", short: "Menu" },
        { title: "Choose theme", short: "Theme" },
        { title: "Publish menu", short: "Publish" },
      ];
      
  return (
    <section
          aria-label="Menu creation progress"
          className="mb-8 rounded-2xl border border-[#E7E0D2] bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#244B3B]">
              Step {step} of {STEPS.length}
            </p>

            <p className="text-sm text-gray-500">
              {Math.round((step / STEPS.length) * 100)}% progress
            </p>
          </div>

          <div
            className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#EEE9DE]"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={step}
          >
            <div
              className="h-full rounded-full bg-[#244B3B] transition-all duration-300"
              style={{
                width: `${(step / STEPS.length) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {STEPS.map((item, index) => {
              const number = index + 1;
              const isComplete = number < step;
              const isCurrent = number === step;

              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      isComplete || isCurrent
                        ? "bg-[#244B3B] text-white"
                        : "bg-[#EEE9DE] text-gray-500"
                    }`}
                  >
                    {isComplete ? "✓" : number}
                  </div>

                  <span
                    className={`text-[11px] sm:text-sm ${
                      isCurrent
                        ? "font-bold text-[#244B3B]"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="sm:hidden">
                      {item.short}
                    </span>
                    <span className="hidden sm:inline">
                      {item.title}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
  )
}

export default Stepper



