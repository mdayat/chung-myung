import { Typography } from "@components/shadcn/Typography";
import { Progress } from "@components/shadcn/Progress";
import Image from "next/image";
import { Button } from "@components/shadcn/Button";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { AKBSample } from "../data/AKBSample";
import { AssignmentIcon } from "./icons/AssignmentIcon";
import { CalculateIcon } from "./icons/CalculateIcon";
import { WatchLaterIcon } from "./icons/WatchLaterIcon";

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
          src="/maskot-head.png"
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
          <div className="flex flex-row gap-2">
            <span className="flex items-center justify-center h-10 w-10 rounded-full border border-secondary-400">
              <AssignmentIcon className="fill-secondary-400 w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <Typography
                variant="p3"
                weight="bold"
                className="text-neutral-950"
              >
                Judul Subtes
              </Typography>
              <Typography variant="p4" className="text-neutral-500">
                {dataJson[dataPage]?.name ?? "Fin"}
              </Typography>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <span className="flex items-center justify-center h-10 w-10 rounded-full border border-secondary-400">
              <CalculateIcon className="fill-secondary-400 w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <Typography
                variant="p3"
                weight="bold"
                className="text-neutral-950"
              >
                Jumlah Soal
              </Typography>
              <Typography variant="p4" className="text-neutral-500">
                {dataJson[dataPage]?.questions.length.toString() ?? "Fin"}
              </Typography>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <span className="flex items-center justify-center h-10 w-10 rounded-full border border-secondary-400">
              <WatchLaterIcon className="fill-secondary-400 w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <Typography
                variant="p3"
                weight="bold"
                className="text-neutral-950"
              >
                Waktu Pengerjaan
              </Typography>
              <Typography variant="p4" className="text-neutral-500">
                20 Menit
              </Typography>
            </div>
          </div>
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
