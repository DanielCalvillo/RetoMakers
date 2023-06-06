import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-lg font-bold">Split Payments</span>
          </div>
          <div className="flex">
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Inicio
            </a>
            <a
              href="/groupList"
              className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Grupos
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Gastos
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Deudas
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;