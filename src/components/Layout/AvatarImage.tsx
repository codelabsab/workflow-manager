/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const AvatarImage = () => {
  const session = useSession();

  const image = session.data?.user?.image ? (
    <img
      className="h-full w-full items-end rounded-full"
      src={session.data.user.image}
      alt="User Avatar"
    />
  ) : (
    <FaUserCircle className="h-full w-full text-gray-300" />
  );

  return <div className="pointer-events-none h-12 w-12">{image}</div>;
};

export default AvatarImage;
