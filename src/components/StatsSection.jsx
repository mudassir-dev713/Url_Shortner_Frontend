import { useTheme } from '../context/ThemeContext';
import { useStatsData } from '../utils/Constant';
import { useUrl } from '../context/UrlContext';

const StatsSection = () => {
  const { theme } = useTheme();
  const { statsLoading } = useUrl();
  const Stats = useStatsData();

  return (
    <section
      className={`py-16 transition-colors duration-200  ${
        theme === 'dark' ? 'bg-gray-800' : 'light-color'
      }`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-on-scroll">
          {Stats.map((item, index) => (
            <div
              className="p-6 rounded-lg animate-on-scroll opacity-0 bg-gradient-card cursor-pointer"
              key={index}
            >
              <h3 className="text-4xl font-bold text-primary mb-2">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-12 w-24 mx-auto rounded"></div>
                ) : (
                  item.stats
                )}
              </h3>
              <p
                className={
                  theme === 'dark' ? 'text-gray-300' : 'dark:text-gray-800'
                }
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StatsSection;
