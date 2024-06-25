import { Typography } from "@components/shadcn/Typography";
import { Progress } from "@components/shadcn/Progress";
import Image from "next/image";
import ContentTitle from "./ContentTitle";
import { Button } from "@components/shadcn/Button";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AKBSample } from "../../data/AKBSample";

export default function RestArea({
  dataJson,
  dataPage,
  setDataPage,
}: {
  dataJson: AKBSample[];
  dataPage: number;
  setDataPage: Dispatch<SetStateAction<number>>;
}) {
  const [timer, setTimer] = useState<number | null>(null);
  useEffect(() => {
    setTimer(30);
  }, []);
  useEffect(() => {
    if (timer === null) return;
    if (timer === 0) {
      console.log("Time's up");
      if (dataPage === dataJson.length) return;
      setTimer(null);
      setDataPage((prev) => prev + 1);
      return;
    }
    const interval = setInterval(() => {
      console.log(timer);
      setTimer((prev) => prev! - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, dataJson.length, dataPage, setDataPage]);
  return (
    <div className="flex flex-col gap-6 w-2/4 rounded-3xl border border-neutral-300 p-8">
      {/* Info */}
      <div className="flex flex-row items-center justify-center gap-6 bg-primary-400 px-6 py-2 rounded-2xl">
        <span className="flex items-center justify-center bg-neutral-0 rounded-full w-12 h-12 ">
          <Typography variant="h6" weight="bold" className="text-neutral-950">
            {dataPage}/{dataJson.length}
          </Typography>
        </span>
        <Typography variant="h6" weight="bold" className="text-neutral-0">
          Subtes selesai dikerjakan
        </Typography>
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <Image
          alt="Restarea Illustration"
          src="/restarea-illustration.png"
          width={138}
          height={110}
        />
        <Typography variant="h5" weight="bold" className="text-neutral-950">
          Saatnya Beristirahat!
        </Typography>
        <Typography variant="p3" className="text-neutral-500">
          Kamu telah bekerja keras! <br /> Mari luangkan waktu sejenak untuk
          beristirahat agar pikiranmu lebih segar. ✨
        </Typography>
        <hr className="border border-neutral-300 w-full" />
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <Typography variant="p3" weight="bold" className="text-neutral-950">
          Otomatis ke subtes selanjutnya dalam
        </Typography>
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          {/* Counter */}
          <span className="flex items-end gap-1">
            <Typography variant="h3" weight="bold" className="text-[#090C18]">
              {timer}
            </Typography>
            <Typography variant="p3" weight="bold" className="text-neutral-950">
              detik
            </Typography>
          </span>
          {/* Progress Bar */}
          <Progress value={(timer! / 30) * 100} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-row gap-6">
          <ContentTitle
            title="Judul Subtes"
            description={dataJson[dataPage]?.name ?? "Fin"}
            icon={
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1773_14113)">
                  <path
                    d="M16.3333 2.50004H12.85C12.5 1.53337 11.5833 0.833374 10.5 0.833374C9.41667 0.833374 8.5 1.53337 8.15 2.50004H4.66667C3.75 2.50004 3 3.25004 3 4.16671V15.8334C3 16.75 3.75 17.5 4.66667 17.5H16.3333C17.25 17.5 18 16.75 18 15.8334V4.16671C18 3.25004 17.25 2.50004 16.3333 2.50004ZM10.5 2.50004C10.9583 2.50004 11.3333 2.87504 11.3333 3.33337C11.3333 3.79171 10.9583 4.16671 10.5 4.16671C10.0417 4.16671 9.66667 3.79171 9.66667 3.33337C9.66667 2.87504 10.0417 2.50004 10.5 2.50004ZM11.3333 14.1667H7.16667C6.70833 14.1667 6.33333 13.7917 6.33333 13.3334C6.33333 12.875 6.70833 12.5 7.16667 12.5H11.3333C11.7917 12.5 12.1667 12.875 12.1667 13.3334C12.1667 13.7917 11.7917 14.1667 11.3333 14.1667ZM13.8333 10.8334H7.16667C6.70833 10.8334 6.33333 10.4584 6.33333 10C6.33333 9.54171 6.70833 9.16671 7.16667 9.16671H13.8333C14.2917 9.16671 14.6667 9.54171 14.6667 10C14.6667 10.4584 14.2917 10.8334 13.8333 10.8334ZM13.8333 7.50004H7.16667C6.70833 7.50004 6.33333 7.12504 6.33333 6.66671C6.33333 6.20837 6.70833 5.83337 7.16667 5.83337H13.8333C14.2917 5.83337 14.6667 6.20837 14.6667 6.66671C14.6667 7.12504 14.2917 7.50004 13.8333 7.50004Z"
                    fill="#6998FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1773_14113">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            }
          />
          <ContentTitle
            title="Jumlah Soal"
            description={
              dataJson[dataPage]?.questions.length.toString() ?? "Fin"
            }
            icon={
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1773_14119)">
                  <path
                    d="M16.3333 2.5H4.66667C3.75 2.5 3 3.25 3 4.16667V15.8333C3 16.75 3.75 17.5 4.66667 17.5H16.3333C17.25 17.5 18 16.75 18 15.8333V4.16667C18 3.25 17.25 2.5 16.3333 2.5ZM11.8 5.44167C12.0417 5.2 12.4417 5.2 12.6833 5.44167L13.4167 6.175L14.15 5.44167C14.3917 5.2 14.7917 5.2 15.0333 5.44167C15.275 5.68333 15.275 6.08333 15.0333 6.325L14.3 7.05833L15.0333 7.79167C15.275 8.03333 15.275 8.43333 15.0333 8.675C14.7917 8.91667 14.3917 8.91667 14.15 8.675L13.4167 7.95L12.6833 8.68333C12.4417 8.925 12.0417 8.925 11.8 8.68333C11.5583 8.44167 11.5583 8.04167 11.8 7.8L12.5333 7.06667L11.8 6.33333C11.55 6.08333 11.55 5.68333 11.8 5.44167ZM6.33333 6.43333H9.25C9.59167 6.43333 9.875 6.71667 9.875 7.05833C9.875 7.4 9.59167 7.68333 9.25 7.68333H6.33333C5.99167 7.68333 5.70833 7.4 5.70833 7.05833C5.70833 6.71667 5.99167 6.43333 6.33333 6.43333ZM9.45833 13.3333H8.41667V14.375C8.41667 14.7167 8.13333 15 7.79167 15C7.45 15 7.16667 14.7167 7.16667 14.375V13.3333H6.125C5.78333 13.3333 5.5 13.05 5.5 12.7083C5.5 12.3667 5.78333 12.0833 6.125 12.0833H7.16667V11.0417C7.16667 10.7 7.45 10.4167 7.79167 10.4167C8.13333 10.4167 8.41667 10.7 8.41667 11.0417V12.0833H9.45833C9.8 12.0833 10.0833 12.3667 10.0833 12.7083C10.0833 13.05 9.8 13.3333 9.45833 13.3333ZM14.875 14.375H11.9583C11.6167 14.375 11.3333 14.0917 11.3333 13.75C11.3333 13.4083 11.6167 13.125 11.9583 13.125H14.875C15.2167 13.125 15.5 13.4083 15.5 13.75C15.5 14.0917 15.2167 14.375 14.875 14.375ZM14.875 12.2917H11.9583C11.6167 12.2917 11.3333 12.0083 11.3333 11.6667C11.3333 11.325 11.6167 11.0417 11.9583 11.0417H14.875C15.2167 11.0417 15.5 11.325 15.5 11.6667C15.5 12.0083 15.2167 12.2917 14.875 12.2917Z"
                    fill="#6998FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1773_14119">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            }
          />
          <ContentTitle
            title="Waktu Pengerjaan"
            description="20 Menit"
            icon={
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1773_14125)">
                  <path
                    d="M10.5 1.66663C5.91669 1.66663 2.16669 5.41663 2.16669 9.99996C2.16669 14.5833 5.91669 18.3333 10.5 18.3333C15.0834 18.3333 18.8334 14.5833 18.8334 9.99996C18.8334 5.41663 15.0834 1.66663 10.5 1.66663ZM13.4584 13.1666L10.0584 11.075C9.80835 10.925 9.65835 10.6583 9.65835 10.3666V6.45829C9.66669 6.11663 9.95002 5.83329 10.2917 5.83329C10.6334 5.83329 10.9167 6.11663 10.9167 6.45829V10.1666L14.1167 12.0916C14.4167 12.275 14.5167 12.6666 14.3334 12.9666C14.15 13.2583 13.7584 13.35 13.4584 13.1666Z"
                    fill="#6998FF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1773_14125">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            }
          />
        </div>
        <Button
          size="medium"
          onClick={() => {
            if (dataPage === dataJson.length) return;
            setDataPage((prev) => prev + 1);
          }}
        >
          Lanjutan Subtes Selanjutnya
        </Button>
      </div>
    </div>
  );
}
