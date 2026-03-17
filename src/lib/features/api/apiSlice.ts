import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Reservation {
  email: string;
  firstName: string;
  lastName: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
  time: string;
  timestamp: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  tagTypes: ['Reservation'],
  endpoints: (builder) => ({
    getReservations: builder.query<Reservation[], void>({
      query: () => '/reservations',
      providesTags: ['Reservation'],
    }),
    createReservation: builder.mutation<any, any>({
      query: (data) => ({
        url: '/reservation',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reservation'],
    }),
  }),
});

export const { useGetReservationsQuery, useCreateReservationMutation } = apiSlice;
