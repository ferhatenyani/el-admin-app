import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, User, Package } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import * as booksApi from '../../services/booksApi';
import * as packsApi from '../../services/packsApi';
import CustomSelect from '../common/CustomSelect';
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

const SHIPPING_PROVIDER_OPTIONS = [
  { value: SHIPPING_PROVIDER.YALIDINE, label: 'Yalidine' },
  { value: SHIPPING_PROVIDER.ZR, label: 'ZR Express' }
];

const SHIPPING_METHOD_OPTIONS = [
  { value: SHIPPING_METHOD.HOME_DELIVERY, label: 'Livraison à domicile' },
  { value: SHIPPING_METHOD.SHIPPING_PROVIDER, label: 'Point de retrait' }
];

const ITEM_TYPE_OPTIONS = [
  { value: ORDER_ITEM_TYPE.BOOK, label: 'Livre' },
  { value: ORDER_ITEM_TYPE.PACK, label: 'Pack' }
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
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Fetch books and packs when modal opens
  useEffect(() => {
    const fetchBooksAndPacks = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const [booksResponse, packsResponse] = await Promise.all([
          booksApi.getBooks({ page: 0, size: 1000 }),
          packsApi.getPacks({ page: 0, size: 1000 })
        ]);
        setBooks(booksResponse.content || booksResponse);
        setPacks(packsResponse.content || packsResponse);
      } catch (err) {
        console.error('Error fetching books and packs:', err);
        setError('Failed to load books and packs');
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndPacks();
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
          itemId: null,
          itemType: ORDER_ITEM_TYPE.BOOK,
          quantity: 1,
          unitPrice: 0,
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

      // Auto-fill unit price when item is selected
      if (field === 'itemId' && value) {
        const currentItem = newOrderItems[index];

        if (currentItem.itemType === ORDER_ITEM_TYPE.BOOK) {
          const selectedBook = books.find((b) => b.id === parseInt(value));
          if (selectedBook) {
            newOrderItems[index].unitPrice = selectedBook.price;
          }
        } else if (currentItem.itemType === ORDER_ITEM_TYPE.PACK) {
          const selectedPack = packs.find((p) => p.id === parseInt(value));
          if (selectedPack) {
            newOrderItems[index].unitPrice = selectedPack.price;
          }
        }
      }

      // Reset itemId and price when itemType changes
      if (field === 'itemType') {
        newOrderItems[index].itemId = null;
        newOrderItems[index].unitPrice = 0;
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
    if (formData.shippingMethod === SHIPPING_METHOD.HOME_DELIVERY && !formData.streetAddress.trim()) {
      setError('L\'adresse est requise pour la livraison à domicile');
      return;
    }
    if (formData.orderItems.length === 0) {
      setError('Au moins un article est requis');
      return;
    }

    // Validate order items
    for (let i = 0; i < formData.orderItems.length; i++) {
      const item = formData.orderItems[i];

      if (!item.itemId) {
        const itemTypeName = item.itemType === ORDER_ITEM_TYPE.PACK ? 'pack' : 'livre';
        setError(`Veuillez sélectionner un ${itemTypeName} pour l'article ${i + 1}`);
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
        ...(item.itemType === ORDER_ITEM_TYPE.BOOK && { bookId: parseInt(item.itemId) }),
        ...(item.itemType === ORDER_ITEM_TYPE.PACK && { bookPackId: parseInt(item.itemId) }),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        itemType: item.itemType,
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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold truncate">Créer une nouvelle commande</h2>
                    <p className="text-blue-100 mt-1 font-medium text-sm sm:text-base">
                      Remplissez les informations de la commande
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Customer Information Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Informations client</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0555123456"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Wilaya <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={formData.wilaya}
                        onChange={(value) => setFormData((prev) => ({ ...prev, wilaya: value }))}
                        options={WILAYA_OPTIONS}
                        placeholder="Sélectionnez une wilaya"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Adresse {formData.shippingMethod === SHIPPING_METHOD.HOME_DELIVERY && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required={formData.shippingMethod === SHIPPING_METHOD.HOME_DELIVERY}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Information Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Informations de livraison</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Fournisseur de livraison
                      </label>
                      <CustomSelect
                        value={formData.shippingProvider}
                        onChange={(value) => setFormData((prev) => ({ ...prev, shippingProvider: value }))}
                        options={SHIPPING_PROVIDER_OPTIONS}
                        placeholder="Sélectionnez un fournisseur"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Méthode de livraison
                      </label>
                      <CustomSelect
                        value={formData.shippingMethod}
                        onChange={(value) => setFormData((prev) => ({ ...prev, shippingMethod: value }))}
                        options={SHIPPING_METHOD_OPTIONS}
                        placeholder="Sélectionnez une méthode"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                        Frais de livraison (DZD)
                      </label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={formData.shippingCost}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items Section */}
                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Articles de la commande</h3>
                    <button
                      type="button"
                      onClick={handleAddOrderItem}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      {loading ? 'Chargement...' : 'Ajouter un article'}
                    </button>
                  </div>

                  {formData.orderItems.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-gray-600 font-medium px-4">Aucun article ajouté</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 px-4">Cliquez sur "Ajouter un article" pour commencer</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {formData.orderItems.map((item, index) => (
                        <div key={index} className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                          <div className="flex items-start gap-2 sm:gap-4">
                            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                              {/* Item Type Selection */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                                  Type d'article <span className="text-red-500">*</span>
                                </label>
                                <CustomSelect
                                  value={item.itemType}
                                  onChange={(value) => handleOrderItemChange(index, 'itemType', value)}
                                  options={ITEM_TYPE_OPTIONS}
                                  placeholder="Sélectionnez un type"
                                />
                              </div>

                              {/* Book/Pack Selection + Quantity + Price */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Conditional Book or Pack Dropdown */}
                                <div className="md:col-span-1">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                                    {item.itemType === ORDER_ITEM_TYPE.PACK ? 'Pack' : 'Livre'} <span className="text-red-500">*</span>
                                  </label>
                                  {item.itemType === ORDER_ITEM_TYPE.BOOK ? (
                                    <CustomSelect
                                      value={item.itemId || ''}
                                      onChange={(value) => handleOrderItemChange(index, 'itemId', value)}
                                      options={[
                                        { value: '', label: 'Sélectionnez un livre' },
                                        ...books.map((book) => ({
                                          value: book.id,
                                          label: `${book.title} - ${book.price} DZD`
                                        }))
                                      ]}
                                      placeholder="Sélectionnez un livre"
                                    />
                                  ) : (
                                    <CustomSelect
                                      value={item.itemId || ''}
                                      onChange={(value) => handleOrderItemChange(index, 'itemId', value)}
                                      options={[
                                        { value: '', label: 'Sélectionnez un pack' },
                                        ...packs.map((pack) => ({
                                          value: pack.id,
                                          label: `${pack.name} - ${pack.price} DZD`
                                        }))
                                      ]}
                                      placeholder="Sélectionnez un pack"
                                    />
                                  )}
                                </div>

                                {/* Quantity */}
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                                    Quantité <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                                    min="1"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                                    required
                                  />
                                </div>

                                {/* Unit Price */}
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                                    Prix unitaire (DZD) <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleOrderItemChange(index, 'unitPrice', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveOrderItem(index)}
                              className="mt-6 sm:mt-8 p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                              title="Supprimer l'article"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">Total de l'article:</span>
                            <span className="text-base sm:text-lg font-bold text-blue-600">
                              {(item.quantity * item.unitPrice).toFixed(2)} DZD
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                {formData.orderItems.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base sm:text-lg font-bold text-gray-900">Montant total</span>
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">{calculateTotalAmount().toFixed(2)} DZD</span>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-blue-200">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Sous-total articles</span>
                        <span className="font-medium text-gray-900">{(calculateTotalAmount() - parseFloat(formData.shippingCost || 0)).toFixed(2)} DZD</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Frais de livraison</span>
                        <span className="font-medium text-gray-900">{parseFloat(formData.shippingCost || 0).toFixed(2)} DZD</span>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 sm:p-6 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || formData.orderItems.length === 0}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
