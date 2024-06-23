import { Navbar } from "@components/Navbar";

import { AsesmenStart } from "@components/home/MulaiAsesmen";
import { HasilFinal } from "@components/home/HasilFinalAsesmen";
import { HasilAsesmen } from "@components/home/HasilAsesmen";
import { Jumbotron } from "@components/home/Jumbotron";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mb-20">
        <Jumbotron />

        <AsesmenStart />

        <ul className="mt-8 mx-20 grid grid-cols-2 gap-x-8 items-center">
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
