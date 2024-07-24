import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import { karla, nunito } from "@utils/fonts";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";

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
