"use client";

import Image from "next/image";
import { useState } from "react";

interface UserAvatarProps {
  user: {
    image?: string | null;
    name?: string | null;
  };
}

function UserAvatar({ user }: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState(user.image ?? "/default-avatar.jpg");

  const handleError = () => {
    setImgSrc("/default-avatar.jpg");
  };

  return (
    <Image
      src={imgSrc}
      alt={user.name ?? "User avatar"}
      width={32}
      height={32}
      className="h-8 rounded-full object-cover"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

export default UserAvatar;
