import Image from "next/image";

import { DropdownDown } from "./icons/DropdownDown";
import { HelpOutline } from "./icons/HelpOutline";
import EmtekaLogoImage from "./icons/EmtekaLogo.svg";
import UserImage from "@images/users/user.png";

export function Navbar() {
  return (
    <header className="bg-neutral-0 h-16">
      <div className="flex justify-between items-center px-6 h-full w-full xl:w-[1366px] xl:mx-auto">
        <Image
          src={EmtekaLogoImage}
          alt="Emteka Asesmen"
          className="object-contain w-28 h-auto"
        />

        <ul className="flex gap-x-4 items-center">
          <li className="mt-2">
            <button type="button">
              <HelpOutline className="w-7 h-7" />
            </button>
          </li>

          <li>
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
          </li>
        </ul>
      </div>
    </header>
  );
}
