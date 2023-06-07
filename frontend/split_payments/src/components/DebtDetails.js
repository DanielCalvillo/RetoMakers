import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { API } from '../utils/consts';

function DebtDetails() {
  const { id } = useParams();
  const [debt, setDebt] = useState(null);

  useEffect(() => {
    fetchDebtDetails();
  }, []);

  const fetchDebtDetails = async () => {
    try {
      const response = await axios.get(`${API}/debts/${id}`);
      setDebt(response.data);
    } catch (error) {
      console.error('Error fetching debt details:', error);
    }
  };

  const handlePayClick = async () => {
    try {
      // Lógica para realizar el pago
      console.log('Pago realizado');
    } catch (error) {
      console.error('Error al realizar el pago:', error);
    }
  };

  if (!debt) {
    return <div>Cargando detalles de la deuda...</div>;
  }

  return (
    <div className='p-4'>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Detalles de la Deuda</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Deuda a {debt.creditor_email}</h3>
        <p className="text-gray-600 mb-4">Monto: ${debt.amount}</p>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          onClick={handlePayClick}
        >
          Pagar
        </button>
      </div>
    </div>
  );
}

export default DebtDetails;