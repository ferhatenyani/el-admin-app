import { useState } from 'react';
import { Plus, Package, Loader2 } from 'lucide-react';
import PackCard from './PackCard';
import PackModal from './PackModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';
import { createPack, updatePack } from '../../services/packsApi';

const PackManager = ({ packs, setPacks, availableBooks, onDeleteRequest, loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedPacks,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination(packs, 5);

  const handleAddPack = () => {
    setEditingPack(null);
    setIsModalOpen(true);
  };

  const handleEditPack = (pack) => {
    setEditingPack(pack);
    setIsModalOpen(true);
  };

  const handleDeletePack = (pack) => {
    onDeleteRequest('pack', pack);
  };

  const handleSavePack = async (packData, coverImage) => {
    try {
      setSaving(true);
      let result;

      if (editingPack) {
        // Update existing pack
        result = await updatePack(editingPack.id, packData, coverImage);
        setPacks(packs.map(p =>
          p.id === editingPack.id ? result : p
        ));
      } else {
        // Create new pack
        result = await createPack(packData, coverImage);
        setPacks([...packs, result]);
      }

      setIsModalOpen(false);
      setEditingPack(null);
    } catch (error) {
      console.error('Error saving pack:', error);
      throw error; // Let the modal handle the error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Pack Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddPack}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden min-[400px]:inline">Ajouter un Pack</span>
          <span className="min-[400px]:hidden">Ajouter</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Loader2 className="w-12 h-12 text-green-600 mb-3 animate-spin" />
          <p className="text-gray-600 text-base font-medium">Chargement des packs...</p>
        </div>
      ) : packs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <Package className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-gray-800 text-base font-semibold mb-1.5">Aucun pack de livres</p>
          <p className="text-gray-500 text-sm max-w-md text-center px-4">
            Créez votre premier pack de livres groupés
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPacks.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                onEdit={() => handleEditPack(pack)}
                onDelete={() => handleDeletePack(pack)}
              />
            ))}
          </div>

          {/* Pagination */}
          {packs.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <PackModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPack(null);
        }}
        onSave={handleSavePack}
        pack={editingPack}
        availableBooks={availableBooks}
        saving={saving}
      />
    </div>
  );
};

export default PackManager;
