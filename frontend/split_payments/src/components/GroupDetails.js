import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

import Modal from 'react-modal';

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
    textAlign: 'center'
  },
};



async function createGroupMember(groupId, email, setErrorMessage) {
  try {
    const response = await axios.post(`http://localhost:3001/groups/${groupId}/members`, {
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
    const response = await axios.get(`http://localhost:3001/groups/${groupId}/members`);
    const members = response.data.data;
    return members;
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
}

async function deleteGroupMember(groupId, email) {
  try {
    await axios.delete(`http://localhost:3001/groups/${groupId}/members`, {
      data: { email },
    });
    console.log('Group member deleted successfully');
  } catch (error) {
    console.error('Error deleting group member:', error);
  }
}

function GroupDetails() {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchGroup();
    fetchGroupMembers();
  }, []);

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/groups/${id}`);
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
                    onClick={() => openModal(member)}                  >
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
              <h2>Delete Member</h2>
              <p>Are you sure you want to delete {memberToDelete?.name}?</p>
              <div className="flex justify-end mt-4">
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mr-2" onClick={handleDeleteMember}>
                  Yes
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md" onClick={closeModal}>
                  No
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;