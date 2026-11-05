import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import WhatsAppButton from './components/layout/WhatsAppButton.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ProtectedRoute from './components/ui/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Pricing from './pages/Pricing.jsx';
import Order from './pages/Order.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import FAQ from './pages/FAQ.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Refund from './pages/Refund.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/admin/Login.jsx';
import AdminRegister from './pages/admin/Register.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Orders from './pages/admin/Orders.jsx';
import ServicesAdmin from './pages/admin/Services.jsx';
import PackagesAdmin from './pages/admin/Packages.jsx';
import PortfolioAdmin from './pages/admin/Portfolio.jsx';
import TestimonialsAdmin from './pages/admin/Testimonials.jsx';
import BlogsAdmin from './pages/admin/Blogs.jsx';
import Messages from './pages/admin/Messages.jsx';
import Settings from './pages/admin/Settings.jsx';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/order" element={<Order />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Protected */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="packages" element={<PackagesAdmin />} />
          <Route path="portfolio" element={<PortfolioAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="blogs" element={<BlogsAdmin />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}