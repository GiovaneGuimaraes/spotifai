import { UserDetails } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadAvatar = (userDetails: UserDetails) => {
  const supabaseClient = useSupabaseClient();

  if (!userDetails) {
    return null;
  }

  if (!userDetails.avatar_url) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from("images")
    .getPublicUrl(userDetails.avatar_url);

  return imageData.publicUrl;
};

export default useLoadAvatar;
