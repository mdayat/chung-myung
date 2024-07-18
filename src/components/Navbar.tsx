import Image from "next/image";
import type { PropsWithChildren } from "react";

import { Typography } from "./shadcn/Typography";
import { EmtekaLogo } from "./icons/EmtekaLogo";
import { ArrowDropDownIcon } from "./icons/ArrowDropDownIcon";
import { HelpOutlineIcon } from "./icons/HelpOutlineIcon";
import AvatarImage from "@public/avatar.png";

interface NavbarProps extends PropsWithChildren {
  bgColor?: string;
}

function Navbar({ bgColor = "bg-neutral-25", children }: NavbarProps) {
  return (
    <div
      className={`${bgColor} fixed top-0 z-50 w-screen h-full max-h-16 flex justify-center items-center`}
    >
      <div className="flex justify-between items-center w-full max-w-screen-desktop mx-auto px-6 desktop:px-0">
        <EmtekaLogo className="w-28" />
        <div className="flex justify-between items-center gap-x-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function HelpMenu({ withText = false }: { withText?: boolean }) {
  return (
    <button
      type="button"
      className="flex justify-between items-center gap-x-1.5"
    >
      <HelpOutlineIcon className="fill-neutral-600 w-6 h-6" />
      {withText ? (
        <Typography variant="b4" weight="bold" className="text-neutral-600">
          Pusat bantuan
        </Typography>
      ) : (
        <></>
      )}
    </button>
  );
}

interface ProfileMenuProps {
  withUsername?: boolean;
  withIcon?: boolean;
}

function ProfileMenu({
  withUsername = false,
  withIcon = false,
}: ProfileMenuProps) {
  return (
    <button type="button" className="flex items-center gap-x-2">
      <Image
        src={AvatarImage}
        alt=""
        className="object-cover object-center w-8 h-8"
      />

      {withUsername ? (
        <Typography variant="b3" weight="bold" className="text-neutral-700">
          Username
        </Typography>
      ) : (
        <></>
      )}

      {withIcon ? (
        <ArrowDropDownIcon className="fill-neutral-600 w-5 h-5" />
      ) : (
        <></>
      )}
    </button>
  );
}

export { Navbar, HelpMenu, ProfileMenu };
