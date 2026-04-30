import { apiSlice } from '../../app/api/apiSlice';

export const menuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => '/menu',
      providesTags: ['Menu'],
      transformResponse: (response) => {
        // "Parser" logic: ensure data integrity and defaults
        return response.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          image: item.image || '🍽️',
          category: item.category || 'General'
        }));
      }
    }),
  }),
});

export const { useGetMenuQuery } = menuApi;
