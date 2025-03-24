import React from "react";
import { Outlet } from "react-router-dom";
import Layout from './pages/layout/Layout.jsx';
import './index.css';
import './App.css'

const App = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
