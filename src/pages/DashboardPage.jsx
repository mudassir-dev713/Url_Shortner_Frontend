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

import { useUrl } from '../context/UrlContext';
import Loader from '../components/loader';

function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchUserUrls, urls, setUrls } = useUrl();

  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 5;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    if (!user) return;

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

    loadUrls();
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = urls
      .filter(
        (url) =>
          url.full_url.toLowerCase().includes(term) ||
          url.short_url.toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ← newest first

    setFilteredUrls(filtered);
    setCurrentPage(1);
  }, [searchTerm, urls]);

  const handleDelete = async (url) => {
    const urlId = url._id;
    const updatedUrls = urls.filter((url) => url._id !== urlId);
    setUrls(updatedUrls);

    if (selectedUrl._id === urlId) {
      setSelectedUrl(null);
    }
  };

  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(filteredUrls.length / urlsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p
              className={`${
                theme === 'dark' ? 'text-gray-300' : ' dark:text-gray-800'
              }`}
            >
              Manage and analyze all your shortened URLs in one place.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 `}>
            <div
              className={`rounded-lg shadow-md ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your URLs..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <Loader />
                ) : filteredUrls.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-block p-3 rounded-full bg-gray-200 dark:bg-gray-700 mb-4">
                      <LinkIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No URLs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm
                        ? 'No URLs match your search term.'
                        : "You haven't shortened any URLs yet."}
                    </p>
                    <Link
                      to="/shorten"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
                    >
                      <LinkIcon className="mr-2 h-5 w-5" />
                      Create Your First Short URL
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentUrls.map((url) => (
                      <div key={url._id} className="cursor-pointer">
                        <Suspense fallback={<Loader />}>
                          <UrlCard
                            url={url}
                            onDelete={() => {
                              handleDelete(url);
                            }}
                          />
                        </Suspense>
                      </div>
                    ))}

                    {/* Pagination */}
                    {filteredUrls.length > urlsPerPage && (
                      <div className="flex justify-center items-center space-x-2 mt-6">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-md disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === i + 1
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-md disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
