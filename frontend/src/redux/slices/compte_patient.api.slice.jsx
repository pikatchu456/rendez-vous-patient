import apiSlice from "../apiSlice";

const comptePatientSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccountPatient: builder.mutation({
      query: (data) => ({
        url: `/api/compte/patient`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAccountPatientMutation } = comptePatientSlice;
