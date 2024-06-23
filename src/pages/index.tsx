import { Navbar } from "@components/Navbar";

import { Jumbotron } from "@components/home/Jumbotron";
import { AsesmenStart } from "@components/home/MulaiAsesmen";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Jumbotron />

        <AsesmenStart />
      </main>
    </>
  );
}
