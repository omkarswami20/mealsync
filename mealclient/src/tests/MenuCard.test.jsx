import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MenuCard from '../features/menu/MenuCard';
import { renderWithProviders } from './test-utils';

const mockItem = {
  id: '1',
  name: 'Burger',
  price: 12.99,
  description: 'Juicy beef burger',
  image: '🍔',
  category: 'Main'
};

describe('MenuCard', () => {
  it('renders name, price, description, and emoji', () => {
    renderWithProviders(<MenuCard item={mockItem} />);
    
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Juicy beef burger')).toBeInTheDocument();
    expect(screen.getByText('🍔')).toBeInTheDocument();
  });

  it('"Add to Cart" dispatches correct action', () => {
    const { store } = renderWithProviders(<MenuCard item={mockItem} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0]).toMatchObject({
      id: '1',
      name: 'Burger',
      quantity: 1
    });
  });
});
