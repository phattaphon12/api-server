import React from "react";
import { Outlet } from "react-router-dom";
import Layout from './pages/layout/Layout.jsx';
import './index.css';
import './App.css'

const App = () => {
  return (
    <Layout>
      <Outlet /> {/* ต้องมี Outlet เพื่อให้ลูกๆ คอมโพเนนต์แสดงผล */}
    </Layout>
  );
};

export default App;
