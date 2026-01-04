const statusConfig = {
  pending: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    label: 'En attente',
  },
  confirmed: {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    label: 'Confirmé',
  },
  shipped: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    label: 'Expédié',
  },
  delivered: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'Livré',
  },
  cancelled: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    label: 'Annulé',
  },
};

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
