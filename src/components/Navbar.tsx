import Image from "next/image";

import { DropdownDown } from "./icons/DropdownDown";
import { HelpOutline } from "./icons/HelpOutline";
import EmtekaLogoImage from "./icons/EmtekaLogo.svg";
import UserImage from "@images/users/user.png";

export function Navbar() {
  return (
    <header className="flex bg-neutral-50 h-16 justify-between items-center px-6">
      <Image
        src={EmtekaLogoImage}
        alt="Emteka Asesmen"
        className="object-contain w-28 h-auto"
      />

      <div className="flex gap-x-4 items-center">
        <button type="button">
          <HelpOutline className="w-7 h-7" />
        </button>

        <button type="button" className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <Image
              src={UserImage}
              alt="Sobat Emteka"
              className="object-contain w-10 h-10"
            />
            <h6 className="font-semibold">Sahabat Teka</h6>
          </div>

          <DropdownDown className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
