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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Add Pack Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddPack}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Ajouter un Pack</span>
          <span className="xs:hidden">Ajouter</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-500 mb-2 sm:mb-3 animate-spin" />
          <p className="text-gray-500 text-base sm:text-lg px-2">Chargement des packs...</p>
        </div>
      ) : packs.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-2 sm:mb-3" />
          <p className="text-gray-500 text-base sm:text-lg px-2">Aucun pack de livres pour le moment</p>
          <p className="text-gray-400 text-xs sm:text-sm px-2">Cliquez sur "Ajouter un Pack" pour créer votre premier pack de livres</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
