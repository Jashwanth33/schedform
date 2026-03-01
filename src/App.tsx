/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import LinkList from './pages/LinkList';
import LinkEditor from './pages/LinkEditor';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import PublicPage from './pages/PublicPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  // Simple auth simulation: if path is /landing, show landing page
  // In a real app, we'd check if the user is logged in
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/s/:slug" element={<PublicPage />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/links" element={<AppLayout><LinkList /></AppLayout>} />
        <Route path="/links/new" element={<AppLayout><LinkEditor /></AppLayout>} />
        <Route path="/bookings" element={<AppLayout><Bookings /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}


