import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import Marketplace from './pages/user/Marketplace';
import AppDetails from './pages/user/AppDetails';
import Recommendations from './pages/user/Recommendations';

import DevDashboard from './pages/developer/DevDashboard';
import MyApps from './pages/developer/MyApps';
import CreateApp from './pages/developer/CreateApp';

import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
    const { user } = useAuth();

    const getHome = () => {
        if (!user) return '/login';
        if (user.role === 'USER') return '/marketplace';
        if (user.role === 'DEVELOPER') return '/developer/dashboard';
        if (user.role === 'ADMIN') return '/admin/dashboard';
        return '/login';
    };

    return (
        <Routes>
            <Route path="/" element={<Navigate to={getHome()} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/marketplace" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <Layout><Marketplace /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/app/:id" element={
                <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                    <Layout><AppDetails /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/recommendations" element={
                <ProtectedRoute allowedRoles={['USER']}>
                    <Layout><Recommendations /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/developer/dashboard" element={
                <ProtectedRoute allowedRoles={['DEVELOPER']}>
                    <Layout><DevDashboard /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/developer/apps" element={
                <ProtectedRoute allowedRoles={['DEVELOPER']}>
                    <Layout><MyApps /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/recommendations" element={
    <ProtectedRoute allowedRoles={['USER']}>
        <Layout><Recommendations /></Layout>
    </ProtectedRoute>
} />
            <Route path="/developer/create" element={
                <ProtectedRoute allowedRoles={['DEVELOPER']}>
                    <Layout><CreateApp /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default App;