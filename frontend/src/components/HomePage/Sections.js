import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaRunning, FaHiking, FaBiking } from "react-icons/fa";
import logoUrl from "../../assets/img/logo/trailmates_homelogo.svg";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-custom-green to-primary text-hover-text"
    >
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
  );
};

export const ContentSection = ({ section, index, backgroundImage }) => {
  return (
    <section
      id={section.key.toLowerCase()}
      className="min-h-screen flex items-center"
      style={{
        backgroundColor: backgroundImage,
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          className={`flex items-center ${
            index % 2 === 1 ? "flex-row-reverse" : ""
          }`}
        >
          <div className={`w-1/2 text-center ${section.textColor}`}>
            <h2 className={`text-4xl font-bold mb-6`}>{section.title}</h2>
            <p className={`text-xl ${section.textColor}/80 mb-8`}>
              {section.description}
            </p>
            <Link
              to={section.path}
              className="inline-block bg-primary text-hover-text px-8 py-3 rounded-full text-lg hover:bg-hover-background transition-colors duration-300"
            >
              {section.buttonText}
            </Link>
          </div>
          <div className="w-1/2 mt-10 mt-0 flex justify-center">
            <img
              src={require(`../../assets/img/home/${section.image}`)}
              alt="section img"
              className={`object-contain rounded-xl ${section.imageHeight}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const CtaSection = () => {
  const { user } = useAuth();

  return (
    <section
      id="cta"
      className="min-h-screen flex items-center bg-gradient-to-b from-custom-green to-primary text-hover-text"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-white/20 shadow-xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Dołącz do społeczności TrailMates
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Poznaj ludzi dzielących Twoją pasję do aktywnego spędzania czasu
            </p>
            {user ? (
              <Link
                to="/events"
                className="inline-block bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-background transition-colors duration-300 hover:shadow-lg"
              >
                Zobacz wydarzenia
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-background transition-colors duration-300 hover:shadow-lg"
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
