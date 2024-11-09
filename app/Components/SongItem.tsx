"use client";

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import PlayButton from "./PlayButton";
import LikeButton from "./LikeButton";

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);

  return (
    <div
      className="
  relative
  group
  flex
  flex-col
  items-center
  justify-center
  rounded-md
  overflow-hidden
  gap-x-4
  bg-neutral-400/5
  hover:bg-neutral-400/10
  transition
  p-3"
    >
      <div
        className="
        relative
        aspect-square
        w-full
        h-full
        rounded-md
        overflow-hidden"
      >
        <Image
          className="object-cover"
          src={imagePath || "/image/liked.png"}
          fill
          alt="Image"
        />
      </div>

      <div
        className="
      flex
      flex-col
      items-start
      w-full
      pt-4
      gap-y-1"
      >
        <p className="font-semibold truncate w-full">{data.title}</p>
        <p
          className="
        text-neutral-400
        text-sm
        pb-4
        w-full
        truncate"
        >
          By {data.author}
        </p>
      </div>

      <div
        className="
        transition
        opacity-0
        rounded-full
        flex
        items-center
        absolute
        bottom-24
        left-5
        drop-shadow-md
        translate
        translate-y-1/4
        group-hover:opacity-100
        group-hover:translate-y-0
        hover:scale-100"
      >
        <LikeButton songId={data.id} />
      </div>
      <div
        onClick={() => onClick(data.id)}
        className="
      absolute
      bottom-24
      right-5"
      >
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
