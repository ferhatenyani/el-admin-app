import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Pencil, Save, Loader2, RotateCcw } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import useScrollLock from '../../hooks/useScrollLock';
import CustomSelect from './CustomSelect';
import { getStopDeskById } from '../../services/relayPointsApi';
import RelayPointSelect from '../orders/RelayPointSelect';
import wilayaData from '../../utils/wilayaData';
import { SHIPPING_PROVIDER, SHIPPING_METHOD, calculateDeliveryFee } from '../../services/ordersApi';

// Status configuration
const statusConfig = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    label: 'En attente',
  },
  confirmed: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-400',
    label: 'Confirmé',
  },
  shipped: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    label: 'Expédié',
  },
  delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    label: 'Livré',
  },
  cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    label: 'Annulé',
  },
};

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

const WILAYA_OPTIONS = [
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
  { value: 'Bordj Bou Arréridj', label: '34 - Bordj Bou Arréridj' },
  { value: 'Boumerdès', label: '35 - Boumerdès' },
  { value: 'El Tarf', label: '36 - El Tarf' },
  { value: 'Tindouf', label: '37 - Tindouf' },
  { value: 'Tissemsilt', label: '38 - Tissemsilt' },
  { value: 'El Oued', label: '39 - El Oued' },
  { value: 'Khenchela', label: '40 - Khenchela' },
  { value: 'Souk Ahras', label: '41 - Souk Ahras' },
  { value: 'Tipaza', label: '42 - Tipaza' },
  { value: 'Mila', label: '43 - Mila' },
  { value: 'Ain Defla', label: '44 - Ain Defla' },
  { value: 'Naâma', label: '45 - Naâma' },
  { value: 'Ain Témouchent', label: '46 - Ain Témouchent' },
  { value: 'Ghardaïa', label: '47 - Ghardaïa' },
  { value: 'Relizane', label: '48 - Relizane' },
  { value: 'Timimoun', label: '49 - Timimoun' },
  { value: 'Bordj Badji Mokhtar', label: '50 - Bordj Badji Mokhtar' },
  { value: 'Ouled Djellal', label: '51 - Ouled Djellal' },
  { value: 'Béni Abbès', label: '52 - Béni Abbès' },
  { value: 'In Salah', label: '53 - In Salah' },
  { value: 'In Guezzam', label: '54 - In Guezzam' },
  { value: 'Touggourt', label: '55 - Touggourt' },
  { value: 'Djanet', label: '56 - Djanet' },
  { value: "El M'Ghair", label: "57 - El M'Ghair" },
  { value: 'El Meniaa', label: '58 - El Meniaa' },
  { value: 'Aflou', label: '59 - Aflou' },
  { value: 'Barika', label: '60 - Barika' },
  { value: 'Ksar Chellala', label: '61 - Ksar Chellala' },
  { value: 'Messaad', label: '62 - Messaad' },
  { value: 'Aïn Oussera', label: '63 - Aïn Oussera' },
  { value: 'Bou Saâda', label: '64 - Bou Saâda' },
  { value: 'El Abiodh Sidi Cheikh', label: '65 - El Abiodh Sidi Cheikh' },
  { value: 'El Kantara', label: '66 - El Kantara' },
  { value: 'Bir El Ater', label: '67 - Bir El Ater' },
  { value: 'Ksar El Boukhari', label: '68 - Ksar El Boukhari' },
  { value: 'El Aricha', label: '69 - El Aricha' },
];

const SHIPPING_PROVIDER_OPTIONS = [
  { value: SHIPPING_PROVIDER.YALIDINE, label: 'Yalidine' },
  { value: SHIPPING_PROVIDER.ZR, label: 'ZR Express' },
];

const SHIPPING_METHOD_OPTIONS = [
  { value: SHIPPING_METHOD.HOME_DELIVERY, label: 'Livraison à domicile' },
  { value: SHIPPING_METHOD.SHIPPING_PROVIDER, label: 'Point de retrait' },
];

// Shared input styling
const inputClass = 'w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 placeholder:text-gray-400';

// Display field row — view mode
const ViewRow = ({ label, value, valueClass = 'font-semibold text-gray-900' }) => (
  <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-4">
    <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
    <span className={`text-sm break-words xs:text-right ${valueClass}`}>{value || 'N/A'}</span>
  </div>
);

// Editable field row — edit mode
const EditRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
    <span className="text-sm text-gray-500 flex-shrink-0 sm:w-40">{label}</span>
    <div className="flex-1">{children}</div>
  </div>
);

const OrderDetailsModal = ({ isOpen, onClose, order, onSaveOrder }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [stopDesk, setStopDesk] = useState(null);
  const [loadingStopDesk, setLoadingStopDesk] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [shippingFeeError, setShippingFeeError] = useState('');

  useScrollLock(isOpen);

  // Initialize form from order
  const initForm = useCallback((order) => {
    if (!order) return;
    setForm({
      fullName: order.customer || order.fullName || '',
      phone: order.phone || '',
      email: order.customerEmail || order.email || '',
      wilaya: order.wilaya || '',
      city: order.city || '',
      streetAddress: order.streetAddress || '',
      shippingMethod: order.shippingMethod || SHIPPING_METHOD.HOME_DELIVERY,
      shippingProvider: order.shippingProvider || SHIPPING_PROVIDER.YALIDINE,
      shippingCost: order.shippingCost ?? 0,
      status: order.status || 'pending',
      stopDeskId: order.stopDeskId || null,
    });
    if (order.wilaya) {
      setAvailableCities(wilayaData[order.wilaya] || []);
    }
  }, []);

  useEffect(() => {
    if (isOpen && order) {
      initForm(order);
      setEditing(false);
    }
  }, [isOpen, order, initForm]);

  // Fetch stop desk details
  useEffect(() => {
    const fetchStopDesk = async () => {
      if (!order?.stopDeskId) {
        setStopDesk(null);
        return;
      }
      if (order.stopDesk) {
        setStopDesk(order.stopDesk);
        return;
      }
      setLoadingStopDesk(true);
      try {
        const data = await getStopDeskById(order.stopDeskId);
        setStopDesk(data);
      } catch (err) {
        console.error('Error fetching stop desk:', err);
        setStopDesk(null);
      } finally {
        setLoadingStopDesk(false);
      }
    };
    if (isOpen) fetchStopDesk();
  }, [isOpen, order?.stopDeskId, order?.stopDesk]);

  // Update cities when wilaya changes in edit mode
  useEffect(() => {
    if (editing && form.wilaya) {
      const cities = wilayaData[form.wilaya] || [];
      setAvailableCities(cities);
      // Reset city if not in the new wilaya
      if (cities.length > 0 && !cities.includes(form.city)) {
        setForm(prev => ({ ...prev, city: '' }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, form.wilaya]);

  if (!order) return null;

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    initForm(order);
    setEditing(false);
    setShippingFeeError('');
  };

  const handleSave = async () => {
    if (!onSaveOrder) return;
    setSaving(true);
    try {
      await onSaveOrder(order.id, form);
      setEditing(false);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculateShipping = async () => {
    const items = (order.items || order.orderItems || []).map(item => ({
      bookId: item.bookId || null,
      bookPackId: item.bookPackId || null,
      quantity: item.quantity,
      itemType: item.itemType,
    }));

    if (!form.wilaya || items.length === 0) return;

    setShippingFeeError('');
    try {
      const result = await calculateDeliveryFee({
        shippingProvider: form.shippingProvider,
        wilaya: form.wilaya,
        city: form.city || undefined,
        isStopDesk: form.shippingMethod === SHIPPING_METHOD.SHIPPING_PROVIDER,
        items,
      });
      if (result.success) {
        updateField('shippingCost', result.fee);
      } else {
        setShippingFeeError(result.errorMessage || 'Erreur de calcul');
      }
    } catch (calcErr) {
      console.error('Shipping fee calculation error:', calcErr);
      setShippingFeeError('Erreur de calcul des frais');
    }
  };

  // Determine if form has changes
  const hasChanges = () => {
    const original = {
      fullName: order.customer || order.fullName || '',
      phone: order.phone || '',
      email: order.customerEmail || order.email || '',
      wilaya: order.wilaya || '',
      city: order.city || '',
      streetAddress: order.streetAddress || '',
      shippingMethod: order.shippingMethod || SHIPPING_METHOD.HOME_DELIVERY,
      shippingProvider: order.shippingProvider || SHIPPING_PROVIDER.YALIDINE,
      shippingCost: order.shippingCost ?? 0,
      status: order.status || 'pending',
      stopDeskId: order.stopDeskId || null,
    };
    return Object.keys(original).some(key => String(form[key] ?? '') !== String(original[key] ?? ''));
  };

  const isPointDeRetrait = form.shippingMethod === SHIPPING_METHOD.SHIPPING_PROVIDER;

  const cityOptions = availableCities.map(c => ({ value: c, label: c }));

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90svh] flex flex-col pointer-events-auto overflow-hidden">

              {/* ─── Header ─── */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                      {editing ? 'Modifier la commande' : 'Détails de la commande'}
                    </h2>
                    <p className="text-blue-100 mt-0.5 text-sm font-medium truncate">{order.orderNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onSaveOrder && !editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── Scrollable Content ─── */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8">

                {/* Two-column grid for customer + shipping on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">

                  {/* ── Customer Info ── */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Informations client</h3>
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-3">
                      {editing ? (
                        <>
                          <EditRow label="Nom complet">
                            <input
                              type="text"
                              value={form.fullName}
                              onChange={e => updateField('fullName', e.target.value)}
                              className={inputClass}
                              placeholder="Nom complet"
                            />
                          </EditRow>
                          <EditRow label="Téléphone">
                            <input
                              type="text"
                              value={form.phone}
                              onChange={e => updateField('phone', e.target.value)}
                              className={inputClass}
                              placeholder="0XXXXXXXXX"
                            />
                          </EditRow>
                          <EditRow label="Email">
                            <input
                              type="email"
                              value={form.email}
                              onChange={e => updateField('email', e.target.value)}
                              className={inputClass}
                              placeholder="email@example.com"
                            />
                          </EditRow>
                        </>
                      ) : (
                        <>
                          <ViewRow label="Nom complet" value={order.customer || order.fullName} valueClass="font-bold text-gray-900" />
                          <div className="border-t border-gray-200" />
                          <ViewRow label="Téléphone" value={order.phone} />
                          <div className="border-t border-gray-200" />
                          <ViewRow label="Email" value={order.customerEmail || order.email} valueClass="font-semibold text-blue-600" />
                        </>
                      )}
                      <div className="border-t border-gray-200" />
                      <ViewRow label="Date de commande" value={formatDateTime(order.date || order.createdAt)} valueClass="font-bold text-gray-900" />
                      {order.user && (
                        <>
                          <div className="border-t border-gray-200" />
                          <ViewRow label="Compte utilisateur" value={order.user.login} valueClass="font-semibold text-indigo-600" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Shipping & Address ── */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Livraison et adresse</h3>
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 space-y-3">
                      {editing ? (
                        <>
                          <EditRow label="Wilaya">
                            <CustomSelect
                              value={form.wilaya}
                              onChange={val => updateField('wilaya', val)}
                              options={WILAYA_OPTIONS}
                              placeholder="Sélectionner une wilaya"
                            />
                          </EditRow>
                          <EditRow label="Ville">
                            <CustomSelect
                              value={form.city}
                              onChange={val => updateField('city', val)}
                              options={cityOptions}
                              placeholder={form.wilaya ? 'Sélectionner une ville' : 'Sélectionner une wilaya d\'abord'}
                              disabled={!form.wilaya}
                            />
                          </EditRow>
                          <EditRow label="Méthode">
                            <CustomSelect
                              value={form.shippingMethod}
                              onChange={val => updateField('shippingMethod', val)}
                              options={SHIPPING_METHOD_OPTIONS}
                              placeholder="Méthode de livraison"
                            />
                          </EditRow>
                          <EditRow label="Fournisseur">
                            <CustomSelect
                              value={form.shippingProvider}
                              onChange={val => updateField('shippingProvider', val)}
                              options={SHIPPING_PROVIDER_OPTIONS}
                              placeholder="Fournisseur"
                            />
                          </EditRow>
                          {!isPointDeRetrait && (
                            <EditRow label="Adresse">
                              <input
                                type="text"
                                value={form.streetAddress}
                                onChange={e => updateField('streetAddress', e.target.value)}
                                className={inputClass}
                                placeholder="Adresse de livraison"
                              />
                            </EditRow>
                          )}
                          {isPointDeRetrait && (
                            <EditRow label="Point de retrait">
                              <RelayPointSelect
                                value={form.stopDeskId}
                                onChange={val => updateField('stopDeskId', val)}
                                provider={form.shippingProvider}
                                wilaya={form.wilaya}
                                disabled={!form.wilaya || !form.shippingProvider}
                              />
                            </EditRow>
                          )}
                          <EditRow label="Frais de livraison">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={form.shippingCost}
                                onChange={e => updateField('shippingCost', parseFloat(e.target.value) || 0)}
                                className={`${inputClass} flex-1`}
                                placeholder="0"
                              />
                              <button
                                type="button"
                                onClick={handleRecalculateShipping}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                title="Recalculer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Recalculer</span>
                              </button>
                            </div>
                            {shippingFeeError && (
                              <p className="text-xs text-red-500 mt-1">{shippingFeeError}</p>
                            )}
                          </EditRow>
                        </>
                      ) : (
                        <>
                          <ViewRow label="Wilaya" value={order.wilaya} valueClass="font-bold text-gray-900" />
                          <div className="border-t border-gray-200" />
                          <ViewRow label="Ville" value={order.city} valueClass="font-bold text-gray-900" />
                          {order.streetAddress && (
                            <>
                              <div className="border-t border-gray-200" />
                              <ViewRow label="Adresse" value={order.streetAddress} />
                            </>
                          )}
                          <div className="border-t border-gray-200" />
                          <ViewRow
                            label="Méthode de livraison"
                            value={order.shippingMethod === 'SHIPPING_PROVIDER' ? 'Point de retrait' : 'Livraison à domicile'}
                            valueClass="font-bold text-gray-900"
                          />
                          {order.shippingProvider && (
                            <>
                              <div className="border-t border-gray-200" />
                              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-4">
                                <span className="text-sm text-gray-500 flex-shrink-0">Fournisseur</span>
                                <span className="px-3 py-0.5 text-xs font-bold text-purple-700 bg-purple-100 rounded-full whitespace-nowrap self-start xs:self-auto">
                                  {order.shippingProvider}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="border-t border-gray-200" />
                          <ViewRow label="Frais de livraison" value={formatCurrency(order.shippingCost || 0)} valueClass="font-bold text-green-600" />

                          {/* Stop desk in view mode */}
                          {(order.isStopDesk || order.shippingMethod === 'SHIPPING_PROVIDER') && (order.stopDeskId || stopDesk) && (
                            <>
                              <div className="border-t border-gray-200" />
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span className="text-sm text-gray-500 font-medium">Point de retrait</span>
                                </div>
                                {loadingStopDesk ? (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-pulse">
                                    <div className="h-4 bg-blue-200 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-blue-200 rounded w-full mb-1" />
                                    <div className="h-3 bg-blue-200 rounded w-1/2" />
                                  </div>
                                ) : stopDesk ? (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="text-sm font-bold text-blue-900">{stopDesk.name}</div>
                                    <div className="text-xs text-blue-700 mt-1">{stopDesk.address}</div>
                                    <div className="text-xs text-blue-600 mt-0.5">{stopDesk.commune}, {stopDesk.wilaya}</div>
                                    {stopDesk.phone && <div className="text-xs text-blue-600 mt-1">Tel: {stopDesk.phone}</div>}
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <span className="text-sm text-gray-500">Point de retrait: {order.stopDeskId}</span>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Order Items (always read-only) ── */}
                <div className="mt-5 lg:mt-6">
                  <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Articles commandés</h3>

                  {/* Desktop table */}
                  <div className="hidden sm:block border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 lg:px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Article</th>
                            <th className="px-4 lg:px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-4 lg:px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Auteur</th>
                            <th className="px-4 lg:px-5 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Qté</th>
                            <th className="px-4 lg:px-5 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Prix unit.</th>
                            <th className="px-4 lg:px-5 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {(order.items || order.orderItems)?.length > 0 ? (
                            (order.items || order.orderItems).map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 lg:px-5 py-3.5 text-sm font-medium text-gray-900">
                                  {item.title || item.bookTitle || item.bookPackTitle || 'N/A'}
                                </td>
                                <td className="px-4 lg:px-5 py-3.5">
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                    item.itemType === 'BOOK' ? 'text-blue-700 bg-blue-100' : 'text-purple-700 bg-purple-100'
                                  }`}>
                                    {item.itemType === 'BOOK' ? 'Livre' : 'Pack'}
                                  </span>
                                </td>
                                <td className="px-4 lg:px-5 py-3.5 text-sm text-gray-600">
                                  {item.author || item.bookAuthor || 'N/A'}
                                </td>
                                <td className="px-4 lg:px-5 py-3.5 text-sm text-gray-700 text-right font-semibold">{item.quantity}</td>
                                <td className="px-4 lg:px-5 py-3.5 text-sm text-gray-600 text-right">{formatCurrency(item.price || item.unitPrice)}</td>
                                <td className="px-4 lg:px-5 py-3.5 text-sm font-bold text-gray-900 text-right">
                                  {formatCurrency(item.totalPrice || (item.price * item.quantity) || (item.unitPrice * item.quantity))}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-5 py-8 text-center text-sm text-gray-400">Aucun article disponible</td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-blue-50/80 to-purple-50/80">
                          <tr>
                            <td colSpan="5" className="px-4 lg:px-5 py-2.5 text-sm font-semibold text-gray-600 text-right">Sous-total</td>
                            <td className="px-4 lg:px-5 py-2.5 text-sm font-bold text-gray-900 text-right">
                              {formatCurrency((order.total || order.totalAmount || 0) - (editing ? form.shippingCost : (order.shippingCost || 0)))}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="5" className="px-4 lg:px-5 py-2.5 text-sm font-semibold text-gray-600 text-right">Frais de livraison</td>
                            <td className="px-4 lg:px-5 py-2.5 text-sm font-bold text-green-600 text-right">
                              {formatCurrency(editing ? form.shippingCost : (order.shippingCost || 0))}
                            </td>
                          </tr>
                          <tr className="border-t-2 border-gray-200">
                            <td colSpan="5" className="px-4 lg:px-5 py-3 text-base font-bold text-gray-900 text-right">Montant total</td>
                            <td className="px-4 lg:px-5 py-3 text-base font-extrabold text-blue-600 text-right">
                              {formatCurrency(
                                editing
                                  ? ((order.total || order.totalAmount || 0) - (order.shippingCost || 0)) + form.shippingCost
                                  : (order.total || order.totalAmount || 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-3">
                    {(order.items || order.orderItems)?.length > 0 ? (
                      (order.items || order.orderItems).map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-gray-900 flex-1 break-words">
                              {item.title || item.bookTitle || item.bookPackTitle || 'N/A'}
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0 ${
                              item.itemType === 'BOOK' ? 'text-blue-700 bg-blue-100' : 'text-purple-700 bg-purple-100'
                            }`}>
                              {item.itemType === 'BOOK' ? 'Livre' : 'Pack'}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-600">
                            <span className="font-medium">Auteur:</span> {item.author || item.bookAuthor || 'N/A'}
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Qté</div>
                              <div className="text-xs font-semibold text-gray-900">{item.quantity}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Prix unit.</div>
                              <div className="text-xs font-medium text-gray-700">{formatCurrency(item.price || item.unitPrice)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Total</div>
                              <div className="text-xs font-bold text-gray-900">
                                {formatCurrency(item.totalPrice || (item.price * item.quantity) || (item.unitPrice * item.quantity))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-xs text-gray-500">
                        Aucun article disponible
                      </div>
                    )}
                    {/* Mobile totals */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">Sous-total</span>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency((order.total || order.totalAmount || 0) - (editing ? form.shippingCost : (order.shippingCost || 0)))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">Frais de livraison</span>
                        <span className="text-xs font-bold text-green-600">
                          {formatCurrency(editing ? form.shippingCost : (order.shippingCost || 0))}
                        </span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">Montant total</span>
                        <span className="text-sm font-extrabold text-blue-600">
                          {formatCurrency(
                            editing
                              ? ((order.total || order.totalAmount || 0) - (order.shippingCost || 0)) + form.shippingCost
                              : (order.total || order.totalAmount || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Status ── */}
                <div className="mt-5 lg:mt-6">
                  <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Statut de la commande</h3>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                    {editing ? (
                      <EditRow label="Statut">
                        <CustomSelect
                          value={form.status}
                          onChange={val => updateField('status', val)}
                          options={statusOptions}
                          placeholder="Sélectionner un statut"
                        />
                      </EditRow>
                    ) : (
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                        <span className="text-sm text-gray-500 font-medium flex-shrink-0">Statut actuel</span>
                        <div className={`
                          inline-flex items-center gap-2
                          px-4 py-2
                          ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text}
                          border ${statusConfig[order.status]?.border}
                          rounded-full self-start xs:self-auto
                        `}>
                          <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[order.status]?.dot} animate-pulse flex-shrink-0`} />
                          <span className="text-sm font-bold capitalize whitespace-nowrap">
                            {statusConfig[order.status]?.label || order.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── Footer ─── */}
              <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 rounded-b-2xl">
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-end">
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="w-full xs:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges()}
                        className={`
                          w-full xs:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                          ${saving || !hasChanges()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                          }
                        `}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Enregistrer
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className="w-full xs:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      Fermer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default OrderDetailsModal;
