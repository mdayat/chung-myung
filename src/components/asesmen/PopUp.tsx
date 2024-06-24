import Image from "next/image";
import React from "react";
import Close from "../../../public/close.svg";

interface PopupProps {
  show: boolean;
  onClose: () => void;
  path: string;
}

const PopUp: React.FC<PopupProps> = ({ show, onClose, path }) => {
  if (!show) return null;
  return (
    <div className="bg-[#0C101C]/[.4] inset-0 fixed flex flex-col justify-center items-center z-50">
      <div>
        <button
          type="button"
          className="border-[white] border-2 rounded-full p-2 mb-6"
          onClick={onClose}
        >
          <Image
            src={Close}
            color="#fff"
            alt="Close Icon"
            className=""
            width={24}
            height={24}
          />
          {""}
        </button>
      </div>
      <div className="bg-[#EDEFF3] rounded-lg shadow-lg relative w-[770px] h-[538px] flex justify-center">
        <Image src={path} alt="Popup Image" width={538} height={538} />
      </div>
    </div>
  );
};

export default PopUp;
