import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import api from '../../utils/axios';
import DeleteModal from '../../layout/AdminModal/DeleteModal';
import EditRoleModal from '../../layout/AdminModal/EditRoleModal';
import { deleteUserAsync, fetchStats } from '../../store/userSlice';

function UserAddForm() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    isLoading: false
  });
  const [editRoleModal, setEditRoleModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    currentRole: '',
    isLoading: false
  });
  
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isSuperAdmin = currentUser?.role?.toLowerCase() === 'superadmin';

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/user/all');
      if (response.data.success) {
        const usersData = response.data.data;
        setUsers(usersData);
        setFilteredUsers(usersData);
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user =>
        user.role.toLowerCase() === selectedRole.toLowerCase()
      ));
    }
    setCurrentPage(1);
  }, [selectedRole, users]);

  const handleEditRole = (user) => {
    if (user.id === currentUser.id) {
      alert('ไม่สามารถเปลี่ยนบทบาทของตัวเองได้');
      return;
    }
    
    setEditRoleModal({
      isOpen: true,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      currentRole: user.role,
      isLoading: false
    });
  };

  const handleEditRoleConfirm = async (newRole) => {
    try {
      setEditRoleModal(prev => ({ ...prev, isLoading: true }));
      const response = await api.put(`/user/${editRoleModal.userId}/role`, { 
        role: newRole 
      });

      if (response.data.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === editRoleModal.userId
              ? { ...user, role: newRole }
              : user
          )
        );
        await dispatch(fetchStats());
        setEditRoleModal({ isOpen: false, userId: null, userName: '', currentRole: '', isLoading: false });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดตบทบาท');
    } finally {
      setEditRoleModal(prev => ({ ...prev, isLoading: false }));
    }
  };
  const handleCloseEditRoleModal = () => {
    if (!editRoleModal.isLoading) {
      setEditRoleModal({ isOpen: false, userId: null, userName: '', currentRole: '', isLoading: false });
    }
  };

  const handleDeleteClick = (user) => {
    if (user.id === currentUser.id) {
      alert('ไม่สามารถลบบัญชีของตัวเองได้');
      return;
    }
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await dispatch(deleteUserAsync(deleteModal.userId)).unwrap();
      await dispatch(fetchStats());
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteModal.userId));
      setDeleteModal({ isOpen: false, userId: null, userName: '', isLoading: false });
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({ isOpen: false, userId: null, userName: '', isLoading: false });
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch(role.toLowerCase()) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchUsers} className="text-sm text-red-600 hover:text-red-800">
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">รายชื่อผู้ใช้ทั้งหมด</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-md border border-gray-300 text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">รหัสนักศึกษา</th>
                <th className="px-4 py-3">ชื่อ-นามสกุล</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">คณะ/สาขา</th>
                <th className="px-4 py-3 text-center">บทบาท</th>
                <th className="px-4 py-3 text-center">ชั่วโมง</th>
                {isSuperAdmin && <th className="px-4 py-3 text-center">จัดการ</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {user.studentID}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {`${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-4 py-3">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium">{user.faculty_name}</div>
                        <div className="text-gray-500">{user.major_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {user.total_hours}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSuperAdmin ? 7 : 6} className="px-4 py-3 text-center text-gray-500">
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredUsers.length > itemsPerPage && (
          <div className="px-4 py-3 flex justify-center space-x-1 border-t">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded-md text-sm font-medium
                  ${currentPage === number 
                    ? 'bg-[#3BB77E] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
        userName={deleteModal.userName}
        isLoading={deleteModal.isLoading}
      />

      <EditRoleModal
        isOpen={editRoleModal.isOpen}
        onClose={handleCloseEditRoleModal}
        onConfirm={handleEditRoleConfirm}
        userName={editRoleModal.userName}
        currentRole={editRoleModal.currentRole}
        isLoading={editRoleModal.isLoading}
      />
    </div>
  );
}

export default UserAddForm;