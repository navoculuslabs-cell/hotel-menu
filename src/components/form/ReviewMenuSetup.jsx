const ReviewMenuSetup = ({ onBack, onContinue, menuItems, hotel }) => {
  return (
            <section className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#A08448]">
                Final step
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#244B3B]">
                Review your menu setup
              </h2>

              <div className="mt-6 space-y-4 rounded-xl bg-[#F7F2E8] p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Hotel
                  </p>
                  <p className="mt-1 font-semibold text-[#244B3B]">
                    {hotel?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Menu items
                  </p>
                  <p className="mt-1 font-semibold text-[#244B3B]">
                    {menuItems.length} items
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Theme
                  </p>
                  <p className="mt-1 font-semibold capitalize text-[#244B3B]">
                    {theme}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-gray-600">
                Your details and menu are ready for the next
                development stage: generating the public menu
                page and QR code.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-xl border border-[#244B3B] px-5 py-3 font-semibold text-[#244B3B] hover:bg-[#F7F2E8]"
                >
                  ← Back to theme
                </button>

                <button
                  type="button"
                  onClick={onContinue}
                  className="rounded-xl bg-[#244B3B] px-5 py-3 font-semibold text-white hover:bg-[#19382B]"
                >
                  Publish menu
                </button>
              </div>
            </section>
  )
}

export default ReviewMenuSetup;