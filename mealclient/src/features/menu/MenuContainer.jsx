import React from 'react';
import { useGetMenuQuery } from './menuApi';
import MenuPage from './MenuPage';

/**
 * MenuContainer
 * Smart component responsible for fetching menu data and handling business logic.
 */
const MenuContainer = () => {
  const { data: menuItems, error, isLoading } = useGetMenuQuery();

  // Any additional logic like filtering or sorting would go here
  
  return (
    <MenuPage 
      menuItems={menuItems} 
      isLoading={isLoading} 
      error={error} 
    />
  );
};

export default MenuContainer;
