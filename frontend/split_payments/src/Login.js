import React, { useState } from 'react';
import axios from 'axios';
import { API } from './utils/consts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API}/users/login`, { email, password });
      const token = response.data.data.token;
      // Almacena el token en el localStorage
      localStorage.setItem('token', token);
      // Redirige a la página principal
      // TODO: Redireccionar con React Router no con windows
      window.location.href = '/groups';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleRegister = () => {
    // Redirige al formulario de registro
    window.location.href = '/register';
  };

  const handleRecoverPassword = () => {
    // Redirige a la página de recuperar contraseña
    window.location.href = '/recover_password';
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
          <p className="text-gray-500 text-sm text-center mt-2">
            <span className="cursor-pointer underline" onClick={handleRecoverPassword}>
              Forgot Password
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

