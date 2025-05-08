import React from 'react';
import EditUserForm from "../../components/Admin/EditUserForm"; 
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "./admin";

function Doctors() {
  const [users, setUsers] = useState([]);
          const [isEditModalOpen, setIsEditModalOpen] = useState(false);
          const [selectedUser, setSelectedUser] = useState(null); 
      useEffect(() => {
          fetchUsers();
      }, []);
  
      const fetchUsers = async () => {
          try {
              const data = await getAllUsers();
              setUsers(data);
          } catch (error) {
              console.error("Error fetching users:", error);
          }
      };
  
      const handleDelete = async (userId) => {
          if (window.confirm("Are you sure you want to delete this user?")) {
              await deleteUser(userId);
              fetchUsers();
          }
      };
  
      const handleEdit = (user) => {
          setSelectedUser(user); // Set user details for editing
          setIsEditModalOpen(true); // Open modal
      };
  return (
    <div className="container mx-auto px-4">

  {/* Table Section */}
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow-xl border border-gray-300">
      <thead>
        <tr className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <th className="border p-4 text-left text-lg font-semibold">ID</th>
          <th className="border p-4 text-left text-lg font-semibold">Name</th>
          <th className="border p-4 text-left text-lg font-semibold">Email</th>
          <th className="border p-4 text-left text-lg font-semibold">Role</th>
          <th className="border p-4 text-left text-lg font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.filter(user => user.role === 'doctor').map((user) => (
          <tr key={user.id} className="hover:bg-gray-100 transition-all duration-300 ease-in-out">
            <td className="border p-4 text-gray-700">{user.id}</td>
            <td className="border p-4 text-gray-700 font-semibold">{user.first_name} {user.last_name}</td>
            <td className="border p-4 text-gray-700">{user.email}</td>
            <td className="border p-4 text-gray-700">{user.role}</td>
            <td className="border p-4">
              <button 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition transform hover:scale-105"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
              <button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 ml-2"
                onClick={() => handleEdit(user)} // Open Edit Modal
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Edit Modal */}
  {isEditModalOpen && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6">Edit User</h2>
        <EditUserForm user={selectedUser} onClose={() => setIsEditModalOpen(false)} onUserUpdated={fetchUsers} />
        <div className="flex justify-end mt-4">
          <button 
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition transform hover:scale-105"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

</div>

  )
}

export default Doctors
