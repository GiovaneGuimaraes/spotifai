"use client";

import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import { UserDetails } from "@/types";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const { userDetails } = useGetUserById(user?.id);
  const avatarHeader = useLoadAvatar(userDetails as UserDetails);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    // TODO: Reset any playing songs
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
    }
  };

  return (
    <div
      className={twMerge(
        `
    h-fit
    bg-gradient-to-b
    from-emerald-800
    p-6`,
        className
      )}
    >
      <div
        className="
      w-full
      mb-4
      flex
      items-center
      justify-between"
      >
        <div
          className="
        hidden
        md:flex
        gap-x-2
        items-center"
        >
          <button
            onClick={() => router.back()}
            className="
          rounded-full
          bg-black
          flex
          items-center
          justify-center
          hover:opacity-75
          transition"
          >
            <RxCaretLeft
              className="
            text-white"
              size={35}
            />
          </button>
          <button
            onClick={() => router.forward()}
            className="
          rounded-full
          bg-black
          flex
          items-center
          justify-center
          hover:opacity-75
          transition"
          >
            <RxCaretRight
              className="
            text-white"
              size={35}
            />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="
          rounded-full
          p-2
          bg-white
          items-center
          justify-center
          hover:opacity-75
          transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            className="
          rounded-full
          p-2
          bg-white
          items-center
          justify-center
          hover:opacity-75
          transition"
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div
          className="
        flex
        justify-between
        items-center
        gap-x-4"
        >
          {user ? (
            <div
              className="
            flex
            gap-x-4
            items-center
            "
            >
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>

              {avatarHeader ? (
                <div className="h-full w-full">
                  <Image
                    onClick={() => {
                      router.push("/account");
                    }}
                    width={50}
                    height={50}
                    src={avatarHeader || ""}
                    alt="AvatarHeader"
                    className="rounded-full h-full w-full object-cover cursor-pointer"
                  />
                </div>
              ) : (
                <Button
                  onClick={() => router.push("/account")}
                  className="bg-white"
                >
                  <FaUserAlt />
                </Button>
              )}
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="
              bg-transparent
              text-neutral-300
              font-medium"
                >
                  Sign Up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="
              bg-white
              px-6
              py-2
              "
                >
                  Log In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
