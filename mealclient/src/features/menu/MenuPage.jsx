import React from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Chip, Stack } from '@mui/material';
import MenuCard from './MenuCard';

/**
 * MenuPage
 * Dumb component focused on the UI layout and Hero section.
 */
const MenuPage = ({ menuItems, isLoading, error }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 4 }}>Failed to load menu. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'secondary.main', 
          color: 'white', 
          pt: 12, 
          pb: 10, 
          mb: 6,
          background: 'radial-gradient(circle at 10% 20%, rgba(255, 107, 53, 0.15) 0%, transparent 40%), linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' }, 
                  mb: 2,
                  textShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
              >
                Crave it. <br />
                <span style={{ color: '#FF6B35' }}>Sync it.</span> Eat it.
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.8, fontWeight: 400, mb: 4, maxWidth: 500 }}>
                Discover the best flavors in town, delivered fresh and fast to your doorstep.
              </Typography>
              <Stack direction="row" spacing={1}>
                {['🔥 Trending', '🥗 Healthy', '🍰 Desserts'].map((cat) => (
                  <Chip 
                    key={cat} 
                    label={cat} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      color: 'white', 
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                      px: 1,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }} 
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            Popular Dishes
          </Typography>
          <Box sx={{ width: 60, height: 4, bgcolor: 'primary.main', borderRadius: 2, mt: 1 }} />
        </Box>
        
        <Grid container spacing={5} alignItems="stretch">
          {menuItems?.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
              <MenuCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MenuPage;
