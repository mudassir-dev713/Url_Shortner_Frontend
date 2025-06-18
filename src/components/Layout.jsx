import { Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Navbar = lazy(() => import('./Navbar'));

const Footer = lazy(() => import('./Footer'));

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-grow" role="main">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Layout;
