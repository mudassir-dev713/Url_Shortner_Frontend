import { motion } from 'framer-motion';
import { Trash2, Download, BarChart2, Trash2Icon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQr } from '../context/QrContext';

function QrCard({ url, onDelete }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { deleteQr } = useQr();
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url.qr_code_url || url.qrCode;
    link.download = 'qr-code.png';
    link.click();
  };

  // const handleViewAnalytics = () => {
  //   if (document.startViewTransition) {
  //     document.startViewTransition(() => {
  //       navigate(`/analytics/${url._id}`);
  //     });
  //   } else {
  //     navigate(`/analytics/${url._id}`);
  //   }
  // };
  const handleDelete = async () => {
    try {
      const data = await deleteQr(url.id);
      onDelete(url.id);
    } catch (error) {
      toast.error('Failed to delete Qr');
    }
  };
  const formattedDate = new Date(url.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`w-full border rounded-lg shadow-md p-5 flex flex-col justify-between gap-4
        ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'
        }`}
    >
      {/* URL and date */}
      <div className="mb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">QR for:</p>
        <a
          href={url.full_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-semibold underline break-all"
        >
          {url.full_url}
        </a>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          Created: {formattedDate}
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <img
          src={url.qr_code_url || url.qrCode}
          alt="QR Code"
          className="w-28 h-28  object-contain border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50"
          aria-label="Delete URL"
        >
          <Trash2Icon className="h-4 w-4" onClick={handleDelete} />
        </motion.button>
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
          aria-label="Download QR"
        >
          <Download className="h-4 w-4" />
          Download
        </motion.button>

        {/* <motion.button
          onClick={handleViewAnalytics}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label="View Analytics"
        >
          <BarChart2 className="h-4 w-4" />
          Analytics
        </motion.button> */}
      </div>
    </motion.div>
  );
}

export default QrCard;
