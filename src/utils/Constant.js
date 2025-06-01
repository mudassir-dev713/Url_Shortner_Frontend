import {
  Zap,
  BarChart2,
  RefreshCcw,
  Users,
  TrendingUp,
  Shield,
  Globe,
} from 'lucide-react';
import { useUrl } from '../context/UrlContext';

export const useStatsData = () => {
  const { stats } = useUrl();

  return [
    {
      text: 'Links Shortened',
      stats: `${stats?.urls}+` || 0,
    },
    {
      text: 'Happy Users',
      stats: `${stats?.users}+` || 0,
    },
    {
      text: 'Clicks Tracked',
      stats: `${stats?.clicks}+` || 0,
    },
  ];
};

export const features = [
  {
    icon: Zap,
    title: 'Quick Shortening',
    text: 'Shorten long links instantly with a fast and simple interface.',
  },
  {
    icon: RefreshCcw,
    title: 'Custom URLs',
    text: 'Create branded or personalized short URLs to match your needs.',
  },
  {
    icon: BarChart2,
    title: 'Click Tracking',
    text: 'Track total clicks on each URL and monitor their performance in real time.',
  },
  {
    icon: Users,
    title: 'Unique Clicks',
    text: 'Identify how many unique visitors clicked your link.',
  },
  {
    icon: TrendingUp,
    title: 'Click Growth',
    text: 'Visualize your link’s click trends over the past 7 days.',
  },
  {
    icon: Globe,
    title: 'Referrer Breakdown',
    text: 'See where your traffic is coming from – websites, social media, and more.',
  },
  {
    icon: Shield,
    title: 'Bot Traffic Detection',
    text: 'Automatically detect and filter out suspicious or bot-generated traffic.',
  },
];
