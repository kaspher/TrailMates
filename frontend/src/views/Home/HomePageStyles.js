import { FaCalendarAlt, FaNewspaper, FaMapMarkedAlt } from 'react-icons/fa';

export const activityImages = {
  activity1: "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+1",
  activity2: "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+2",
  activity3: "https://via.placeholder.com/400x300/f2faf4/111111?text=Activity+3"
};

export const sectionBackgrounds = {
  activities: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  trails: "https://images.unsplash.com/photo-1520262454473-a1a82276a574?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  events: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", 
  posts: "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
};

export const sections = [
  {
    title: "Activities",
    description: "Dołącz do aktywności lub zorganizuj własną",
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

export const styles = {
  container: "min-h-screen bg-background relative",

  navigationContainer: "fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4",
  navigationButton: "flex items-center justify-end gap-3 hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm",
  navigationText: (isSpecialSection, isActive) => `text-sm font-medium capitalize ${
    isSpecialSection && isActive ? 'text-hover-text' : 'text-primary'
  }`,
  navigationDot: (isActive, isSpecialSection) => `w-3 h-3 rounded-full border-2 transition-all duration-300 ${
    isActive 
      ? `${isSpecialSection 
          ? 'border-hover-text bg-hover-text' 
          : 'border-primary bg-primary'} scale-125` 
      : 'border-primary bg-transparent'
  }`,

  heroSection: "h-screen flex flex-col justify-center items-center bg-gradient-to-b from-custom-green to-primary text-hover-text",
  heroLogo: "h-24 mb-8 filter brightness-0 invert opacity-0 animate-[fade-in-down_1s_ease-out_forwards]",
  heroText: "text-2xl mb-8 max-w-2xl text-center px-4 opacity-0 animate-[fade-in-down_1s_ease-out_500ms_forwards]",
  heroIcons: "flex gap-16 mt-10",

  activitiesGrid: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto",
  activityImage: "rounded-lg object-cover w-full h-[300px] transition-all duration-1000 ease-in-out transform translate-y-[-10px] scale-110 origin-bottom",
  activityImageHover: "hover:translate-y-0 hover:scale-100",
  activityCaption: "mt-2 text-center text-secondary/60",

  section: "min-h-screen flex items-center",
  sectionContainer: "container mx-auto px-6 max-w-7xl",
  sectionContent: "md:w-1/2 text-center md:text-left",
  sectionTitle: "text-4xl font-bold mb-6 text-secondary",
  sectionDescription: "text-xl text-secondary/80 mb-8",
  sectionButton: "inline-block bg-primary text-hover-text px-8 py-3 rounded-full text-lg font-semibold hover:bg-hover-background transition-colors duration-300",
  sectionIcon: "w-80 h-80 rounded-full bg-white shadow-lg flex items-center justify-center backdrop-blur-sm",

  // CTA - Call to Action, zachęca user'a do akcji
  ctaSection: "min-h-screen flex items-center bg-gradient-to-b from-custom-green to-primary text-hover-text",
  ctaContainer: "container mx-auto px-6 max-w-4xl",
  ctaBox: "bg-white/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-white/20 shadow-xl",
  ctaButton: "inline-block bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-background transition-colors duration-300 hover:shadow-lg",
}; 