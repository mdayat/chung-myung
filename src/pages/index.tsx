import { Navbar } from "@components/Navbar";

import { AsesmenStart } from "@components/home/MulaiAsesmen";
import { HasilFinal } from "@components/home/HasilFinalAsesmen";
import { HasilAsesmen } from "@components/home/HasilAsesmen";
import { Jumbotron } from "@components/home/Jumbotron";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mt-16 mb-10">
        <Jumbotron />

        <AsesmenStart />

        <ul className="mt-6 mx-20 grid grid-cols-2 gap-x-8 items-center xl:w-[1206px] xl:mx-auto xl:flex xl:gap-x-0 xl:justify-between">
          <li>
            <HasilAsesmen />
          </li>
          <li>
            <HasilFinal />
          </li>
        </ul>
      </main>
    </>
  );
}
