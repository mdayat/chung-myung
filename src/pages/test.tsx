import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import { karla, nunito } from "@utils/fonts";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";

const Test: NextPageWithLayout = () => {
  return (
    <>
      {/* <input
        type="file"
        onChange={(e) => {
          const file = e.currentTarget.files[0];
          file.arrayBuffer().then((arrayBuffer) => {
            const blob = new Blob([arrayBuffer], { type: "image/png" });
            const formdata = new FormData();

            const editors = [
              {
                type: "question",
                deltaOps: [
                  {
                    insert: {
                      image: "question-1",
                    },
                  },
                ],
              },
              {
                type: "explanation",
                deltaOps: [
                  {
                    insert: {
                      image: "explanation-1",
                    },
                  },
                ],
              },
              {
                type: "multipleChoice",
                taggedDeltaOps: [
                  {
                    tag: "answerChoice3",
                    deltaOps: [
                      {
                        insert: {
                          image: "answerChoice3-1",
                        },
                      },
                    ],
                  },
                ],
              },
            ];

            formdata.append("question-1", blob, "question-1.png");
            formdata.append("explanation-1", blob, "explanation-1.png");
            formdata.append("answerChoice3-1", blob, "answerChoice3-1.png");
            formdata.append(
              "editors",
              JSON.stringify({
                questionID: "c1010101",
                correctAnswerTag: "answerChoice3",
                editors,
              })
            );

            fetch("/api/materials/1/prerequisites/2/questions", {
              method: "post",
              body: formdata,
            });
          });
        }}
      /> */}
    </>
  );
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
