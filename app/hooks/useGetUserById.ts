import { Song, UserDetails } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetUserById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(
    undefined
  );
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchUser = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      setUserDetails(data as UserDetails);
      setIsLoading(false);
    };

    fetchUser();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      userDetails,
    }),
    [isLoading, userDetails]
  );
};

export default useGetUserById;
