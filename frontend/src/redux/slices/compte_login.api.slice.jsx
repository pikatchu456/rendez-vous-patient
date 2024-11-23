import apiSlice from "../apiSlice";

const compteLoginSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoleByUsernameOrEmail: builder.mutation({
      query: (data) => ({
        url: `/api/compte/role`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetRoleByUsernameOrEmailMutation } = compteLoginSlice;
