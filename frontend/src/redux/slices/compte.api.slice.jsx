import apiSlice from "../apiSlice";

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

export const { useCreateAccountMutation } = compteApiSlice;
