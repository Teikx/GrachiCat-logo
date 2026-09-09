import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { RouterProvider } from './navigation/Router';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><RouterProvider><App /></RouterProvider></React.StrictMode>);
