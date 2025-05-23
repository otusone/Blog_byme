import React from 'react';
import Navbar from "./components/Navbar";
import BlogCard from "./components/BlogCard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/protectedRoutes/protectedRoutes';
import PostDetail from './components/postDetail';

import { Navigate } from 'react-router-dom';

function App() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/blogcard" element={<BlogCard />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/posts/get/:id" element={<PostDetail />} />


      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  );
}

export default App;
