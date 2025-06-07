import { useTheme } from '../context/ThemeContext';
import { features } from '../utils/Constant';

const FeaturesSection = ({ featuresRef }) => {
  const { theme } = useTheme();
  return (
    <section
      ref={featuresRef}
      className={`py-20 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1500px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'dark:text-gray-800'
            }`}
          >
            Everything you need to manage, track, and optimize your links
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-between ">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 animate-on-scroll opacity-0 cursor-pointer ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 bg-gradient-card-dark'
                    : 'hover:shadow-lg bg-gradient-card'
                }`}
              >
                <div className="inline-block p-3 rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p
                  className={
                    theme === 'dark' ? 'text-gray-300' : 'dark:text-gray-800'
                  }
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
