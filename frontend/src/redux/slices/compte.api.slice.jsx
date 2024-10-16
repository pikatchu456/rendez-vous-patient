import apiSlice from "../apiSlice.jsx";

const compteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (data) => ({
        url: `/api/compte/dentiste`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { compteDentisteMutation } = compteApiSlice;
