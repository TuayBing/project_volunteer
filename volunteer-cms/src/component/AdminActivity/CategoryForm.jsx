import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteCategoriesModal from '../../layout/AdminModal/DeleteCategoriesModal';
import AddCategoriesModal from '../../layout/AdminModal/AddCategoriesMadal';
import EditCategoriesModal from '../../layout/AdminModal/EditCategoriesModal';
import api from '../../utils/axios';

// Pagination Component
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

function CategoryForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/category/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      const response = await api.delete(`/category/categories/${selectedCategory.id}`);
      if (response.data.success) {
        await fetchCategories();
      }
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (name) => {
    setIsLoading(true);
    try {
      const response = await api.post('/category/categories', { name });
      if (response.data.success) {
        await fetchCategories();
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (newName) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/category/categories/${selectedCategory.id}`, { name: newName });
      if (response.data.success) {
        await fetchCategories();
      }
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to edit category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mt-10">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">หมวดหมู่กิจกรรม</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#3BB77E]/90 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          เพิ่มหมวดหมู่
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">ชื่อหมวดหมู่</th>
              <th className="px-6 py-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  ไม่พบข้อมูลหมวดหมู่
                </td>
              </tr>
            ) : (
              currentItems.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {category.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <DeleteCategoriesModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        categoryName={selectedCategory?.name}
        isLoading={isLoading}
      />
      
      <AddCategoriesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddCategory}
        isLoading={isLoading}
      />
      
      <EditCategoriesModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleEditCategory}
        category={selectedCategory}
        isLoading={isLoading}
      />
    </div>
  );
}

export default CategoryForm;