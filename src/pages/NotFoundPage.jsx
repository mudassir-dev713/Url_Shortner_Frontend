import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Link as LinkIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <>
      <Helmet>
        <title>404 Not Found | LinkSnip</title>
        <meta
          name="description"
          content="Oops! The page you're looking for doesn't exist."
        />
        <meta property="og:title" content="Page Not Found | LinkSnip" />
        <meta
          property="og:description"
          content="We couldn't find the page. Try heading back to the homepage."
        />
        <meta
          property="og:image"
          content="https://link-snip.netlify.app/og-image.jpg"
        />
        <meta property="og:url" content="https://link-snip.netlify.app/404" />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
            Oops! The page you're looking for doesn't exist or might have been
            moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center px-6 py-3 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/shorten"
              className="flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <LinkIcon className="mr-2 h-5 w-5" />
              Shorten a URL
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
