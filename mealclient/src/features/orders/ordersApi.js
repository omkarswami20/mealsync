import { apiSlice } from '../../app/api/apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
      transformResponse: (response) => {
        // "Parser" logic: Normalize order data
        return {
          ...response,
          totalAmount: Number(response.totalAmount) || 0,
          items: (response.items || []).map(item => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 0
          }))
        };
      }
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery } = ordersApi;
