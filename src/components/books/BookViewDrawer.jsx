import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, BookOpen, Tag, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/format';
import { getBookCoverUrl } from '../../services/booksApi';

const LANGUAGE_DISPLAY = {
  FR: 'Français',
  EN: 'English',
  AR: 'العربية',
};

const BADGE_COLORS = {
  gray:   'bg-slate-100 text-slate-600 border-slate-200',
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
};

const Badge = ({ color = 'gray', icon, children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${BADGE_COLORS[color]}`}>
    {icon}
    {children}
  </span>
);

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between py-3 gap-4">
    <dt className="text-sm text-gray-500 flex-shrink-0">{label}</dt>
    <dd className="flex justify-end">{children}</dd>
  </div>
);

const BookViewDrawer = ({ book, isOpen, onClose, onEdit, onDelete }) => {
  const [imgState, setImgState] = useState('normal'); // 'normal' | 'placeholder' | 'failed'

  useEffect(() => {
    if (book?.id) setImgState('normal');
  }, [book?.id]);

  if (!book) return null;

  const category   = book.tags?.find(t => t.type === 'CATEGORY');
  const etiquette  = book.tags?.find(t => t.type === 'ETIQUETTE');
  const isOutOfStock = (book.stockQuantity ?? 0) === 0;

  const finalPrice = book.onSale
    ? book.discountType === 'PERCENTAGE'
      ? book.price * (1 - book.discountValue / 100)
      : Math.max(0, book.price - book.discountValue)
    : null;

  const coverSrc = imgState === 'placeholder'
    ? getBookCoverUrl(book.id, true)
    : getBookCoverUrl(book.id);

  const handleImgError = (e) => {
    if (imgState === 'normal') {
      setImgState('placeholder');
      e.target.src = getBookCoverUrl(book.id, true);
    } else {
      setImgState('failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Dark cover header */}
            <div className="relative h-52 flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
              {/* Blurred cover as ambient background */}
              {imgState !== 'failed' && (
                <img
                  src={coverSrc}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110"
                  onError={() => {}}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white transition-all"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover thumbnail + title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
                <div className="w-[52px] h-[72px] flex-shrink-0 rounded-md overflow-hidden shadow-xl border border-white/10 bg-slate-800">
                  {imgState === 'failed' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-slate-500" />
                    </div>
                  ) : (
                    <img
                      src={coverSrc}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={handleImgError}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-0.5">
                  <h2 className="text-white font-bold text-base leading-snug line-clamp-2">{book.title}</h2>
                  <p className="text-slate-400 text-sm mt-0.5 truncate">{book.author?.name || 'Auteur inconnu'}</p>
                </div>
              </div>
            </div>

            {/* Quick-stats row */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 flex-shrink-0">
              {/* Price */}
              <div className="px-4 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Prix</p>
                {book.onSale ? (
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-bold text-orange-600 text-base">{formatCurrency(finalPrice)}</span>
                      <span className="text-gray-400 line-through text-xs">{formatCurrency(book.price)}</span>
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 mt-1">
                      <Tag className="w-2.5 h-2.5" />
                      {book.discountType === 'PERCENTAGE' ? `-${book.discountValue}%` : `-${book.discountValue} DZD`}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-800 text-base">{formatCurrency(book.price)}</span>
                )}
              </div>

              {/* Stock */}
              <div className="px-4 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Stock</p>
                <span className={`font-bold text-base ${isOutOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
                  {book.stockQuantity ?? 0}
                </span>
                <p className={`text-xs mt-0.5 ${isOutOfStock ? 'text-red-400' : 'text-emerald-500'}`}>
                  {isOutOfStock ? 'Rupture de stock' : 'Disponible'}
                </p>
              </div>
            </div>

            {/* Scrollable detail list */}
            <div className="flex-1 overflow-y-auto">
              <dl className="divide-y divide-gray-50 px-4">
                <Row label="Visibilité">
                  {book.visibleInCatalog === false ? (
                    <Badge color="gray" icon={<EyeOff className="w-3 h-3" />}>Pack uniquement</Badge>
                  ) : (
                    <Badge color="green" icon={<Eye className="w-3 h-3" />}>Catalogue</Badge>
                  )}
                </Row>

                <Row label="Langue">
                  <Badge color="blue">{LANGUAGE_DISPLAY[book.language] || book.language || '—'}</Badge>
                </Row>

                {category && (
                  <Row label="Catégorie">
                    <Badge color="violet">{category.nameFr}</Badge>
                  </Row>
                )}

                {etiquette && (
                  <Row label="Étiquette">
                    <Badge color="amber">{etiquette.nameFr}</Badge>
                  </Row>
                )}

                {book.deliveryFee !== undefined && (
                  <Row label="Livraison">
                    <span className="text-sm font-medium text-gray-700">
                      {book.automaticDeliveryFee ? 'Automatique' : formatCurrency(book.deliveryFee || 0)}
                    </span>
                  </Row>
                )}

                {book.preorderDate && (
                  <Row label="Précommande jusqu'au">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(book.preorderDate).toLocaleDateString('fr-FR')}
                    </span>
                  </Row>
                )}
              </dl>

              {book.description && (
                <div className="px-4 py-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
                    {book.description.replace(/[#*`_[\]()>]/g, '').trim()}
                  </p>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 flex gap-2.5 bg-gray-50/60">
              <button
                onClick={() => { onClose(); onEdit(book); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => { onClose(); onDelete(book); }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 hover:bg-red-50 active:bg-red-100 text-red-600 text-sm font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookViewDrawer;
