import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Link as LinkIcon,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UrlCard = lazy(() => import('../components/UrlCard'));
const QrCard = lazy(() => import('../components/QrCard'));
import { useUrl } from '../context/UrlContext';
import { useQr } from '../context/QrContext';
import Loader from '../components/Loader';
import { Helmet } from 'react-helmet-async';

function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchUserUrls, urls, setUrls } = useUrl();
  const { qrCodes, fetchQr } = useQr();

  const [filteredUrls, setFilteredUrls] = useState([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('url');

  const urlsPerPage = 5;
  const qrsPerPage = 5;

  const [currentPageUrls, setCurrentPageUrls] = useState(1);
  const [currentPageQrs, setCurrentPageQrs] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadUrls = async () => {
      try {
        setIsLoading(true);
        await fetchUserUrls();
      } catch (error) {
        toast.error('Failed to load your URLs');
      } finally {
        setIsLoading(false);
      }
    };
    const loadqr = async () => {
      try {
        setIsLoading(true);
        await fetchQr();
      } catch (error) {
        toast.error('Failed to load your Qr Codes');
      } finally {
        setIsLoading(false);
      }
    };
    loadUrls();
    loadqr();
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    // Filter and sort URLs
    const filteredUrlsSorted = urls
      .filter(
        (url) =>
          url.full_url.toLowerCase().includes(term) ||
          (url.short_url && url.short_url.toLowerCase().includes(term))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Combine QR codes from URLs (without short_url) and independently generated QR codes
    const qrFromUrls = urls.filter((url) => url.qr_code_url && !url.short_url);
    const allQrCodesCombined = [...qrFromUrls, ...qrCodes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Filter QR codes by search term
    const filteredQr = allQrCodesCombined.filter((qr) => {
      const urlStr = qr.full_url || qr.url || '';
      return urlStr.toLowerCase().includes(term);
    });

    setFilteredUrls(filteredUrlsSorted);
    setFilteredQrCodes(filteredQr);

    // Reset pages on search/filter change
    setCurrentPageUrls(1);
    setCurrentPageQrs(1);
  }, [searchTerm, urls, qrCodes]);

  const handleDelete = async (url) => {
    const urlId = url._id;
    const updatedUrls = urls.filter((u) => u._id !== urlId);
    setUrls(updatedUrls);
  };
  const handleQrDelete = async (qr) => {
    const qrId = qr._id;
    const updatedqr = qrCodes.filter((u) => u._id !== qrId);
    setFilteredQrCodes(updatedqr);
  };
  // Pagination calculations for URLs
  const indexOfLastUrl = currentPageUrls * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalUrlPages = Math.ceil(filteredUrls.length / urlsPerPage);

  // Pagination calculations for QR codes
  const indexOfLastQr = currentPageQrs * qrsPerPage;
  const indexOfFirstQr = indexOfLastQr - qrsPerPage;
  const currentQrs = filteredQrCodes.slice(indexOfFirstQr, indexOfLastQr);
  const totalQrPages = Math.ceil(filteredQrCodes.length / qrsPerPage);

  const paginate = (pageNumber) => {
    if (activeTab === 'url') {
      if (pageNumber < 1 || pageNumber > totalUrlPages) return;
      setCurrentPageUrls(pageNumber);
    } else {
      if (pageNumber < 1 || pageNumber > totalQrPages) return;
      setCurrentPageQrs(pageNumber);
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Dashboard | LinkSnip</title>
        <meta
          name="description"
          content="Manage, edit, and track all your shortened URLs in one place."
        />
        <meta property="og:title" content="LinkSnip Dashboard" />
        <meta
          property="og:description"
          content="Analytics, click tracking, and full control over your links."
        />
        <meta
          property="og:image"
          content="https://link-snip.netlify.app/og-image.jpg"
        />
        <meta
          property="og:url"
          content="https://link-snip.netlify.app/dashboard"
        />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] py-12 px-2 md:px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-300' : 'dark:text-gray-800'
                }`}
              >
                Manage and analyze all your shortened URLs and QR codes.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/shorten"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                <LinkIcon className="mr-2 h-5 w-5" />
                Shorten New URL
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === 'url'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              URLs
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === 'qr'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              QR Codes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <div
                className={`rounded-lg shadow-md ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="md:p-4 py-4 px-1 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent"
                    />
                  </div>
                </div>

                <div className="md:p-4 py-4 ">
                  {isLoading ? (
                    <Loader />
                  ) : activeTab === 'url' ? (
                    currentUrls.length > 0 ? (
                      <div className="space-y-4">
                        {currentUrls.map((url) => (
                          <Suspense fallback={<Loader />} key={url._id}>
                            <UrlCard
                              url={url}
                              onDelete={() => handleDelete(url)}
                            />
                          </Suspense>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No shortened URLs found.
                      </p>
                    )
                  ) : currentQrs.length > 0 ? (
                    <div className="space-y-4">
                      {currentQrs.map((qr, idx) => (
                        <Suspense
                          fallback={<Loader />}
                          key={qr._id || qr.url || idx}
                        >
                          <QrCard
                            url={{
                              id: qr._id,
                              full_url: qr.full_url || qr.url,
                              qr_code_url: qr.qr_code_url || qr.qrCode,
                              createdAt: qr.createdAt,
                            }}
                            onDelete={() => {
                              handleQrDelete(qr);
                            }}
                          />
                        </Suspense>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No QR codes found.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {(activeTab === 'url' && totalUrlPages > 1) ||
                (activeTab === 'qr' && totalQrPages > 1) ? (
                  <div className="flex justify-center items-center py-4 border-t border-gray-200 dark:border-gray-700 space-x-4">
                    <button
                      onClick={() =>
                        paginate(
                          activeTab === 'url'
                            ? currentPageUrls - 1
                            : currentPageQrs - 1
                        )
                      }
                      disabled={
                        activeTab === 'url'
                          ? currentPageUrls === 1
                          : currentPageQrs === 1
                      }
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft />
                    </button>
                    <span>
                      Page{' '}
                      {activeTab === 'url' ? currentPageUrls : currentPageQrs}{' '}
                      of {activeTab === 'url' ? totalUrlPages : totalQrPages}
                    </span>
                    <button
                      onClick={() =>
                        paginate(
                          activeTab === 'url'
                            ? currentPageUrls + 1
                            : currentPageQrs + 1
                        )
                      }
                      disabled={
                        activeTab === 'url'
                          ? currentPageUrls === totalUrlPages
                          : currentPageQrs === totalQrPages
                      }
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
