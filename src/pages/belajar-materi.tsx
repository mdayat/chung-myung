import type { ReactElement } from "react";

import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { karla, nunito } from "@utils/fonts";
import type { NextPageWithLayout } from "./_app";

const BelajarMateri: NextPageWithLayout = () => {
  return <></>;
};

BelajarMateri.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Navbar bgColor="bg-neutral-100">
        <HelpMenu />
        <ProfileMenu withIcon withUsername />
      </Navbar>

      <main className={`${karla.variable} ${nunito.variable} font-karla`}>
        {page}
      </main>
    </>
  );
};

export default BelajarMateri;
