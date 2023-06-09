import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { API } from '../utils/consts';

function Inicio() {
  const [debts, setDebts] = useState([]);
  const [payedDebts, setPayedDebts] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchDebts();
    fetchPayedDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await axios.get(`${API}/users/debts`);
      setDebts(response.data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const fetchPayedDebts = async () => {
    try {
      const response = await axios.get(`${API}/users/debts/payed`);
      setPayedDebts(response.data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const handleDebtClick = (debtId) => {
    navigate(`/debts/${debtId}`)
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Deudas</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {debts.map((debt) => (
            <li
              key={debt.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <p
                  className="bg-red-500 text-white py-2 px-4 rounded-md text-center mb-4"
                >
                  SIN PAGAR
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Deuda a {debt.creditor_mail}
                </h3>
                <p className="text-gray-600 mb-4">
                  Monto: ${debt.amount}
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={() => handleDebtClick(debt.id)}>
                  Ver detalles
                </button>
              </div>
            </li>
          ))}
          {debts.length < 1 && <p>No tienes deudas</p>}
          
        </ul>
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Deudas pagadas</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {payedDebts.map((debt) => (
            <li
              key={debt.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <p
                  className="bg-green-500 text-white py-2 px-4 rounded-md text-center mb-4"
p                >
                  PAGADA
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Deuda a {debt.creditor_mail}
                </h3>
                <p className="text-gray-600 mb-4">
                  Monto: ${debt.amount}
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md" onClick={() => handleDebtClick(debt.id)}>
                  Ver detalles
                </button>
              </div>
            </li>
          ))}
          {payedDebts.length < 1 && <p>No tienes deudas pagadas</p>}
          
        </ul>
        
      </div>
    </div>
  );
}

export default Inicio;