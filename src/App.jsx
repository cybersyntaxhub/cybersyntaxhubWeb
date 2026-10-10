import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';

import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Donate from '@/pages/Donate';

const SiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SiteRoutes />
      <Toaster />
    </Router>
  );
}

export default App;
