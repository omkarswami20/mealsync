import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Badge, 
  IconButton, Container, Box, useScrollTrigger
} from '@mui/material';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import FoodIcon from '@mui/icons-material/Fastfood';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../features/cart/cartSlice';
import { Link } from 'react-router-dom';
import CartDrawer from '../features/cart/CartDrawer';

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const cartItemsCount = useSelector(selectCartItemsCount);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={trigger ? 4 : 0} 
        sx={{ 
          background: trigger ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease-in-out',
          borderBottom: trigger ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: trigger ? 64 : 80, transition: 'height 0.3s' }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'primary.main',
                '&:hover .logo-icon': { transform: 'rotate(-10deg) scale(1.1)' }
              }}
            >
              <FoodIcon className="logo-icon" sx={{ mr: 1, fontSize: 32, transition: 'transform 0.3s ease' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: -1.5, 
                  background: 'linear-gradient(45deg, #FF6B35 30%, #E85A24 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MealSync
              </Typography>
            </Box>

            <IconButton 
              onClick={() => setCartOpen(true)} 
              sx={{ 
                color: 'secondary.main',
                bgcolor: 'rgba(255, 107, 53, 0.05)',
                '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)' }
              }}
            >
              <Badge 
                badgeContent={cartItemsCount} 
                color="primary"
                sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}
              >
                <CartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
