import React, { useState } from 'react';
import { 
  Drawer, Box, Typography, List, ListItem, ListItemText, 
  IconButton, Divider, Button, Stack, Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import BagIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQty, decrementQty, removeItem } from './cartSlice';
import CheckoutForm from './CheckoutForm';

const CartDrawer = ({ open, onClose }) => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: '100vw', sm: 420 }, borderLeft: 'none' }
        }}
      >
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 2, mr: 2, display: 'flex' }}>
                <BagIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -1 }}>Your Cart</Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}><CloseIcon /></IconButton>
          </Box>

          {items.length === 0 ? (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2 }}>
              <Box sx={{ fontSize: '100px', mb: 2 }}>🥯</Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 800 }}>Hungry?</Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>Your cart is empty. Start adding some delicious meals!</Typography>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ borderRadius: 4, px: 4 }} 
                onClick={onClose}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflowY: 'auto', mx: -1, px: 1 }}>
                {items.map((item) => (
                  <Fade in={true} key={item.id}>
                    <ListItem sx={{ px: 0, py: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: '#f5f5f5', 
                        borderRadius: 3, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '32px',
                        mr: 2
                      }}>
                        {item.image || '🍽️'}
                      </Box>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <Typography variant="body1" color="primary" sx={{ fontWeight: 800, mt: 0.5 }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        }
                        primaryTypographyProps={{ fontWeight: 800, fontSize: '1.1rem' }}
                      />
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#f5f5f5', borderRadius: 3, p: 0.5 }}>
                        <IconButton size="small" onClick={() => dispatch(decrementQty(item.id))} sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#eee' } }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 1, fontWeight: 900 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => dispatch(incrementQty(item.id))} sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#eee' } }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <IconButton 
                        edge="end" 
                        onClick={() => dispatch(removeItem(item.id))}
                        sx={{ ml: 1, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  </Fade>
                ))}
              </List>
              
              <Box sx={{ pt: 4, mt: 2 }}>
                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 700 }}>${totalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Delivery Fee</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'success.main' }}>FREE</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>Total</Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
                      ${totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  onClick={() => setCheckoutOpen(true)}
                  sx={{ 
                    py: 2.2, 
                    borderRadius: 4, 
                    fontSize: '1.2rem', 
                    fontWeight: 900,
                    boxShadow: '0 10px 30px rgba(255,107,53,0.3)'
                  }}
                >
                  Checkout Now
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <CheckoutForm 
        open={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        onSuccess={() => {
          setCheckoutOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default CartDrawer;
