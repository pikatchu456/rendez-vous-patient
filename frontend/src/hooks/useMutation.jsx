import { useState } from "react";

const useMutation = (url, method) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const mutationFn = async (body = { a: 1 }) => {
    try {
      setLoading(true);
      setSuccess(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      setSuccess(true);
      setLoading(false);

      return success;
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  return {
    mutationFn,
    loading,
    error,
    success,
  };
};

export default useMutation;
