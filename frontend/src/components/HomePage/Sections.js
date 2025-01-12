import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaRunning, FaHiking, FaBiking } from 'react-icons/fa';
import logoUrl from "../../assets/img/logo/longlogo.svg";
import { styles } from '../../views/Home/HomePageStyles';

export const HeroSection = () => {
  return (
    <section id="hero" className={styles.heroSection}>
      <img 
        src={logoUrl} 
        alt="TrailMates Logo" 
        className={styles.heroLogo}
      />
      <p className={styles.heroText}>
        Znajdź towarzyszy do wspólnych przygód na szlaku
      </p>
      <div className={styles.heroIcons}>
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
  );
};

export const ContentSection = ({ section, index, backgroundImage }) => {
  return (
    <section 
      id={section.title.toLowerCase()}
      className={`min-h-screen flex items-center ${section.bgColor}`}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className={styles.sectionContainer}>
        <div className={`md:flex items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
          <div className={styles.sectionContent}>
            <div className="mb-8">
              {section.icon}
            </div>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.sectionDescription}>{section.description}</p>
            <Link 
              to={section.path}
              className={styles.sectionButton}
            >
              {section.buttonText}
            </Link>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <div className={styles.sectionIcon}>
              {section.icon}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CtaSection = () => {
  const { user } = useAuth();

  return (
    <section id="cta" className={styles.ctaSection}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaBox}>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Dołącz do społeczności TrailMates</h2>
            <p className="text-xl mb-8 opacity-90">
              Poznaj ludzi dzielących Twoją pasję do aktywnego spędzania czasu
            </p>
            {user ? (
              <Link 
                to="/events"
                className={styles.ctaButton}
              >
                Zobacz wydarzenia
              </Link>
            ) : (
              <Link 
                to="/register"
                className={styles.ctaButton}
              >
                Dołącz teraz
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}; 