import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tailwindcss/tailwind.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './App';

const router = createBrowserRouter([
  { path: "*", Component: Root }
])

function App() {
  return <RouterProvider router={router} />
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
