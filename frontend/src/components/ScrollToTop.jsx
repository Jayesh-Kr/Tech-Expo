import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll to the top of the page when navigating to a new route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 