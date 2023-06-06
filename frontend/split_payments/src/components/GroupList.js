import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/groups');
      setGroups(response.data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groupList/${groupId}`)
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Grupos</h2>
          <Link to="/groups/create" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
            Crear nuevo grupo
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {group.name}
                </h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={() => handleGroupClick(group.id)}>
                  Ver detalles
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroupList;