import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Copy, ExternalLink, Trash2, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { deleteUrl } from '../api/Url.api';

function UrlCard({ url, onDelete }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
  };
  // Format the creation date
  const formattedDate = new Date(url.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Truncate the original URL for display
  const truncatedUrl =
    url.full_url.length > 50
      ? url.full_url.substring(0, 50) + '...'
      : url.full_url;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(import.meta.env.VITE_BACKEND_URL_DNS + url.short_url)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const data = await deleteUrl(url._id);
      onDelete(url._id);
      toast.success('URL deleted successfully');
    } catch (error) {
      toast.error('Failed to delete URL');
    } finally {
      setIsDeleting(false);
    }
  };
  const handleClick = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(`/analytics/${url._id}`);
      });
    } else {
      navigate(`/analytics/${url._id}`);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      style={{ viewTransitionName: `card-${url._id}` }}
      className={`rounded-lg overflow-hidden border transition-all duration-200 border-theme bg-surface
        `}
    >
      <div
        className={`rounded-lg overflow-hidden border transition-all duration-200 transform hover:shadow-md hover:-translate-y-1 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'
        }`}
      >
        <div className="md:p-6 py-6 max-[400px]:px-2 px-3 ">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col  lg:flex-row justify-between items-start">
              <h3 className="font-semibold text-lg truncate">
                <a
                  href={url.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center"
                >
                  {truncatedUrl}
                  <ExternalLink className="h-4 w-4 ml-2 inline flex-shrink-0" />
                </a>
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full mt-2 lg:mt-0 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {formattedDate}
              </span>
            </div>
            <motion.div
              className="flex items-center space-x-2 text-primary font-medium"
              whileHover={{ scale: 1.02 }}
            >
              <span>{`${import.meta.env.VITE_BACKEND_URL_DNS}  ${
                url.short_url
              }`}</span>
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 rounded hover:bg-gradient-card transition-colors"
                aria-label="Copy short URL"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </motion.div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{url.clicks}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  clicks
                </span>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  aria-label="View Analytics"
                >
                  <BarChart2 className="h-4 w-4" />
                  Analytics
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50"
                  aria-label="Delete URL"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UrlCard;
