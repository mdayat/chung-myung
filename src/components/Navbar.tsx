import Image from "next/image";

import { EmtekaLogo } from "./icons/EmtekaLogo";
import { ArrowDropDownIcon } from "./icons/ArrowDropDownIcon";
import { HelpOutlineIcon } from "./icons/HelpOutlineIcon";
import AvatarImage from "@public/avatar.png";

export function Navbar() {
  return (
    <div className="bg-neutral-25 fixed top-0 z-10 w-screen h-full max-h-16 flex justify-center items-center">
      <nav className="w-full max-w-screen-desktop mx-auto px-6 desktop:px-0">
        <div className="flex justify-between items-center">
          <EmtekaLogo className="w-28" />

          <ul className="flex justify-between items-center gap-x-4">
            <li>
              <button type="button" className="block h-fit">
                <HelpOutlineIcon className="w-6 h-6" />
              </button>
            </li>

            <li>
              <button type="button" className="flex items-center gap-x-2">
                <Image
                  src={AvatarImage}
                  alt=""
                  className="object-cover object-center w-8 h-8"
                />
                <ArrowDropDownIcon className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
