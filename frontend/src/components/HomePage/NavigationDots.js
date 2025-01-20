const NavigationDots = ({ items, activeSection, scrollToSection }) => {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="flex items-center justify-end gap-3 hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <span
            className={`text-sm font-medium capitalize ${
              activeSection === item.id
                ? "text-primary font-black"
                : "text-primary"
            }`}
          >
            {item.label}
          </span>
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
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
