import { useState } from "react";

import { Navbar } from "@components/Navbar";

import { CardHasilAsesmenAkhir } from "@components/home/CardHasilAsesmenAkhir";
import { CardHasilAKB } from "@components/home/CardHasilAKB";
import { CardWarningNoCompletedAKB } from "@components/home/CardWarningNoCompletedAKB";
import { HomeHeroBanner } from "@components/home/HomeHeroBanner";
import { HomeMulaiAKB } from "@components/home/HomeMulaiAKB";

export default function Home() {
  const [isStartAsesmen, setStartAsesmen] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mt-16 mb-10">
        <HomeHeroBanner />

        <HomeMulaiAKB
          isOpenPopup={isOpenPopup}
          isStartAsesmen={isStartAsesmen}
          setStartAsesmen={setStartAsesmen}
          setIsOpenPopup={setIsOpenPopup}
        />

        {isStartAsesmen === "asesmen-berlangsung" && (
          <CardWarningNoCompletedAKB
            isStartAsesmen={isStartAsesmen}
            setStartAsesmen={setStartAsesmen}
          />
        )}

        <ul className="mt-6 mx-20 grid grid-cols-2 gap-x-8 items-center xl:w-[1206px] xl:mx-auto xl:flex xl:gap-x-0 xl:justify-between">
          <li>
            <CardHasilAKB />
          </li>
          <li>
            <CardHasilAsesmenAkhir />
          </li>
        </ul>
      </main>
    </>
  );
}
