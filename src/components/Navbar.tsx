import AvatarImage from "@public/avatar.png";
import Image from "next/image";
import type { PropsWithChildren } from "react";

import { ArrowDropDownIcon } from "./icons/ArrowDropDownIcon";
import { EmtekaLogo } from "./icons/EmtekaLogo";
import { HelpOutlineIcon } from "./icons/HelpOutlineIcon";
import { Typography } from "./shadcn/Typography";

interface NavbarProps extends PropsWithChildren {
  bgColor?: string;
}

function Navbar({ bgColor = "bg-neutral-25", children }: NavbarProps) {
  return (
    <div
      className={`${bgColor} fixed top-0 z-50 flex h-full max-h-16 w-screen items-center justify-center`}
    >
      <div className='mx-auto flex w-full max-w-screen-desktop items-center justify-between px-6 desktop:px-0'>
        <EmtekaLogo className='w-28' />
        <div className='flex items-center justify-between gap-x-4'>
          {children}
        </div>
      </div>
    </div>
  );
}

function HelpMenu({ withText = false }: { withText?: boolean }) {
  return (
    <button
      type='button'
      className='flex items-center justify-between gap-x-1.5'
    >
      <HelpOutlineIcon className='h-6 w-6 fill-neutral-600' />
      {withText ? (
        <Typography variant='b4' weight='bold' className='text-neutral-600'>
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
    <button type='button' className='flex items-center gap-x-2'>
      <Image
        src={AvatarImage}
        alt=''
        className='h-8 w-8 object-cover object-center'
      />

      {withUsername ? (
        <Typography variant='b3' weight='bold' className='text-neutral-700'>
          Username
        </Typography>
      ) : (
        <></>
      )}

      {withIcon ? (
        <ArrowDropDownIcon className='h-5 w-5 fill-neutral-600' />
      ) : (
        <></>
      )}
    </button>
  );
}

export { HelpMenu, Navbar, ProfileMenu };
