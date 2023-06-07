import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { API } from '../utils/consts';

function GroupCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate()


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API}/groups`, {
        name,
        description,
      });

      console.log('New group created:', response.data);
      // history.push('/groups');
      navigate('/groups')
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear nuevo grupo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-800 font-bold mb-1">Nombre:</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-800 font-bold mb-1">Descripción:</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupCreate;