import { useState, useEffect } from "react";
import { sections, sectionBackgrounds } from "./HomePageStyles";
import { navigationItems } from "../../components/HomePage/NavigationConfig";
import NavigationDots from "../../components/HomePage/NavigationDots";
import {
  HeroSection,
  ContentSection,
  CtaSection,
} from "../../components/HomePage/Sections";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection("hero");

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = navigationItems.map((item) =>
        document.getElementById(item.id)
      );

      const currentSection = sectionElements.find((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <NavigationDots
        items={navigationItems}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      <HeroSection />
      {sections.map((section, index) => (
        <ContentSection
          key={section.key}
          section={section}
          index={index}
          backgroundImage={sectionBackgrounds[section.key.toLowerCase()]}
        />
      ))}
      <CtaSection />
    </div>
  );
};

export default HomePage;
