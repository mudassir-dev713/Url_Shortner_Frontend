import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Link as LinkIcon,
  Copy,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUrl } from '../context/UrlContext';

function ShortenerPage() {
  const { theme } = useTheme();

  const { user } = useAuth();
  const { generateUrl, generateCustomUrl } = useUrl();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  const isValidCustomCode = (code) => {
    const pattern = /^[a-zA-Z0-9-_]{1,30}$/;
    return pattern.test(code);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortenedUrl(null);
    setError('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    if (customCode && !isValidCustomCode(customCode)) {
      toast.error('Custom short code is invalid');

      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (customCode) {
        if (user) {
          result = await generateCustomUrl(url, showCustom ? customCode : null);
          toast.success('URL shortened successfully!');
        } else {
          toast.error('Login is required for custom url');
          setIsLoading(false);
          return;
        }
      } else {
        result = await generateUrl(url);
        toast.success('URL shortened successfully!');
      }

      setShortenedUrl(result);
      setUrl('');
      setCustomCode('');
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'An error occurred while shortening the URL'
      );
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortenedUrl) return;

    navigator.clipboard
      .writeText(import.meta.env.VITE_BACKEND_URL_DNS + shortenedUrl.short_url)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Shorten Your URL
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Transform long, unwieldy links into short, memorable ones with just
            one click.
          </p>
        </div>

        <div
          className={`rounded-xl shadow-lg p-6 md:p-8 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="url"
                className={`block text-sm font-medium  mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Enter the long URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://example.com/very/long/url/that/needs/to/be/shortened"
                className={`w-full px-4 py-3 rounded-lg border ${
                  error
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent`}
                disabled={isLoading}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useCustom"
                checked={showCustom}
                onChange={() => setShowCustom(!showCustom)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={isLoading}
              />
              <label
                htmlFor="useCustom"
                className={`ml-2 block text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Use custom short code (optional)
              </label>
            </div>

            {showCustom && (
              <div className="pl-6 border-l-2 border-primary/20">
                <label
                  htmlFor="customCode"
                  className={`mb-1 block text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Custom short code
                </label>
                <div className="flex">
                  <span
                    className={`inline-flex items-center px-3 rounded-l-md border border-r-0 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    lnk.sp/
                  </span>
                  <input
                    type="text"
                    id="customCode"
                    name="customCode"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="yourbrand"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent"
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Can contain letters, numbers, and hyphens. No spaces.
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Shortening...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-5 w-5" />
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </form>

          {shortenedUrl && (
            <div
              className={`mt-8 p-6 rounded-lg border animate-fadeIn ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h3 className="font-semibold mb-2">
                Your shortened URL is ready!
              </h3>

              <div
                className={`flex items-center p-3 rounded-lg mb-4 ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <span className="flex-grow font-medium text-primary truncate">
                  {`${import.meta.env.VITE_BACKEND_URL_DNS} 
                    ${shortenedUrl.short_url}`}
                </span>
                <div className="flex-shrink-0 flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-md ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    } transition-colors`}
                    aria-label="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <a
                    href={shortenedUrl.full_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-md ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    } transition-colors`}
                    aria-label="Visit original URL"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Original URL:{' '}
                  <a
                    href={shortenedUrl.full_url}
                    className="hover:underline truncate inline-block max-w-[200px] align-bottom"
                  >
                    {shortenedUrl.full_url}
                  </a>
                </span>
                <button
                  onClick={goToDashboard}
                  className="inline-flex items-center text-sm text-primary hover:text-primary/90"
                >
                  Go to Dashboard <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 md:text-lg text-sm">
          <strong>Note: </strong>
          Your Short Url will be deleted after 7 days if your are not logged in.
        </div>
      </div>
    </div>
  );
}

export default ShortenerPage;
