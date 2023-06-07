import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { API } from '../utils/consts';

function ExpensesDetails() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [debts, setDebts] = useState([]);
  const [debtorEmail, setDebtorEmail] = useState('');
  const [creditorEmail, setCreditorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseId, setExpenseId] = useState(id);

  useEffect(() => {
    fetchExpenseDetails();
    fetchDebtsByExpenseId();
  }, []);
  
  useEffect(() => {
    console.log(expense)
    if (expense) {
      setCreditorEmail(expense.user_email)

    }

  }, [expense])

  const fetchExpenseDetails = async () => {
    try {
      const response = await axios.get(`${API}/expenses/${id}`);
      setExpense(response.data.data);
    } catch (error) {
      console.error('Error fetching expense details:', error);
    }
  };

  const fetchDebtsByExpenseId = async () => {
    try {
      const response = await axios.get(`${API}/expenses/${id}/debts`);
      setDebts(response.data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log({
        debtor_email: debtorEmail,
        creditor_email: creditorEmail,
        amount: parseFloat(amount),
        expense_id: parseInt(expenseId),
      })
      const response = await axios.post(`${API}/debts`, {
        debtor_email: debtorEmail,
        creditor_email: creditorEmail,
        amount: parseInt(amount),
        expense_id: parseInt(expenseId),
      });
  
      console.log('Debt created:', response.data);
      // Limpiar los campos después de crear la deuda
      setDebtorEmail('');
      setAmount('');
      // Actualizar la lista de deudas después de crear una nueva deuda
      fetchDebtsByExpenseId();
    } catch (error) {
      console.error('Error creating debt:', error);
    }
  };

  if (!expense) {
    return <div>Cargando detalles del gasto...</div>;
  }
  return (
    <div className='p-4'>
     <h2 className="text-2xl font-bold text-gray-800 mb-2">Detalles del Gasto</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Gasto de {expense.user_email}</h3>
        <p className="text-gray-600 mb-2">Monto: ${expense.amount}</p>
        <p className="text-gray-600 mb-2">Descripción: {expense.description}</p>
        <p className="text-gray-600 mb-2">Fecha: {expense.date}</p>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Lista de Deudas</h2>
      <ul className="bg-white shadow-lg rounded-lg overflow-hidden p-4 mb-4">
        {debts.map((debt) => (
          <li
            key={debt.id}
            className="flex justify-between items-center text-gray-800 mb-2 border-b border-gray-200 last:border-b-0"
          >
            <div>
              <p className="font-bold">Deudor: {debt.debtor_mail}</p>
              <p className="font-bold">Acreedor: {debt.creditor_mail}</p>
            </div>
            <p className="font-bold">Monto: ${debt.amount}</p>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Crear Nueva Deuda</h2>
      <form className="bg-white shadow-lg rounded-lg overflow-hidden p-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="debtorEmail">
            Email del Deudor
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="debtorEmail"
            type="email"
            placeholder="Email del Deudor"
            value={debtorEmail}
            onChange={(event) => setDebtorEmail(event.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Monto
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            step="0.01"
            placeholder="Monto"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          type="submit"
        >
          Crear Deuda
        </button>
      </form>
    </div>
  );
}

export default ExpensesDetails;