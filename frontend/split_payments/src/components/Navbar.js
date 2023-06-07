import React from 'react';

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return (
    <nav className="bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-lg font-bold">Split Payments</span>
          </div>
          <div className="flex">
            <a
              href="/inicio"
              className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Inicio
            </a>
            <a
              href="/groups"
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
            <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md"
              >
                Log Out
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;