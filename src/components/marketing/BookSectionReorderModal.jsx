import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, BookOpen, Package, Loader, ArrowUpDown } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useScrollLock from '../../hooks/useScrollLock';

const SortableReorderItem = ({ item, type, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const isBook = type === 'book';
  const title = item.title || item.name;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.82 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white rounded-lg border px-3 py-2.5 shadow-sm select-none transition-shadow duration-150 ${
        isDragging
          ? isBook
            ? 'border-blue-400 shadow-lg ring-2 ring-blue-100'
            : 'border-purple-400 shadow-lg ring-2 ring-purple-100'
          : 'border-gray-200 hover:border-gray-300 hover:shadow'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none p-0.5"
        tabIndex={-1}
        aria-label="Glisser pour réordonner"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
        isBook ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      }`}>
        {isBook ? <BookOpen className="w-2.5 h-2.5" /> : <Package className="w-2.5 h-2.5" />}
        {isBook ? 'Livre' : 'Pack'}
      </span>

      <span className="text-sm font-medium text-gray-800 truncate flex-1 min-w-0" title={title}>
        {title}
      </span>

      <span className="flex-shrink-0 text-xs font-mono text-gray-300 w-5 text-right">
        {index + 1}
      </span>
    </div>
  );
};

const BookSectionReorderModal = ({ isOpen, onClose, onSave, section, saving }) => {
  const [orderedBooks, setOrderedBooks] = useState([]);
  const [orderedPacks, setOrderedPacks] = useState([]);

  useScrollLock(isOpen);

  useEffect(() => {
    if (section) {
      setOrderedBooks(section.books || []);
      setOrderedPacks(section.packs || []);
    }
  }, [section, isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleBookDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setOrderedBooks((items) => {
        const oldIndex = items.findIndex((b) => b.id === active.id);
        const newIndex = items.findIndex((b) => b.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePackDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setOrderedPacks((items) => {
        const oldIndex = items.findIndex((p) => p.id === active.id);
        const newIndex = items.findIndex((p) => p.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onSave({ books: orderedBooks, packs: orderedPacks });
  };

  const hasItems = orderedBooks.length > 0 || orderedPacks.length > 0;
  const sectionName = section?.name || section?.nameFr || section?.nameEn || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white/15 p-2 rounded-lg flex-shrink-0">
                      <ArrowUpDown className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white">
                        Réordonner les éléments
                      </h2>
                      {sectionName && (
                        <p className="text-xs sm:text-sm text-blue-100 truncate mt-0.5">
                          {sectionName}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {!hasItems ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <BookOpen className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm">Aucun élément à réordonner</p>
                  </div>
                ) : (
                  <>
                    {orderedBooks.length > 0 && (
                      <div>
                        {orderedBooks.length > 0 && orderedPacks.length > 0 && (
                          <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
                            Livres
                          </p>
                        )}
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleBookDragEnd}
                        >
                          <SortableContext
                            items={orderedBooks.map((b) => b.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="flex flex-col gap-1.5">
                              {orderedBooks.map((book, index) => (
                                <SortableReorderItem
                                  key={book.id}
                                  item={book}
                                  type="book"
                                  index={index}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    )}

                    {orderedBooks.length > 0 && orderedPacks.length > 0 && (
                      <div className="border-t border-gray-100" />
                    )}

                    {orderedPacks.length > 0 && (
                      <div>
                        {orderedBooks.length > 0 && orderedPacks.length > 0 && (
                          <p className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider mb-2">
                            Packs
                          </p>
                        )}
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handlePackDragEnd}
                        >
                          <SortableContext
                            items={orderedPacks.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="flex flex-col gap-1.5">
                              {orderedPacks.map((pack, index) => (
                                <SortableReorderItem
                                  key={pack.id}
                                  item={pack}
                                  type="pack"
                                  index={index}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 px-4 py-4 sm:px-6 border-t bg-gray-50">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasItems}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4" />
                  )}
                  {saving ? 'Sauvegarde...' : "Sauvegarder l'ordre"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookSectionReorderModal;
