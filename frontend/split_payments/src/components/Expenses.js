import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import { API } from '../utils/consts';

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API}/expenses`);
      console.log(response.data.data)
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleExpenseClick = (expenseId) => {
    navigate(`/expenses/${expenseId}`)
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gastos</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {expense.description}
                </h3>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  ${expense.amount}
                </h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={() => handleExpenseClick(expense.id)}>
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

export default ExpensesList;