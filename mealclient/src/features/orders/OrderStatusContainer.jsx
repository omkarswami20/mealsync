import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderQuery } from './ordersApi';
import useWebSocket from '../../hooks/useWebSocket';
import OrderStatusPage from './OrderStatusPage';

const statusMap = {
  'RECEIVED': 0,
  'PREPARING': 1,
  'OUT_FOR_DELIVERY': 2,
  'DELIVERED': 3
};

/**
 * OrderStatusContainer
 * Smart component responsible for fetching order data, managing WebSocket connections, 
 * and handling status mapping.
 */
const OrderStatusContainer = () => {
  const { id } = useParams();
  const { data: initialOrder, isLoading, error } = useGetOrderQuery(id);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useWebSocket({ 
    orderId: id, 
    onMessage: (message) => {
      if (message.status) {
        setCurrentStatus(message.status);
        if (message.status === 'DELIVERED') {
          setShowSuccess(true);
        }
      }
    } 
  });
  
  useEffect(() => {
    if (initialOrder?.status && !currentStatus) {
      setCurrentStatus(initialOrder.status);
      if (initialOrder.status === 'DELIVERED') {
        setShowSuccess(true);
      }
    }
  }, [initialOrder, currentStatus]);

  const activeStep = statusMap[currentStatus] ?? 0;

  return (
    <OrderStatusPage 
      order={initialOrder}
      orderId={id}
      isLoading={isLoading}
      error={error}
      currentStatus={currentStatus}
      activeStep={activeStep}
      showSuccess={showSuccess}
    />
  );
};

export default OrderStatusContainer;
