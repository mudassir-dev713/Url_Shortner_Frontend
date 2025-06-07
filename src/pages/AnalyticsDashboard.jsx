import { lazy, Suspense, useEffect, useState } from 'react';

const Line = lazy(() =>
  import('react-chartjs-2').then((module) => ({ default: module.Line }))
);
const Doughnut = lazy(() =>
  import('react-chartjs-2').then((module) => ({ default: module.Doughnut }))
);

import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

import { useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { fetchAnalytics } from '../api/Url.api';
import { IconTooltip } from '../components/Tooltip';

import {
  BarChart2,
  Users,
  Globe,
  Chrome,
  Clock,
  Bug,
  Share2,
} from 'lucide-react';
import Loader from '../components/Loader';
import { Helmet } from 'react-helmet-async';

const AnalyticsDashboard = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const location = useLocation();
  const { fullUrl, shortUrl, createdAt } = location.state || {};
  const isDark = theme === 'dark';
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAnalytics(id);
        setData(res);
      } catch (err) {
        toast.error('Error in fetching Analytics');
        console.error(err);
      }
    };
    load();
  }, [id]);

  if (!data) return <Loader />;

  const hasClickGrowthData =
    data.clickGrowth &&
    Array.isArray(data.clickGrowth) &&
    data.clickGrowth.length > 0;
  const hasDeviceBreakdown =
    data.deviceBreakdown &&
    Array.isArray(data.deviceBreakdown) &&
    data.deviceBreakdown.length > 0;
  const hasTopReferrers =
    data.topReferrers &&
    Array.isArray(data.topReferrers) &&
    data.topReferrers.length > 0;

  const Card = ({ title, value, icon, tooltip }) => (
    <div
      className={`p-5 rounded-2xl backdrop-blur-md shadow-md hover:shadow-lg border transition-all duration-200 flex items-center justify-between ${
        isDark
          ? 'bg-gray-800/80 border-gray-700'
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div>
        <div
          className={`flex items-center text-sm font-semibold ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {title}
          <IconTooltip icon={icon} label={tooltip} />
        </div>
        <p
          className={`text-2xl font-bold mt-1 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}
        >
          {value ?? 'N/A'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Analytics for {shortUrl} | LinkSnip</title>
        <meta
          name="description"
          content={`Track clicks, countries, devices, and referrers for ${fullUrl}`}
        />
        <meta property="og:title" content={`Link Analytics | ${shortUrl}`} />
        <meta
          property="og:description"
          content={`Created on ${createdAt}. Full link: ${fullUrl}`}
        />
        <meta
          property="og:image"
          content="https://link-snip.netlify.app/og-image.jpg"
        />
        <meta
          property="og:url"
          content={`https://link-snip.netlify.app/analyticsDashboard/${id}`}
        />
      </Helmet>

      <div
        style={{ viewTransitionName: `card-${id}` }}
        className={`p-6 md:p-10 max-w-6xl mx-auto ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        <h2 className="text-3xl font-bold mb-8">📊 Analytics Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card
            title="Total Clicks"
            value={data.totalClicks || 0}
            icon={BarChart2}
            tooltip="Total number of times the shortened URL was clicked."
          />
          <Card
            title="Unique Visitors"
            value={data.uniqueVisitors || 0}
            icon={Users}
            tooltip="Number of unique users who clicked the link."
          />
          <Card
            title="Top Country"
            value={data.topCountry || 'N/A'}
            icon={Globe}
            tooltip="Country with the highest number of clicks."
          />
          <Card
            title="Top Browser"
            value={data.topBrowser || 'N/A'}
            icon={Chrome}
            tooltip="Browser used most frequently by users."
          />
          <Card
            title="Peak Hour"
            value={
              typeof data.peakHour === 'number'
                ? `${data.peakHour}:00`
                : data.peakHour || 'N/A'
            }
            icon={Clock}
            tooltip="Hour of the day with the highest click activity."
          />
          <Card
            title="Bot Traffic"
            value={data.botTraffic || 0}
            icon={Bug}
            tooltip="Total number of detected bot clicks."
          />

          <Card
            title="Top Referrer"
            value={
              hasTopReferrers
                ? data.topReferrers[0].referrer || 'Unknown'
                : 'Unknown'
            }
            icon={Share2}
            tooltip="The source that referred the most users."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`p-6 rounded-2xl shadow-md border ${
              isDark
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart2 size={20} /> Click Growth (7d)
            </h3>

            {!hasClickGrowthData ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No click growth data available.
              </p>
            ) : (
              <Suspense fallback={<Loader />}>
                <Line
                  data={{
                    labels: data.clickGrowth.map((d) => d._id), // dates
                    datasets: [
                      {
                        label: 'Clicks',
                        data: data.clickGrowth.map((d) => d.count),
                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                        borderColor: '#3b82f6',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.5,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#2563eb',
                        hoverBorderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    animation: {
                      duration: 1000,
                      easing: 'easeOutQuart',
                    },
                    plugins: {
                      legend: {
                        labels: {
                          color: isDark ? '#fff' : '#000',
                          font: { weight: 'bold' },
                        },
                      },
                      tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                          title: (tooltipItems) => {
                            const date = tooltipItems[0].label;
                            return new Date(date).toLocaleDateString(
                              undefined,
                              {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            );
                          },
                          label: (tooltipItem) =>
                            `Clicks: ${tooltipItem.parsed.y}`,
                        },
                        backgroundColor: isDark ? '#1e40af' : '#3b82f6',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                      },
                    },
                    scales: {
                      x: {
                        type: 'time',
                        time: {
                          unit: 'day',
                          tooltipFormat: 'PP',
                          displayFormats: {
                            day: 'MMM d',
                          },
                        },
                        ticks: {
                          color: isDark ? '#ddd' : '#444',
                          maxRotation: 45,
                          minRotation: 30,
                          maxTicksLimit: 7,
                        },
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: isDark ? '#ddd' : '#444',
                          stepSize: 1,
                          precision: 0,
                        },
                        grid: {
                          color: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0,0,0,0.1)',
                          borderDash: [5, 5],
                        },
                      },
                    },
                  }}
                />
              </Suspense>
            )}
          </div>

          <div
            className={`p-6 rounded-2xl shadow-md border ${
              isDark
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Chrome size={20} /> Device Breakdown
            </h3>
            {!hasDeviceBreakdown ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No device breakdown data available.
              </p>
            ) : (
              <Suspense fallback={<Loader />}>
                <Doughnut
                  data={{
                    labels: data.deviceBreakdown.map((d) => d._id),
                    datasets: [
                      {
                        label: 'Devices',
                        data: data.deviceBreakdown.map((d) => d.count),
                        backgroundColor: [
                          '#3b82f6',
                          '#10b981',
                          '#f59e0b',
                          '#ef4444',
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: isDark ? '#fff' : '#000',
                        },
                      },
                    },
                  }}
                />
              </Suspense>
            )}
          </div>

          <div
            className={`p-6 rounded-2xl shadow-md border ${
              isDark
                ? 'bg-gray-900 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Share2 size={20} /> Referrer Breakdown
            </h3>
            {!hasTopReferrers ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No referrer data available.
              </p>
            ) : (
              <Suspense fallback={<Loader />}>
                <Doughnut
                  data={{
                    labels: data.topReferrers.map(
                      (r) => r.referrer || 'Unknown'
                    ),
                    datasets: [
                      {
                        label: 'Referrers',
                        data: data.topReferrers.map((r) => r.count),
                        backgroundColor: [
                          '#6366f1',
                          '#f97316',
                          '#14b8a6',
                          '#db2777',
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: isDark ? '#fff' : '#000',
                        },
                      },
                    },
                  }}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
