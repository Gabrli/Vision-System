import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LiveAnalysis from './pages/LiveAnalysis';
import Settings from './pages/Settings';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-analysis" element={<LiveAnalysis />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default AppRoutes;
