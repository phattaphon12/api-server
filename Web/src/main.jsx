import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import ViewConfig from './pages/viewConfig/viewConfig';
import TempLogForm from './pages/tempLogForm/tempLogForm';
import ViewLogs from './pages/viewLogs/viewLogs';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <ViewConfig />,
      },
      {
        path: '/temp',
        element: <TempLogForm />,
      },
      {
        path: '/logs',
        element: <ViewLogs />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
