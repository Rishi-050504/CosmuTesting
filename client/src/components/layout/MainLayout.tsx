import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarComponent from './Navbar';

const MainLayout = () => {
  const location = useLocation();

  // This effect changes the body's class based on the current page
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.className = 'dark-theme-body';
    } else {
      document.body.className = 'light-theme-body';
    }
  }, [location.pathname]); // Re-run effect when the path changes

  return (
    <>
      <NavbarComponent />
      <main className="main-content-area">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;