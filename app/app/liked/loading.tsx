"use client";

import Box from "@/Components/Box";
import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <BounceLoader color="#22C55E" size={40} />
    </Box>
  );
};

export default Loading;
