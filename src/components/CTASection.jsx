import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { LinkIcon } from 'lucide-react';

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

export default CTASection;
