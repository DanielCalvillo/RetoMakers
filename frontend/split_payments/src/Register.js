import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from './utils/consts';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'last_name') {
      setLastName(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API}/users`, 
        { 
          first_name: name, 
          last_name: lastName,
          email, 
          password,
          return_url: 'http://localhost:3000/inicio',
          refresh_url: 'http://localhost:3000/inicio'
        }
      );

      if (response.status === 200) {
        const token = response.data.data;
        localStorage.setItem('token', token);
        console.log(response.data.account_link.url)
        window.location.replace(response.data.account_link.url);
      } else {
        setErrorMessage('Error inesperado al registrar usuario')
      }
    } catch (error) {
      setErrorMessage('Error inesperado al registrar usuario')
    }
  };

  const handleLogin = () => {
    navigate(`/`)
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">Nombre:</label>
            <input 
              className="border border-gray-300 rounded-md p-2 w-full"  
              type="text" 
              id="name" 
              name="name" 
              value={name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">Apellido:</label>
            <input 
              className="border border-gray-300 rounded-md p-2 w-full"
              type="text" 
              id="last_name" 
              name="last_name" 
              value={lastName} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
            <input 
              className="border border-gray-300 rounded-md p-2 w-full"
              type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block mb-1 font-medium">Contraseña:</label>
            <input 
              className="border border-gray-300 rounded-md p-2 w-full"
              type="password" 
              id="password" 
              name="password" 
              value={password} 
              onChange={handleInputChange} 
            />
          </div>
          {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
          <div className="flex items-center justify-between mt-6" >
            <button type="submit" className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600">Registrarse</button>
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleLogin}
              >
                Iniciar sesión
              </button>

          </div>
        </form>
      </div>
    </div>
  );
};


export default Register;