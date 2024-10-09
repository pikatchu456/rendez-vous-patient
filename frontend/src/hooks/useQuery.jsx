import { useState, useEffect } from "react";

const useQuery = (url, skip = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const refetch = () => {
    setTrigger(!trigger);
  };

  useEffect(() => {
    if (skip === false) {
      const func = async () => {
        try {
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 4000));
          const response = await fetch(url);
          const json = await response.json();
          setData(json);
          setLoading(false);
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };
      func();
    }
  }, [trigger, skip]);

  return { loading, error, data, refetch };
};

export default useQuery;
