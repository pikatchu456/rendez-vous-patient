import apiSlice from "../apiSlice.jsx";

const patientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkEmail: builder.mutation({
      query: (email) => ({
        url: `/api/patient/checkCode`,
        method: "POST",
        body: email,
      }),
    }),
  }),
});

export const { useCheckEmailMutation } = patientApiSlice;
