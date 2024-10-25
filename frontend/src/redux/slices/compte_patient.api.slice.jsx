import apiSlice from "../apiSlice";

const compteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (data) => ({
        url: `/api/compte/patient`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAccountMutation } = compteApiSlice;
