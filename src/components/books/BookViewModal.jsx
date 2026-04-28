import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, BookOpen, Tag, Eye, EyeOff, Truck, Calendar } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useState, useEffect } from 'react';
import useScrollLock from '../../hooks/useScrollLock';
import { getBookCoverUrl } from '../../services/booksApi';
import { formatCurrency } from '../../utils/format';

const LANGUAGE_DISPLAY = {
  FR: 'Français',
  EN: 'English',
  AR: 'العربية',
};

const Field = ({ label, value, icon: Icon }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-sm font-medium text-gray-800">{value || '—'}</div>
  </div>
);

const BookViewModal = ({ isOpen, book, onClose, onEdit }) => {
  const [imgState, setImgState] = useState('normal'); // 'normal' | 'placeholder' | 'failed'

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) setImgState('normal');
  }, [isOpen, book?.id]);

  if (!book) return null;

  const category = book.tags?.find(t => t.type === 'CATEGORY');
  const etiquette = book.tags?.find(t => t.type === 'ETIQUETTE');
  const status = (book.stockQuantity ?? 0) === 0 ? 'out_of_stock' : 'available';

  const salePrice = book.onSale
    ? book.discountType === 'PERCENTAGE'
      ? book.price * (1 - book.discountValue / 100)
      : Math.max(0, book.price - book.discountValue)
    : null;

  const coverUrl = getBookCoverUrl(book.id);
  const placeholderUrl = getBookCoverUrl(book.id, true);

  const handleEditClick = () => {
    onClose();
    onEdit(book);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col">

              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      Fiche livre
                    </p>
                    <h2 className="text-lg font-bold text-white leading-snug line-clamp-2">
                      {book.title}
                    </h2>
                    {book.author?.name && (
                      <p className="text-slate-300 text-sm mt-1">{book.author.name}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0 mt-0.5 text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6 space-y-6">

                  {/* Cover + metadata row */}
                  <div className="flex gap-5">

                    {/* Cover image */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      {imgState === 'failed' ? (
                        <div className="w-28 h-40 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                          <BookOpen className="w-8 h-8 text-gray-300" />
                        </div>
                      ) : (
                        <img
                          src={imgState === 'placeholder' ? placeholderUrl : coverUrl}
                          alt={book.title}
                          className="w-28 h-40 object-cover rounded-xl shadow-md border border-gray-100"
                          onError={() => {
                            if (imgState === 'normal') setImgState('placeholder');
                            else setImgState('failed');
                          }}
                        />
                      )}

                      {/* Visibility badge */}
                      {book.visibleInCatalog === false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          <EyeOff className="w-2.5 h-2.5" />
                          Pack only
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Eye className="w-2.5 h-2.5" />
                          Catalogue
                        </span>
                      )}
                    </div>

                    {/* Metadata grid */}
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6 gap-y-4 content-start">
                      <Field label="Auteur" value={book.author?.name} />
                      <Field label="Catégorie" value={category?.nameFr} />
                      <Field label="Langue" value={LANGUAGE_DISPLAY[book.language] || book.language} />
                      <Field label="Étiquette" value={etiquette?.nameFr} />

                      {/* Price */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Prix</span>
                        {book.onSale ? (
                          <div className="space-y-0.5">
                            <div className="text-xs text-gray-400 line-through">{formatCurrency(book.price)}</div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold text-orange-600">{formatCurrency(salePrice)}</span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                                <Tag className="w-2.5 h-2.5" />
                                {book.discountType === 'PERCENTAGE'
                                  ? `-${book.discountValue}%`
                                  : `-${book.discountValue} DZD`}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-800">{formatCurrency(book.price)}</div>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stock</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800">{book.stockQuantity ?? 0}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {status === 'available' ? 'Disponible' : 'Rupture'}
                          </span>
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Livraison</span>
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {book.automaticDeliveryFee
                            ? 'Automatique'
                            : book.deliveryFee != null
                              ? formatCurrency(book.deliveryFee)
                              : '—'}
                        </div>
                      </div>

                      {/* Preorder */}
                      {book.preorderDate && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Précommande</span>
                          </div>
                          <div className="text-sm font-medium text-gray-800">{book.preorderDate}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {book.description && (
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Description
                      </p>
                      <div data-color-mode="light" className="prose prose-sm max-w-none text-gray-700">
                        <MDEditor.Markdown source={book.description} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </motion.button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookViewModal;
