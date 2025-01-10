import { Link } from 'react-router-dom';
import { FaHiking, FaCalendarAlt, FaNewspaper, FaMapMarkedAlt, FaRunning, FaBiking } from 'react-icons/fa';
import logoUrl from "../assets/img/logo/longlogo.svg";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const activityImage1 = "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+1";
const activityImage2 = "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+2";
const activityImage3 = "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+3";

const sectionBackgrounds = {
  activities: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  trails: "https://images.unsplash.com/photo-1520262454473-a1a82276a574?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  events: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  posts: "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
};

const HomePage = () => {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    {
      title: "Activities",
      description: "Dołącz do aktywności lub zorganizuj własną",
      image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      path: "/activities",
      bgColor: "bg-background",
      iconColor: "text-primary"
    },
    {
      title: "Trails",
      description: "Odkryj nowe szlaki i trasy",
      icon: <FaMapMarkedAlt className="text-5xl text-primary" />,
      path: "/trails",
      bgColor: "bg-white",
      buttonText: "Eksploruj szlaki"
    },
    {
      title: "Events",
      description: "Znajdź nadchodzące wydarzenia w Twojej okolicy",
      icon: <FaCalendarAlt className="text-5xl text-primary" />,
      path: "/events",
      bgColor: "bg-background",
      buttonText: "Sprawdź wydarzenia"
    },
    {
      title: "Posts",
      description: "Podziel się swoimi doświadczeniami i historiami",
      icon: <FaNewspaper className="text-5xl text-primary" />,
      path: "/posts",
      bgColor: "bg-white",
      buttonText: "Zobacz posty"
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = ['hero', 'activities', 'trails', 'events', 'posts', 'cta'].map(id => 
        document.getElementById(id)
      );

      const currentSection = sectionElements.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {['hero', 'activities', 'trails', 'events', 'posts', 'cta'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className="flex items-center justify-end gap-3 hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
          >
            <span className={`text-sm font-medium capitalize ${
              ['hero', 'cta'].includes(section) && activeSection === section
                ? 'text-hover-text'
                : 'text-primary'
            }`}>
              {section === 'hero' ? 'Start' : 
               section === 'cta' ? 'Dołącz' : 
               section}
            </span>
            <div 
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                ['hero', 'cta'].includes(section) && activeSection === section
                  ? 'border-hover-text bg-hover-text'
                  : 'border-primary bg-primary'
              } ${
                activeSection === section ? 'scale-125' : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <section id="hero" className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-custom-green to-primary text-hover-text">
        <img 
          src={logoUrl} 
          alt="TrailMates Logo" 
          className="h-24 mb-8 filter brightness-0 invert opacity-0 animate-[fade-in-down_1s_ease-out_forwards]"
        />
        <p className="text-2xl mb-8 max-w-2xl text-center px-4 opacity-0 animate-[fade-in-down_1s_ease-out_500ms_forwards]">
          Znajdź towarzyszy do wspólnych przygód na szlaku
        </p>
        <div className="flex gap-16 mt-10">
          <div className="opacity-0 animate-[fade-in-down_1s_ease-out_800ms_forwards]">
            <FaRunning className="text-5xl animate-bounce" />
          </div>
          <div className="opacity-0 animate-[fade-in-down_1s_ease-out_1000ms_forwards]">
            <FaHiking className="text-5xl animate-bounce [animation-delay:150ms]" />
          </div>
          <div className="opacity-0 animate-[fade-in-down_1s_ease-out_1200ms_forwards]">
            <FaBiking className="text-5xl animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section 
          id={section.title.toLowerCase()}
          key={section.title} 
          className={`min-h-screen flex items-center ${section.bgColor}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${sectionBackgrounds[section.title.toLowerCase()]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="container mx-auto px-6 max-w-7xl">
            {section.title === "Activities" ? (
              <div className="text-center">
                <div className="mb-8">
                  {section.icon}
                </div>
                <h2 className="text-4xl font-bold mb-6 text-secondary">{section.title}</h2>
                <p className="text-xl text-secondary/80 mb-12 max-w-3xl mx-auto">{section.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <div className="relative group overflow-hidden">
                    <img 
                      src={activityImage1}
                      alt="Activity Preview 1"
                      className="rounded-lg object-cover w-full h-[300px] transition-all duration-1000 ease-in-out transform 
                      translate-y-[-10px] scale-110 origin-bottom
                      hover:translate-y-0 hover:scale-100 hover:rotate-[-3deg]"
                    />
                    <div className="mt-2 text-center text-secondary/60">
                      Bieganie
                    </div>
                  </div>
                  <div className="relative group overflow-hidden">
                    <img 
                      src={activityImage2}
                      alt="Activity Preview 2"
                      className="rounded-lg object-cover w-full h-[300px] transition-all duration-1000 ease-in-out transform 
                      translate-y-[-10px] scale-110 origin-bottom
                      hover:translate-y-0 hover:scale-100 hover:rotate-3deg]"
                    />
                    <div className="mt-2 text-center text-secondary/60">
                      Jazda na rowerze
                    </div>
                  </div>
                  <div className="relative group overflow-hidden">
                    <img 
                      src={activityImage3}
                      alt="Activity Preview 3"
                      className="rounded-lg object-cover w-full h-[300px] transition-all duration-1000 ease-in-out transform 
                      translate-y-[-10px] scale-110 origin-bottom
                      hover:translate-y-0 hover:scale-100 hover:rotate-[3deg]"
                    />
                    <div className="mt-2 text-center text-secondary/60">
                      Wspinaczka
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`md:flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 text-center md:text-left">
                  <div className="mb-8">
                    {section.icon}
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-secondary">{section.title}</h2>
                  <p className="text-xl text-secondary/80 mb-8">{section.description}</p>
                  <Link 
                    to={section.path}
                    className="inline-block bg-primary text-hover-text px-8 py-3 rounded-full text-lg font-semibold hover:bg-hover-background transition-colors duration-300"
                  >
                    {section.buttonText}
                  </Link>
                </div>
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                  <div className="w-80 h-80 rounded-full bg-white shadow-lg flex items-center justify-center backdrop-blur-sm">
                    {section.icon}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      <section 
        id="cta" 
        className="min-h-screen flex items-center bg-gradient-to-b from-custom-green to-primary text-hover-text"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-white/20 shadow-xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">Dołącz do społeczności TrailMates</h2>
              <p className="text-xl mb-8 opacity-90">
                Poznaj ludzi dzielących Twoją pasję do aktywnego spędzania czasu
              </p>
              <Link 
                to="/register" 
                className="inline-block bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-background transition-colors duration-300 hover:shadow-lg"
              >
                Dołącz teraz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
