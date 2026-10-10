import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';
import NotFound from '@/pages/NotFound';

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    // reducedMotion="user" makes every motion component on the site honour the
    // OS "reduce motion" setting instead of animating regardless.
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollToTop />
        <SiteRoutes />
      </Router>
    </MotionConfig>
  );
}

export default App;
