import React from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton, useTheme, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, incrementQty, decrementQty } from '../cart/cartSlice';

const MenuCard = ({ item }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.items.find((i) => i.id === item.id));

  return (
    <Card sx={{ 
      width: '100%',
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      pt: 5, 
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      '&:hover': {
        transform: 'translateY(-12px)',
        boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.08)',
        '& .item-image': {
          transform: 'scale(1.15) rotate(5deg)',
        }
      }
    }}>
      {/* Floating Asset */}
      <Box sx={{ 
        position: 'absolute',
        top: -30,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 120,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        zIndex: 2,
        fontSize: '65px',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)',
          zIndex: -1
        }
      }}>
        <Box className="item-image" sx={{ transition: 'transform 0.4s ease' }}>
          {item.image || '🍽️'}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 8, pb: 0, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="overline" 
          sx={{ 
            fontWeight: 800, 
            color: 'primary.main', 
            letterSpacing: 1.5,
            opacity: 0.8,
            mb: 0.5,
            display: 'block'
          }}
        >
          {item.category}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'secondary.main', lineHeight: 1.2 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '60px',
          px: 1,
          flexGrow: 1
        }}>
          {item.description}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 900, mb: 2 }}>
          ${item.price.toFixed(2)}
        </Typography>
      </CardContent>

      <Box sx={{ p: 3, pt: 1 }}>
        {!cartItem ? (
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => dispatch(addItem(item))}
            startIcon={<CartIcon />}
            sx={{ 
              py: 1.5,
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(255,107,53,0.2)'
            }}
          >
            Add to Cart
          </Button>
        ) : (
          <Zoom in={true}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              bgcolor: 'secondary.main', 
              color: 'white',
              borderRadius: 3, 
              p: 0.7 
            }}>
              <IconButton 
                size="small" 
                onClick={() => dispatch(decrementQty(item.id))}
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{cartItem.quantity}</Typography>
              <IconButton 
                size="small" 
                onClick={() => dispatch(incrementQty(item.id))}
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Zoom>
        )}
      </Box>
    </Card>
  );
};

export default MenuCard;
