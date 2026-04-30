import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MenuContainer from './features/menu/MenuContainer'
import OrderStatusContainer from './features/orders/OrderStatusContainer'
import { Box } from '@mui/material'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MenuContainer />} />
        <Route path="/order/:id" element={<OrderStatusContainer />} />
      </Routes>
    </Box>
  )
}

export default App
