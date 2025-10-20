const statusConfig = {
  pending: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    label: 'Pending',
  },
  shipped: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    label: 'Shipped',
  },
  delivered: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'Delivered',
  },
  cancelled: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    label: 'Cancelled',
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
