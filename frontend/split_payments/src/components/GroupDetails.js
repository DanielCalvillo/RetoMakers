import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

import Modal from 'react-modal';

import { API } from '../utils/consts';

Modal.setAppElement('#root');

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '300px',
    height: '200px',
    border: 'none',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
};

async function createGroupMember(groupId, email, setErrorMessage) {
  try {
    const response = await axios.post(`${API}/groups/${groupId}/members`, {
      email,
    });

    const newMember = response.data.data;
    console.log('New member:', newMember);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Usuario no encontrado');
      setErrorMessage('Usuario no encontrado');
    } else {
      console.error('Error creating group member:', error);
      setErrorMessage('Usuario no encontrado');
    }
  }
}

async function getAllGroupMembers(groupId) {
  try {
    const response = await axios.get(`${API}/groups/${groupId}/members`);
    const members = response.data.data;
    return members;
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
}

async function deleteGroupMember(groupId, email) {
  try {
    await axios.delete(`${API}/groups/${groupId}/members`, {
      data: { email },
    });
    console.log('Group member deleted successfully');
  } catch (error) {
    console.error('Error deleting group member:', error);
  }
}

async function createExpense(groupId, amount, description, date, creatorEmail, setErrorMessage, resetExpenseData) {
  try {
    const response = await axios.post(`${API}/expenses`, {
      group_id: groupId,
      amount,
      description,
      date,
      email: creatorEmail,
    });

    const newExpense = response.data.data;
    console.log('New expense:', newExpense);
    setErrorMessage('');
    resetExpenseData();
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Usuario no encontrado');
      setErrorMessage('Usuario no encontrado');
    } else {
      console.error('Error creating expense:', error);
      setErrorMessage('Usuario no encontrado');
    }
  }
}

async function getExpensesByGroupId(groupId) {
  try {
    const response = await axios.get(`${API}/expenses/group/${groupId}`);
    const expenses = response.data.data;
    return expenses;
  } catch (error) {
    console.error('Error fetching group expenses:', error);
    return [];
  }
}

async function getExpenseDebts(expenseId) {
  try {
    const response = await axios.get(`${API}/expenses/${expenseId}/debts`);
    const debts = response.data.data;
    return debts;
  } catch (error) {
    console.error('Error fetching expense debts:', error);
    return [];
  }
}

function GroupDetails() {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    date: '',
    creator_email: '',
  });
  const [expenses, setExpenses] = useState([]);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchGroup();
    fetchGroupMembers();
    fetchGroupExpenses();
  }, []);

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${API}/groups/${id}`);
      console.log(response.data);
      setGroup(response.data.data);
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchGroupMembers = async () => {
    const members = await getAllGroupMembers(id);
    setMembers(members);
  };

  const fetchGroupExpenses = async () => {
    const expenses = await getExpensesByGroupId(id);
    setExpenses(expenses);
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  const handleAddMember = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    await createGroupMember(id, email, setErrorMessage);
    event.target.reset();
    fetchGroupMembers();
  };

  const handleDeleteMember = async () => {
    if (memberToDelete) {
      await deleteGroupMember(id, memberToDelete.email);
      fetchGroupMembers();
      closeModal();
    }
  };

  const openModal = (member) => {
    setModalIsOpen(true);
    setMemberToDelete(member);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setMemberToDelete(null);
  };

  const handleExpenseChange = (event) => {
    setExpenseData({
      ...expenseData,
      [event.target.name]: event.target.value,
    });
  };

  const resetExpenseData = () => {
    setExpenseData({
      amount: '',
      description: '',
      date: '',
      creator_email: '',
    });
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const { amount, description, date, creator_email } = expenseData;
    await createExpense(id, amount, description, date, creator_email, setErrorMessage, resetExpenseData);
    fetchGroupExpenses();
  };

  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    openModal();
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
      closeModal();
      fetchGroupExpenses();
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(`${API}/expenses/${expenseId}`);
      console.log('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">{group.name}</h2>
            <p>{group.description}</p>

            <form onSubmit={handleAddMember} className="mt-4">
              <label htmlFor="email" className="block text-gray-800 font-bold mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
              >
                Add Member
              </button>
            </form>

            <h3 className="text-lg font-semibold mt-8">Group Members</h3>
            <ul className="mt-4">
              {members.map((member) => (
                <li key={member.id} className="text-gray-800 flex justify-between">
                  <span>{member.name}</span>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => openModal(member)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Modal */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Delete Member Modal"
              style={customModalStyles}
            >
              {memberToDelete ? (
                <div>
                  <h2>Delete Member</h2>
                  <p>Are you sure you want to delete {memberToDelete?.name}?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                      onClick={handleDeleteMember}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : expenseToDelete ? (
                <div>
                  <h2>Delete Expense</h2>
                  <p>Are you sure you want to delete this expense?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2"
                      onClick={confirmDeleteExpense}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : null}
            </Modal>

            <h3 className="text-lg font-semibold mt-8">Expenses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {expenses.map((expense) => (
                <div className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer" key={expense.id} onClick={() => console.log(expense)}>
                  <h4 className="text-lg font-semibold mb-2">{expense.description}</h4>
                  <p className="text-gray-500 mb-2">Amount: ${expense.amount}</p>
                  <p className="text-gray-500 mb-2">Owner: {expense.expense_owner_email}</p>
                  {/* <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mt-2"
                    onClick={() => handleDeleteExpense(expense)}
                  >
                    Delete
                  </button> */}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-8">New Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="mt-4">
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-800 font-bold mb-1">
                  Amount:
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleExpenseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-800 font-bold mb-1">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={expenseData.description}
                  onChange={handleExpenseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-800 font-bold mb-1">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={expenseData.date}
                  onChange={handleExpenseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="creator_email" className="block text-gray-800 font-bold mb-1">
                  Creator Email:
                </label>
                <input
                  type="email"
                  id="creator_email"
                  name="creator_email"
                  value={expenseData.creator_email}
                  onChange={handleExpenseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Create Expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
