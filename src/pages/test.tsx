import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { karla, nunito } from "@utils/fonts";
import { ReactElement } from "react";

import { NextPageWithLayout } from "./_app";

const Test: NextPageWithLayout = () => {
  return <></>;
};

Test.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      <Navbar>
        <HelpMenu />
        <ProfileMenu />
      </Navbar>
      {page}
    </main>
  );
};

export default Test;
