import Layout from "./Layout.jsx";

import About from "./About";

import AdminBookings from "./AdminBookings";

import AdminCalendar from "./AdminCalendar";

import AdminEnquiries from "./AdminEnquiries";

import AdminStaff from "./AdminStaff";

import Browse from "./Browse";

import Contact from "./Contact";

import Finance from "./Finance";

import Home from "./Home";

import Sell from "./Sell";

import VehicleDetail from "./VehicleDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    About: About,
    
    AdminBookings: AdminBookings,
    
    AdminCalendar: AdminCalendar,
    
    AdminEnquiries: AdminEnquiries,
    
    AdminStaff: AdminStaff,
    
    Browse: Browse,
    
    Contact: Contact,
    
    Finance: Finance,
    
    Home: Home,
    
    Sell: Sell,
    
    VehicleDetail: VehicleDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<About />} />
                
                
                <Route path="/About" element={<About />} />
                
                <Route path="/AdminBookings" element={<AdminBookings />} />
                
                <Route path="/AdminCalendar" element={<AdminCalendar />} />
                
                <Route path="/AdminEnquiries" element={<AdminEnquiries />} />
                
                <Route path="/AdminStaff" element={<AdminStaff />} />
                
                <Route path="/Browse" element={<Browse />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Finance" element={<Finance />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Sell" element={<Sell />} />
                
                <Route path="/VehicleDetail" element={<VehicleDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}