
import { useState } from "react";

export default function HotelDetailsForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    });
  }

  const inputClass =
    "w-full rounded-xl border border-[#D9D5CA] bg-white px-4 py-3 " +
    "text-base text-[#263C30] placeholder:text-gray-400 outline-none " +
    "transition focus:border-[#285640] focus:ring-2 focus:ring-[#285640]/15";

  return (
    <> 
     <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#A08448]">
                  Let's get started
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#244B3B]">
                  Tell us about your hotel
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  These details will appear on your digital menu.
                </p>
              </div>
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg space-y-6 rounded-2xl
                 border border-[#E7E0D2] bg-white p-5 shadow-sm
                 sm:p-8"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08448]">
          Step 1 of 4
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#244B3B] sm:text-3xl">
          Hotel details
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Let's start with the basic information for your digital menu.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Hotel / Restaurant Name
            <span className="ml-1 text-red-600">*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="organization"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Spice Garden"
            maxLength={100}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Contact Number
            <span className="ml-2 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            maxLength={20}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Restaurant Address
            <span className="ml-2 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter restaurant address"
            rows={3}
            maxLength={300}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex min-h-12 w-full items-center justify-center
                   gap-2 rounded-xl bg-[#244B3B] px-5 py-3
                   text-sm font-semibold text-white transition
                   hover:bg-[#193A2C] active:scale-[0.99]
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[#244B3B] focus-visible:ring-offset-2"
      >
        Continue to Excel Upload
        <span aria-hidden="true">→</span>
      </button>

      <p className="text-center text-xs leading-5 text-gray-400">
        Your menu setup starts here. You can add more details later.
      </p>
    </form>
    </>
  );
}
