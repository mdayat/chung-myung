import { useState } from "react";

import { Button } from "@components/shadcn/Button";
import { Navbar } from "@components/Navbar";
import { Typography } from "@components/shadcn/Typography";

import { AsesmenStart } from "@components/home/MulaiAsesmen";
import { HasilFinal } from "@components/home/HasilFinalAsesmen";
import { HasilAsesmen } from "@components/home/HasilAsesmen";
import { Jumbotron } from "@components/home/Jumbotron";
import { Popup } from "@components/home/Popup";

import { Warning } from "@components/icons/Warning";

export default function Home() {
  const [startAsesmen, setStartAsesmen] = useState("mulai-asesmen");
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mt-16 mb-10">
        <Jumbotron />

        <AsesmenStart
          startAsesmen={startAsesmen}
          setIsOpenPopup={setIsOpenPopup}
        />

        {startAsesmen === "asesmen-berlangsung" && (
          <section className="mx-10 xl:mx-auto xl:max-w-[1206px] xl:px-5 xl:py-4 bg-neutral-0 shadow-lg border-t-2 rounded-xl mt-6 border-neutral-50 relative flex z-10 xl:overflow-hidden items-center justify-between">
            <div className="absolute w-24 h-24 block bg-error-100/50 -top-1 -left-4 rounded-full blur -z-10" />

            <div className="flex gap-x-10 items-center">
              <div className="relative">
                <Warning className="w-8 h-8 fill-error-500" />
              </div>

              <div>
                <Typography
                  variant="h5"
                  className="text-error-600"
                  weight="bold"
                >
                  Asesmen Kesiapan Belajar Kamu Belum Terselesaikan!
                </Typography>
                <Typography variant="p3" className="mt-1">
                  Ingin melanjutkan atau mengulang asesmen?
                </Typography>
              </div>
            </div>

            <div className="flex gap-x-4">
              <Button variant="secondary" size="small">
                Mulai Ulang Asesmen
              </Button>
              <Button size="small">Lanjutkan Asesmen</Button>
            </div>
          </section>
        )}

        <ul className="mt-6 mx-20 grid grid-cols-2 gap-x-8 items-center xl:w-[1206px] xl:mx-auto xl:flex xl:gap-x-0 xl:justify-between">
          <li>
            <HasilAsesmen />
          </li>
          <li>
            <HasilFinal />
          </li>
        </ul>
      </main>
      {isOpenPopup && (
        <Popup
          isOpenPopup={isOpenPopup}
          setIsClosePopup={setIsOpenPopup}
          setStartAsesmen={setStartAsesmen}
        />
      )}
    </>
  );
}
