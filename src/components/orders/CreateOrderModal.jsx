import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, User, Package } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import * as booksApi from '../../services/booksApi';
import { ORDER_STATUS, SHIPPING_PROVIDER, SHIPPING_METHOD, ORDER_ITEM_TYPE } from '../../services/ordersApi';

// Wilaya options (48 wilayas of Algeria)
const WILAYA_OPTIONS = [
  { value: '', label: 'Sélectionnez une wilaya' },
  { value: 'Adrar', label: '01 - Adrar' },
  { value: 'Chlef', label: '02 - Chlef' },
  { value: 'Laghouat', label: '03 - Laghouat' },
  { value: 'Oum El Bouaghi', label: '04 - Oum El Bouaghi' },
  { value: 'Batna', label: '05 - Batna' },
  { value: 'Béjaïa', label: '06 - Béjaïa' },
  { value: 'Biskra', label: '07 - Biskra' },
  { value: 'Béchar', label: '08 - Béchar' },
  { value: 'Blida', label: '09 - Blida' },
  { value: 'Bouira', label: '10 - Bouira' },
  { value: 'Tamanrasset', label: '11 - Tamanrasset' },
  { value: 'Tébessa', label: '12 - Tébessa' },
  { value: 'Tlemcen', label: '13 - Tlemcen' },
  { value: 'Tiaret', label: '14 - Tiaret' },
  { value: 'Tizi Ouzou', label: '15 - Tizi Ouzou' },
  { value: 'Alger', label: '16 - Alger' },
  { value: 'Djelfa', label: '17 - Djelfa' },
  { value: 'Jijel', label: '18 - Jijel' },
  { value: 'Sétif', label: '19 - Sétif' },
  { value: 'Saïda', label: '20 - Saïda' },
  { value: 'Skikda', label: '21 - Skikda' },
  { value: 'Sidi Bel Abbès', label: '22 - Sidi Bel Abbès' },
  { value: 'Annaba', label: '23 - Annaba' },
  { value: 'Guelma', label: '24 - Guelma' },
  { value: 'Constantine', label: '25 - Constantine' },
  { value: 'Médéa', label: '26 - Médéa' },
  { value: 'Mostaganem', label: '27 - Mostaganem' },
  { value: "M'Sila", label: "28 - M'Sila" },
  { value: 'Mascara', label: '29 - Mascara' },
  { value: 'Ouargla', label: '30 - Ouargla' },
  { value: 'Oran', label: '31 - Oran' },
  { value: 'El Bayadh', label: '32 - El Bayadh' },
  { value: 'Illizi', label: '33 - Illizi' },
  { value: 'Bordj Bou Arreridj', label: '34 - Bordj Bou Arreridj' },
  { value: 'Boumerdès', label: '35 - Boumerdès' },
  { value: 'El Tarf', label: '36 - El Tarf' },
  { value: 'Tindouf', label: '37 - Tindouf' },
  { value: 'Tissemsilt', label: '38 - Tissemsilt' },
  { value: 'El Oued', label: '39 - El Oued' },
  { value: 'Khenchela', label: '40 - Khenchela' },
  { value: 'Souk Ahras', label: '41 - Souk Ahras' },
  { value: 'Tipaza', label: '42 - Tipaza' },
  { value: 'Mila', label: '43 - Mila' },
  { value: 'Aïn Defla', label: '44 - Aïn Defla' },
  { value: 'Naâma', label: '45 - Naâma' },
  { value: 'Aïn Témouchent', label: '46 - Aïn Témouchent' },
  { value: 'Ghardaïa', label: '47 - Ghardaïa' },
  { value: 'Relizane', label: '48 - Relizane' },
];

const CreateOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [orderType, setOrderType] = useState('guest'); // 'guest' or 'user'
  const [formData, setFormData] = useState({
    // Customer info
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    wilaya: '',
    city: '',
    postalCode: '',

    // Shipping info
    shippingProvider: SHIPPING_PROVIDER.YALIDINE,
    shippingMethod: SHIPPING_METHOD.HOME_DELIVERY,
    shippingCost: 0,

    // Order items
    orderItems: [],
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Fetch books when modal opens
  useEffect(() => {
    const fetchBooks = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const response = await booksApi.getBooks({ page: 0, size: 1000 });
        setBooks(response.content || response);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOrderType('guest');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        streetAddress: '',
        wilaya: '',
        city: '',
        postalCode: '',
        shippingProvider: SHIPPING_PROVIDER.YALIDINE,
        shippingMethod: SHIPPING_METHOD.HOME_DELIVERY,
        shippingCost: 0,
        orderItems: [],
      });
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          bookId: null,
          quantity: 1,
          unitPrice: 0,
          itemType: ORDER_ITEM_TYPE.BOOK,
        },
      ],
    }));
  };

  const handleRemoveOrderItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const handleOrderItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newOrderItems = [...prev.orderItems];
      newOrderItems[index] = { ...newOrderItems[index], [field]: value };

      // Auto-fill unit price when book is selected
      if (field === 'bookId' && value) {
        const selectedBook = books.find((b) => b.id === parseInt(value));
        if (selectedBook) {
          newOrderItems[index].unitPrice = selectedBook.price;
        }
      }

      return { ...prev, orderItems: newOrderItems };
    });
  };

  const calculateTotalAmount = () => {
    const itemsTotal = formData.orderItems.reduce(
      (sum, item) => sum + (item.unitPrice * item.quantity),
      0
    );
    return itemsTotal + parseFloat(formData.shippingCost || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Le nom complet est requis');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Le numéro de téléphone est requis');
      return;
    }
    if (!formData.wilaya) {
      setError('La wilaya est requise');
      return;
    }
    if (!formData.city.trim()) {
      setError('La ville est requise');
      return;
    }
    if (formData.orderItems.length === 0) {
      setError('Au moins un article est requis');
      return;
    }

    // Validate order items
    for (let i = 0; i < formData.orderItems.length; i++) {
      const item = formData.orderItems[i];
      if (!item.bookId) {
        setError(`Veuillez sélectionner un livre pour l'article ${i + 1}`);
        return;
      }
      if (!item.quantity || item.quantity < 1) {
        setError(`La quantité doit être au moins 1 pour l'article ${i + 1}`);
        return;
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        setError(`Le prix unitaire doit être supérieur à 0 pour l'article ${i + 1}`);
        return;
      }
    }

    // Build order data matching backend structure
    const orderData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      streetAddress: formData.streetAddress.trim() || null,
      wilaya: formData.wilaya,
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim() || null,
      shippingProvider: formData.shippingProvider,
      shippingMethod: formData.shippingMethod,
      shippingCost: parseFloat(formData.shippingCost) || 0,
      orderItems: formData.orderItems.map(item => ({
        bookId: parseInt(item.bookId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        itemType: ORDER_ITEM_TYPE.BOOK,
      })),
    };

    onSubmit(orderData);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Créer une nouvelle commande</h2>
                    <p className="text-blue-100 mt-1 font-medium">
                      Remplissez les informations de la commande
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Customer Information Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations client
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0555123456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wilaya <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {WILAYA_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Information Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informations de livraison
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fournisseur de livraison
                      </label>
                      <select
                        name="shippingProvider"
                        value={formData.shippingProvider}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={SHIPPING_PROVIDER.YALIDINE}>Yalidine</option>
                        <option value={SHIPPING_PROVIDER.ZR}>ZR Express</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Méthode de livraison
                      </label>
                      <select
                        name="shippingMethod"
                        value={formData.shippingMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={SHIPPING_METHOD.HOME_DELIVERY}>Livraison à domicile</option>
                        <option value={SHIPPING_METHOD.SHIPPING_PROVIDER}>Point de retrait</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frais de livraison (DZD)
                      </label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={formData.shippingCost}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Articles de la commande</h3>
                    <button
                      type="button"
                      onClick={handleAddOrderItem}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un article
                    </button>
                  </div>

                  {formData.orderItems.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.orderItems.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Livre
                                </label>
                                <select
                                  value={item.bookId || ''}
                                  onChange={(e) => handleOrderItemChange(index, 'bookId', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                >
                                  <option value="">Sélectionnez un livre</option>
                                  {books.map((book) => (
                                    <option key={book.id} value={book.id}>
                                      {book.title} - {book.price} DZD
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quantité
                                </label>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                                  min="1"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Prix unitaire (DZD)
                                </label>
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => handleOrderItemChange(index, 'unitPrice', e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveOrderItem(index)}
                              className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer l'article"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="mt-2 text-sm text-gray-600">
                            Total: <span className="font-bold">{(item.quantity * item.unitPrice).toFixed(2)} DZD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                {formData.orderItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Montant total</span>
                      <span className="text-blue-600">{calculateTotalAmount().toFixed(2)} DZD</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Sous-total articles</span>
                        <span>{(calculateTotalAmount() - parseFloat(formData.shippingCost || 0)).toFixed(2)} DZD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de livraison</span>
                        <span>{parseFloat(formData.shippingCost || 0).toFixed(2)} DZD</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || formData.orderItems.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création...' : 'Créer la commande'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CreateOrderModal;
