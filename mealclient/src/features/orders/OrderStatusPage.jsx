import React from 'react';
import { 
  Container, Paper, Typography, Box, Stepper, Step, 
  StepLabel, CircularProgress, Alert, Card, CardContent,
  Grow, Divider, Avatar
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Restaurant from '@mui/icons-material/Restaurant';
import ReceiptLong from '@mui/icons-material/ReceiptLong';

const steps = [
  { label: 'Order Received', icon: <ReceiptLong /> },
  { label: 'Preparing', icon: <Restaurant /> },
  { label: 'Out for Delivery', icon: <LocalShipping /> },
  { label: 'Delivered', icon: <CheckCircle /> }
];

/**
 * OrderStatusPage
 * Dumb component focused on the tracking UI and stepper visualization.
 */
const OrderStatusPage = ({ 
  order, 
  orderId, 
  isLoading, 
  error, 
  currentStatus, 
  activeStep, 
  showSuccess 
}) => {
  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
  
  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error" variant="filled">Order not found or invalid ID.</Alert>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Grow in={true} timeout={800}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
          }}
        >
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
            ORDER TRACKING
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mt: 1 }}>
            #{orderId.slice(0, 8).toUpperCase()}
          </Typography>
          
          <Box sx={{ width: '100%', my: 6 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel 
                    StepIconProps={{
                      sx: { 
                        width: 40, 
                        height: 40,
                        '&.Mui-active': { 
                          color: 'primary.main',
                          animation: 'pulse 2s infinite ease-in-out',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)' },
                            '70%': { transform: 'scale(1.1)', boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
                            '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
                          }
                        },
                        '&.Mui-completed': { color: 'success.main' }
                      }
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {showSuccess && (
            <Grow in={showSuccess} timeout={1000}>
              <Box 
                sx={{ 
                  mb: 4, 
                  p: 3, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, position: 'relative', zIndex: 1 }}>
                  🎉 Your meal has arrived!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
                  Hope you enjoy your delicious food.
                </Typography>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -10, left: -10, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              </Box>
            </Grow>
          )}

          <Divider sx={{ my: 4 }} />

          {order && (
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Delivery Details</Typography>
              <Card variant="outlined" sx={{ mb: 4, borderRadius: 2, bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Recipient</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>{order.name}</Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{order.address}</Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Order Summary</Typography>
              <Box sx={{ px: 1 }}>
                {order.items.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
                        {item.quantity}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                    ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Grow>
    </Container>
  );
};

export default OrderStatusPage;
