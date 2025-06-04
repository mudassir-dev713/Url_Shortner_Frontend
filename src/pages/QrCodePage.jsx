import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Link as LinkIcon, ChevronRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQr } from '../context/QrContext';

function QrCodePage() {
  const { theme } = useTheme();
  const { createQr } = useQr();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [qr, setQr] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const qrImageRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url) return setError('Please enter a URL');
    if (!validateUrl(url))
      return setError('Please enter a valid URL (with http/https)');

    setIsLoading(true);
    try {
      const result = await createQr(url);
      setQr(result);
      setError('');
    } catch (error) {
      const msg =
        error?.response?.data?.message || // Handles the "Malicious URL" case
        error?.response?.data?.error || // In case your backend uses 'error'
        error.message || // Axios-level message
        'Something went wrong';

      console.error('QR Submit Error:', error.response.data.message);
      setQr({}); // <-- Clear QR result if request failed
      setError(msg);
      toast.error(msg, { icon: '⛔' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qr?.qrCode) return;
    const link = document.createElement('a');
    link.href = qr.qrCode;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create QR Code
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Instantly generate a QR code from any link with just one click.
          </p>
        </div>

        <div
          className={`rounded-xl shadow-lg p-6 md:p-8 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="url"
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Enter a URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  error
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent`}
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition disabled:opacity-70"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-5 w-5" />
                    Create QR Code
                  </>
                )}
              </button>
            </div>
          </form>

          {qr?.qrCode && typeof qr.qrCode === 'string' && (
            <div
              className={`mt-10 md:p-6 p-3 rounded-lg border animate-fadeIn ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h3 className="font-semibold text-lg mb-4">
                Your QR Code is ready!
              </h3>
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={qr.qrCode}
                  alt="QR Code"
                  ref={qrImageRef}
                  className="w-[220px] h-[220px] object-contain"
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1 text-primary text-sm hover:text-primary/90"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodePage;
