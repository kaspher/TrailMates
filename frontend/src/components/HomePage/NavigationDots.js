import { styles } from '../../views/Home/HomePageStyles';

const NavigationDots = ({ items, activeSection, scrollToSection }) => {
  return (
    <div className={styles.navigationContainer}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={styles.navigationButton}
        >
          <span className={styles.navigationText(['hero', 'cta'].includes(item.id), activeSection === item.id)}>
            {item.label}
          </span>
          <div 
            className={styles.navigationDot(
              activeSection === item.id,
              ['hero', 'cta'].includes(item.id)
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default NavigationDots; 