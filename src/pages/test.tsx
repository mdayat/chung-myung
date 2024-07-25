import { getSubtestQuestions, getSubtests } from "@utils/assessmentTracker";
import { karla, nunito } from "@utils/fonts";
import { ReactElement } from "react";

import { NextPageWithLayout } from "./_app";

const Test: NextPageWithLayout = () => {
  return (
    <>
      <button
        onClick={async () => {
          console.log(
            await getSubtestQuestions(
              "38b42a5a-300b-4e59-bdda-baf31a90d54b",
              "prerequisite",
            ),
          );
          console.log(await getSubtests("prerequisite"));
        }}
      >
        click
      </button>
    </>
  );
};

Test.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      {page}
    </main>
  );
};

export default Test;
