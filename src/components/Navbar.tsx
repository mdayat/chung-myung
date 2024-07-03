import Image from "next/image";

import { ArrowDropDownIcon } from "./icons/ArrowDropDownIcon";
import { HelpOutlineIcon } from "./icons/HelpOutlineIcon";
import UserImage from "@images/users/user.png";
import { EmtekaLogo } from "./icons/EmtekaLogo";

export function Navbar() {
  return (
    <header className="bg-neutral-0 h-16 fixed top-0 z-50 w-full">
      <div className="flex justify-between items-center px-6 h-full w-full xl:w-[1366px] xl:mx-auto">
        <EmtekaLogo className="max-w-[105px] h-auto" />

        <ul className="flex gap-x-4 items-center">
          <li className="mt-2">
            <button type="button">
              <HelpOutlineIcon className="w-6 h-6" />
            </button>
          </li>

          <li>
            <button type="button" className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-1">
                <Image
                  src={UserImage}
                  alt="Sobat Emteka"
                  className="object-contain max-w-8 max-h-8"
                />
                <h6 className="font-semibold">Sahabat Teka</h6>
              </div>

              <ArrowDropDownIcon className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
