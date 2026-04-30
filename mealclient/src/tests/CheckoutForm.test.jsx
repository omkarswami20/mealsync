import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutForm from '../features/cart/CheckoutForm';
import { renderWithProviders } from './test-utils';
import * as ordersApi from '../features/orders/ordersApi';
import userEvent from '@testing-library/user-event';

// Mock the mutation hook
vi.mock('../features/orders/ordersApi', async () => {
  const actual = await vi.importActual('../features/orders/ordersApi');
  return {
    ...actual,
    useCreateOrderMutation: vi.fn(),
  };
});

const mockItems = [
  { id: '1', name: 'Burger', price: 10, quantity: 2 }
];

const preloadedState = {
  cart: {
    items: mockItems,
    totalAmount: 20
  }
};

describe('CheckoutForm', () => {
  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    ordersApi.useCreateOrderMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
    
    renderWithProviders(<CheckoutForm open={true} onClose={() => {}} onSuccess={() => {}} />, { preloadedState });

    // Click confirm without filling anything
    const submitButton = screen.getByRole('button', { name: /confirm order/i });
    // Note: In the code, the button is disabled if not dirty or invalid. 
    // So we need to type something and then clear it, or just check if it's disabled initially.
    expect(submitButton).toBeDisabled();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.type(nameInput, 'J');
    await user.clear(nameInput);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
  });

  it('shows phone error for invalid phone', async () => {
    const user = userEvent.setup();
    ordersApi.useCreateOrderMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
    
    renderWithProviders(<CheckoutForm open={true} onClose={() => {}} onSuccess={() => {}} />, { preloadedState });

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, '123');
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/phone number must be exactly 10 digits/i)).toBeInTheDocument();
    });
  });

  it('calls placeOrder with correct payload on valid submit', async () => {
    const user = userEvent.setup();
    const createOrderMock = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ orderId: 'order123' }) });
    ordersApi.useCreateOrderMutation.mockReturnValue([createOrderMock, { isLoading: false }]);
    
    const onSuccess = vi.fn();
    renderWithProviders(<CheckoutForm open={true} onClose={() => {}} onSuccess={onSuccess} />, { preloadedState });

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/delivery address/i), '123 St');
    await user.type(screen.getByLabelText(/phone number/i), '1234567890');

    const submitButton = screen.getByRole('button', { name: /confirm order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalledWith({
        name: 'John Doe',
        address: '123 St',
        phone: '1234567890',
        items: [{ id: '1', quantity: 2 }]
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
