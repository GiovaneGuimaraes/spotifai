"use client";

import uniqid from "uniqid";
import Input from "@/Components/Input";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadAvatar from "@/hooks/useLoadAvatar"; // Hook para carregar avatar
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import { UserDetails } from "@/types";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Button from "@/Components/Button";

const AccountContent = () => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const supabaseClient = useSupabaseClient();
  const { userDetails } = useGetUserById(user?.id);

  const { register, handleSubmit, reset, setValue, formState } =
    useForm<FieldValues>({
      defaultValues: {
        full_name: "",
        image: null,
      },
    });

  const isDirty = !!Object.keys(formState.dirtyFields).length;
  const [hoverText, setHoverText] = useState(false);
  const avatarUrl = useLoadAvatar(userDetails as UserDetails);

  console.log(avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);

  useEffect(() => {
    if (!isLoading && !user && !userDetails) {
      router.replace("/");
    }

    if (userDetails) {
      reset({
        full_name: userDetails.full_name,
        image: avatarUrl ? [avatarUrl] : null,
      });
    }
  }, [isLoading, user, router, userDetails, reset, avatarUrl]);

  console.log(formState);

  const handleAvatarChange = (event: any) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    console.log("Dados enviados:", data);

    try {
      const imageFile = data.image?.[0];

      /**
       * update if only full_name has changed
       */
      if (imageFile === avatarUrl) {
        if (user && data.full_name) {
          const { error: supabaseError } = await supabaseClient
            .from("users")
            .update({
              full_name: data.full_name,
            })
            .eq("id", user.id);

          if (supabaseError) {
            return toast.error(supabaseError.message);
          }

          router.refresh();
          toast.success("User updated!");
          reset();
          return;
        }
      } else {
        if (!imageFile || !user) {
          toast.error("Missing fields");
          return;
        }

        const uniqueId = uniqid();

        /**
         * update name and image
         */
        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from("images")
            .upload(`image-${data.full_name}-${uniqueId}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (imageError) {
          return toast.error("Failed image upload.");
        }

        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            full_name: data.full_name,
            avatar_url: imageData.path,
          })
          .eq("id", user.id);

        if (supabaseError) {
          return toast.error(supabaseError.message);
        }

        router.refresh();
        toast.success("User updated!");
        reset();
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-1 mx-10  rounded-lg grid gap-4"
    >
      <div className="flex gap-5 items-center">
        <label className="text-white text-lg font-semibold">Email:</label>
        <Input
          id="email"
          className="text-md"
          value={user?.email || ""}
          disabled
        />
      </div>
      <div className="flex gap-5 items-center">
        <label className="text-white text-lg font-semibold">Name:</label>
        <Input
          {...register("full_name")}
          name="full_name"
          className="text-md"
          defaultValue={userDetails?.full_name}
        />
      </div>
      <div className="items-center flex-col">
        <label className="text-white text-lg font-semibold">Avatar:</label>
        <div
          className="bg-white mt-4 rounded-full h-[300px] w-[300px] flex items-center justify-center cursor-pointer transition-opacity duration-300 relative hover:opacity-75"
          onMouseEnter={() => setHoverText(true)}
          onMouseLeave={() => setHoverText(false)}
        >
          {avatarUrl || avatarPreview ? (
            <Image
              fill
              src={avatarPreview || avatarUrl || ""}
              alt="Avatar"
              sizes="100%"
              className="rounded-full h-full w-full object-cover"
            />
          ) : (
            <FaUserAlt size={200} color="black" />
          )}
          {hoverText && (
            <span className="absolute text-white text-xl mt-36 font-semibold opacity-100 bg-black px-4 py-2 rounded-lg   ">
              Change avatar
            </span>
          )}
          <input
            {...register("image")}
            type="file"
            onInput={handleAvatarChange}
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <Button
          type="submit"
          disabled={!isDirty}
          className={`w-[300px] ${
            isDirty ? "opacity-100" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default AccountContent;
