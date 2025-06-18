# 🔗 LinkSnip - Modern URL Shortener

A powerful, modern URL shortening platform with advanced analytics, QR code generation, and PWA capabilities. Built with React, Vite, and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-blue?style=for-the-badge&logo=netlify)](https://link-snip.netlify.app/)
![LinkSnip](https://img.shields.io/badge/LinkSnip-URL%20Shortener-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

## ✨ Features

### 🚀 Core Functionality

- **URL Shortening**: Transform long URLs into short, shareable links
- **Custom URLs**: Create branded short URLs (for logged-in users)
- **QR Code Generation**: Generate QR codes for any URL
- **Click Tracking**: Monitor link performance in real-time
- **Analytics Dashboard**: Detailed insights into link performance

### 📊 Advanced Analytics

- **Total Clicks**: Track overall link performance
- **Unique Visitors**: Identify unique user interactions
- **Geographic Data**: See where your traffic comes from
- **Device Breakdown**: Understand user device preferences
- **Referrer Analysis**: Track traffic sources
- **Bot Detection**: Filter out suspicious traffic
- **Click Growth**: Visualize trends over time

### 🎨 User Experience

- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works perfectly on all devices
- **PWA Support**: Install as a native app
- **Offline Support**: Works without internet connection
- **Fast Loading**: Optimized for performance
- **Accessibility**: WCAG compliant design

### 🔐 Authentication & Security

- **User Registration/Login**: Secure authentication system
- **Protected Routes**: Secure dashboard access
- **Anonymous Usage**: Use without signing up
- **Data Privacy**: Secure data handling

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and context
- **Vite 6.3** - Fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **React Helmet Async** - SEO optimization

### UI/UX Libraries

- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Toast notifications
- **Chart.js** - Data visualization

### PWA & Performance

- **Vite PWA Plugin** - Progressive Web App support
- **Service Worker** - Offline functionality
- **Code Splitting** - Lazy loading for performance
- **Error Boundaries** - Graceful error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mudassir-dev713/Url_Shortner_Frontend.git
   cd linksnip
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_BACKEND_URL=your_backend_api_url
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 PWA Features

### Installation

- **Automatic Prompt**: Shows install prompt for eligible users
- **Smart Timing**: Respects user preferences and shows at appropriate times
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen mode and native feel

### Offline Functionality

- **Offline Detection**: Real-time network status monitoring
- **Graceful Degradation**: Shows appropriate messages when offline
- **Smart Redirects**: Redirects to appropriate pages when back online
- **Cached Content**: Service worker caches essential resources

## 🏗️ Project Structure

```
src/
├── api/                 # API integration
│   ├── Auth.api.js     # Authentication endpoints
│   ├── Url.api.js      # URL shortening endpoints
│   └── Qr.api.js       # QR code endpoints
├── components/         # Reusable components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Navbar.jsx      # Navigation component
│   ├── Footer.jsx      # Footer component
│   ├── UrlCard.jsx     # URL display card
│   ├── QrCard.jsx      # QR code display card
│   └── ...            # Other components
├── context/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── ThemeContext.jsx # Theme management
│   ├── UrlContext.jsx  # URL state management
│   └── QrContext.jsx   # QR code state management
├── hooks/             # Custom React hooks
│   └── useOffline.js  # Offline detection hook
├── pages/             # Page components
│   ├── HomePage.jsx   # Landing page
│   ├── ShortenerPage.jsx # URL shortening page
│   ├── DashboardPage.jsx # User dashboard
│   ├── AnalyticsDashboard.jsx # Analytics page
│   └── ...           # Other pages
├── utils/             # Utility functions
│   ├── Constant.js    # Constants and data
│   └── ...           # Other utilities
└── main.jsx          # App entry point
```

## 🎯 Key Features Explained

### URL Shortening

- **Instant Shortening**: Create short URLs in seconds
- **Custom Codes**: Personalized short codes for logged-in users
- **Validation**: URL format validation and error handling
- **Copy to Clipboard**: One-click copying of shortened URLs

### Analytics Dashboard

- **Real-time Data**: Live click tracking and analytics
- **Visual Charts**: Interactive charts for data visualization
- **Geographic Insights**: Country-wise click distribution
- **Device Analytics**: Browser and device breakdown
- **Referrer Tracking**: Traffic source analysis

### QR Code Generation

- **Instant Generation**: Create QR codes for any URL
- **Customizable**: Different sizes and formats
- **Download Support**: Save QR codes as images
- **Integration**: Seamless integration with URL shortening

## 🔧 Configuration

### Environment Variables

```env
# Backend API URL
VITE_BACKEND_URL=https://api.yourdomain.com

# Frontend domain for URL generation
VITE_BACKEND_URL_DNS=https://yourdomain.com
```

### PWA Configuration

The PWA is configured in `vite.config.js` with:

- **Service Worker**: Automatic registration and updates
- **Manifest**: App metadata and icons
- **Caching Strategy**: Smart caching for optimal performance
- **Offline Support**: Fallback pages and offline detection

## 📊 Performance Optimizations

### Code Splitting

- **Lazy Loading**: Components loaded on demand
- **Route-based Splitting**: Separate bundles for each route
- **Preloading**: Critical components preloaded for better UX

### Caching Strategy

- **Network First**: HTML pages with network fallback
- **Cache First**: Static assets for fast loading
- **Stale While Revalidate**: Dynamic content with background updates

### Bundle Optimization

- **Tree Shaking**: Unused code elimination
- **Minification**: Compressed production builds
- **Gzip Compression**: Reduced file sizes

## 🚀 Deployment

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms

- **Netlify**: Recommended for static hosting
- **Vercel**: Great for React applications
- **GitHub Pages**: Free hosting option
- **Any Static Host**: Compatible with any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **Chart.js** - For the data visualization capabilities

## 📞 Support

- **Email**: mudassirmughal204@gmail.com

---

Made with ❤️ by [Mudassir]
