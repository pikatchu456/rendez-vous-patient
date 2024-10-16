import apiSlice from "../apiSlice.jsx";

const dentisteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkCode: builder.mutation({
      query: (code) => ({
        url: `/api/dentiste/code`,
        method: "POST",
        body: code,
      }),
    }),
  }),
});

export const { useCheckCodeMutation } = dentisteApiSlice;
