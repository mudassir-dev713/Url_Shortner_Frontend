import { useRef, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Link as ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
const CTASection = lazy(() => import('../components/CTASection'));
const FeaturesSection = lazy(() => import('../components/FeaturesSection'));
const StatsSection = lazy(() => import('../components/StatsSection'));

import Loader from '../components/Loader';
function HomePage() {
  const { theme } = useTheme();
  const featuresRef = useRef(null);

  // Scroll to top once
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Animate on scroll observer
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains('opacity-100')
          ) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.3 }
    );

    const observeAnimateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        if (!el.classList.contains('opacity-100')) {
          el.classList.add(
            'opacity-0',
            'translate-y-8',
            'transition-all',
            'duration-[2000ms]',
            'ease-[cubic-bezier(0.22,1,0.36,1)]'
          );

          intersectionObserver.observe(el);
        }
      });
    };

    const mutationObserver = new MutationObserver(() => {
      observeAnimateElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    observeAnimateElements();

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const scrollToFeatures = async () => {
    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Helmet>
        <title>LinkSnip - Shorten URLs in Seconds</title>
        <meta
          name="description"
          content="The fastest and easiest way to shorten, track, and analyze your links."
        />

        {/* Open Graph (OG) Tags */}
        <meta
          property="og:title"
          content="LinkSnip - Shorten URLs in Seconds"
        />
        <meta
          property="og:description"
          content="The fastest and easiest way to shorten, track, and analyze your links."
        />
        <meta
          property="og:image"
          content="https://link-snip.netlify.app/og-image.jpg"
        />
        <meta property="og:url" content="https://link-snip.netlify.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="LinkSnip - Shorten URLs in Seconds"
        />
        <meta
          name="twitter:description"
          content="The fastest and easiest way to shorten, track, and analyze your links."
        />
        <meta
          name="twitter:image"
          content="https://link-snip.netlify.app/og-image.jpg"
        />
      </Helmet>
      <div>
        {/* Hero Section */}
        <section
          className={`py-20 md:py-32 px-4 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-900' : 'light-color'
          }`}
          style={{ containIntrinsicSize: '3000px' }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fadeIn">
              Short Links, <span className="bg-gradient-hero">Big Impact</span>
            </h1>
            <p
              className={`text-[.99rem] md:text-2xl max-w-3xl mx-auto mb-12 animate-scaleIn  ${
                theme === 'dark' ? 'text-gray-300' : ' dark:text-gray-800'
              }`}
            >
              Transform long, unwieldy links into short, powerful, and trackable
              URLs with our modern link management platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slideUp">
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

        <Suspense fallback={<Loader />}>
          <StatsSection />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <FeaturesSection featuresRef={featuresRef} />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <CTASection />
        </Suspense>
      </div>
    </>
  );
}

export default HomePage;
