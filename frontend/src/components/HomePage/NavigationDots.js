const NavigationDots = ({ items, activeSection, scrollToSection }) => {
  return (
    <div className="fixed left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4 hidden md:block">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="flex items-center justify-end gap-3 hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full shadow-sm"
        >
          <span
            className={`text-sm font-medium capitalize ${
              activeSection === item.id
                ? "text-primary font-bold"
                : "text-gray-700"
            }`}
          >
            {item.label}
          </span>
          <div
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === item.id
                ? "border-primary bg-primary scale-125"
                : "border-primary bg-transparent"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default NavigationDots;
