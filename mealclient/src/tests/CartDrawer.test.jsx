import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CartDrawer from '../features/cart/CartDrawer';
import { renderWithProviders } from './test-utils';

const mockItems = [
  { id: '1', name: 'Burger', price: 10, quantity: 2, image: '🍔' },
  { id: '2', name: 'Pizza', price: 15, quantity: 1, image: '🍕' }
];

const preloadedState = {
  cart: {
    items: mockItems,
    totalAmount: 35
  }
};

describe('CartDrawer', () => {
  it('shows correct subtotal', () => {
    renderWithProviders(<CartDrawer open={true} onClose={() => {}} />, { preloadedState });
    
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    // Subtotal and Total both show $35.00
    const totals = screen.getAllByText('$35.00');
    expect(totals.length).toBeGreaterThan(0);
  });

  it('increment/decrement updates quantity', () => {
    const { store } = renderWithProviders(<CartDrawer open={true} onClose={() => {}} />, { preloadedState });
    
    // Find increment button for Burger (the first item)
    // The buttons have icons, but we can find them by their role or hierarchy
    const incrementButtons = screen.getAllByTestId('AddIcon'); // This might not work if Icons aren't rendered with test-id
    // Let's use getByRole with a more specific selector or find by aria-label if present.
    // Looking at the code, there are no aria-labels. I'll use the button index.
    
    const buttons = screen.getAllByRole('button');
    // In each item there are 3 buttons (remove, add, delete-icon). 
    // Wait, the code says: decrement, increment, delete.
    // Burger: decrement (index 2), increment (index 3), delete (index 4) - index 0 is Close, index 1 is Browse Menu (if empty), etc.
    
    // Let's be safer and find the specific item container or text
    const burgerItem = screen.getByText('Burger').closest('li');
    const burgerButtons = burgerItem.querySelectorAll('button');
    
    // decrement is first, increment is second, delete is third (based on JSX order)
    fireEvent.click(burgerButtons[1]); // Increment
    expect(store.getState().cart.items.find(i => i.id === '1').quantity).toBe(3);

    fireEvent.click(burgerButtons[0]); // Decrement
    expect(store.getState().cart.items.find(i => i.id === '1').quantity).toBe(2);
  });

  it('remove item removes from list', () => {
    const { store } = renderWithProviders(<CartDrawer open={true} onClose={() => {}} />, { preloadedState });
    
    const burgerItem = screen.getByText('Burger').closest('li');
    const deleteButton = burgerItem.querySelectorAll('button')[2]; // Delete icon button
    
    fireEvent.click(deleteButton);
    expect(store.getState().cart.items.find(i => i.id === '1')).toBeUndefined();
    expect(screen.queryByText('Burger')).not.toBeInTheDocument();
  });
});
