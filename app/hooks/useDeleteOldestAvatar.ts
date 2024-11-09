import { UserDetails } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useDeleteOldestAvatar = (userDetails: UserDetails) => {
  const supabaseClient = useSupabaseClient();

  const deleteOldAvatar = async () => {
    if (!userDetails || !userDetails.avatar_url) {
      return null;
    }

    const { error } = await supabaseClient.storage
      .from("images")
      .remove([userDetails.avatar_url]);

    if (error) {
      console.error("Erro ao deletar o avatar:", error.message);
      return false;
    }
    console.log("Avatar antigo deletado com sucesso.");
    return true;
  };

  return deleteOldAvatar;
};

export default useDeleteOldestAvatar;
