const Header = () => {
  return (
    <header className="mb-8 text-center sm:mb-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#244B3B] text-xl text-white shadow-sm">
            ✳
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08448]">
            Digital Menu Builder
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#244B3B] sm:text-4xl">
            Create your digital menu
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
            A simple way to turn your restaurant menu into
            a beautiful digital experience.
          </p>
        </header>
  )
}

export default Header