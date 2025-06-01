import { useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Link as ChevronRight, LinkIcon } from 'lucide-react';
import Loader from '../components/loader';
import { features, useStatsData } from '../utils/Constant';
import { lazy } from 'react';
const LazyStats = lazy(() => Promise.resolve({ default: StatsSection }));
const LazyFeatures = lazy(() => Promise.resolve({ default: FeaturesSection }));
const LazyCTA = lazy(() => Promise.resolve({ default: CTASection }));

function HomePage() {
  const { theme } = useTheme();
  const featuresRef = useRef(null);

  // Scroll to top once
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Animate on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => {
      section.classList.remove('animate-fadeIn');
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [theme]);

  const scrollToFeatures = async () => {
    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className={`py-20 md:py-32 px-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900' : 'light-color'
        }`}
        style={{ containIntrinsicSize: '3000px' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Short Links, <span className="bg-gradient-hero">Big Impact</span>
          </h1>
          <p
            className={`text-[.99rem] md:text-2xl max-w-3xl mx-auto mb-12 ${
              theme === 'dark' ? 'text-gray-300' : ' dark:text-gray-800'
            }`}
          >
            Transform long, unwieldy links into short, powerful, and trackable
            URLs with our modern link management platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/shorten"
              className="btn-animate px-8 py-3 rounded-lg font-medium min-w-[180px] text-white bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
              hover:from-lime-500 hover:to-green-600 
              dark:from-emerald-600 dark:via-green-600 dark:to-lime-500 
              dark:hover:from-lime-400 dark:hover:to-green-400
              shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Free
            </Link>
            <button
              onClick={scrollToFeatures}
              className={`px-8 py-3 rounded-lg font-medium border flex items-center justify-center min-w-[180px] ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-800'
                  : 'border-gray-300 hover:bg-gray-100'
              } transition-colors`}
            >
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <StatsSection />
      <FeaturesSection featuresRef={featuresRef} />
      <CTASection />
    </div>
  );
}

export default HomePage;

const StatsSection = () => {
  const { theme } = useTheme();
  const Stats = useStatsData();

  return (
    <section
      className={`py-16 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800' : 'light-color'
      }`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {Stats.map((item, index) => (
            <div
              className="p-6 rounded-lg animate-on-scroll opacity-0 bg-gradient-card cursor-pointer"
              key={index}
            >
              <h3 className="text-4xl font-bold text-primary mb-2">
                {item.stats}
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

const CTASection = () => {
  const { theme } = useTheme();
  return (
    <section
      className={`py-20 text-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-primary/5'
      }`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Supercharge Your Links?
          </h2>
          <p
            className={`text-xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'dark:text-gray-800'
            }`}
          >
            Join thousands of marketers, content creators, and businesses who
            use LinkSnip to optimize their online presence.
          </p>
          <Link
            to="/shorten"
            className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <LinkIcon className="mr-2 h-5 w-5" />
            Start Shortening Now
          </Link>
        </div>
      </div>
    </section>
  );
};
