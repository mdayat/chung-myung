import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { CloseIcon } from "@components/icons/CloseIcon";

interface PopupProps {
  show: boolean;
  onClose: () => void;
  path: string;
}

const PopUp: React.FC<PopupProps> = ({ show, onClose, path }) => {
  function useOutsideAlerter(ref: React.RefObject<HTMLElement>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  if (!show) return null;
  return (
    <div className="bg-[#0C101C]/[.4] inset-0 fixed flex flex-col justify-center items-center z-50 cursor-pointer">
      <div>
        <button
          type="button"
          className="border-[white] border-2 rounded-full p-2 mb-6"
          onClick={onClose}
        >
          <CloseIcon className="fill-neutral-50 w-6 h-6" />
        </button>
      </div>
      <div
        className="bg-[#EDEFF3] rounded-lg shadow-lg relative w-[770px] h-[538px] flex justify-center"
        ref={wrapperRef}
      >
        <Image src={path} alt="Popup Image" width={538} height={538} />
      </div>
    </div>
  );
};

export default PopUp;
