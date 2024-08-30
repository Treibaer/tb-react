import { useEffect, useState } from "react";

export default function UserContextProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    // <UserContext.Provider value={{ user, loading, error }}>
      {children}
  //{/* </UserContext.Provider> */}
  );
}
