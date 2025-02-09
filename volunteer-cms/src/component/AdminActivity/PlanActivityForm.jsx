import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AddPlanModal from '../../layout/AdminModal/AddPlanModal';
import EditPlanModal from '../../layout/AdminModal/EditPlanModal';
import DeletePlanModal from '../../layout/AdminModal/DeletePlanModal';
import api from '../../utils/axios';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    let pages = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(start + maxPagesToShow - 1, totalPages);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 p-4">
      <button
        onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          !canGoPrevious
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 rounded-full transition-all duration-200 ${
            currentPage === number
              ? 'bg-[#3BB77E] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
          !canGoNext
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const PlanActivityForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/plan-activities');
      if (response.data.success) {
        setPlans(response.data.data);
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/plan-activities', formData);
      if (response.data.success) {
        await fetchPlans();
        setIsAddModalOpen(false);
      } else {
        setError('ไม่สามารถเพิ่มแผนกิจกรรมได้');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มแผนกิจกรรม');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/plan-activities/${formData.id}`, formData);
      if (response.data.success) {
        await fetchPlans();
        setIsEditModalOpen(false);
      } else {
        setError('ไม่สามารถแก้ไขแผนกิจกรรมได้');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขแผนกิจกรรม');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await api.delete(`/plan-activities/${selectedPlan.id}`);
      if (response.data.success) {
        await fetchPlans();
        setIsDeleteModalOpen(false);
      } else {
        setError('ไม่สามารถลบแผนกิจกรรมได้');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบแผนกิจกรรม');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.Activity?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  const truncateText = (text, maxLength = 40) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  if (isLoading && !plans.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BB77E]"></div>
      </div>
    );
  }

  if (error && !plans.length) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#3BB77E]/90"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow mt-10">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">แผนกิจกรรม</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาแผนกิจกรรม..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E]/50 focus:border-[#3BB77E] transition-colors duration-200"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#3BB77E]/90 transition-colors duration-200 w-full sm:w-auto whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                เพิ่มแผนกิจกรรม
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ชื่อกิจกรรม</th>
                <th className="px-6 py-3">plan_id</th>
                <th className="px-6 py-3">วันที่สร้าง</th>
                <th className="px-6 py-3">วันที่อัพเดท</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'ไม่พบแผนกิจกรรมที่ค้นหา' : 'ไม่พบข้อมูลแผนกิจกรรม'}
                  </td>
                </tr>
              ) : (
                currentItems.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <div className="max-w-xs" title={plan.Activity?.name}>
                        {truncateText(plan.Activity?.name || 'ไม่ระบุชื่อกิจกรรม')}
                      </div>
                    </td>
                    <td className="px-6 py-4">{plan.plan_id}</td>
                    <td className="px-6 py-4">
                      {new Date(plan.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(plan.updated_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddPlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAdd}
        isLoading={isLoading}
      />

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditSubmit}
        isLoading={isLoading}
        planData={selectedPlan}
      />

      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        planName={selectedPlan?.Activity?.name}
        isLoading={isLoading}
      />
    </>
  );
};

export default PlanActivityForm;