import { useEffect, useState } from "react";
import { type AKBSample } from "../../data/AKBSample";
import EmtekaLogo from "../../../public/Emteka-Logo.svg";
import Timer from "../../../public/timer.svg";
import dataJson from "../../data/AKBSample.json";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@components/shadcn/RadioButton";
import { Label } from "@components/shadcn/Label";
import { Button } from "@components/shadcn/Button";
import RestArea from "@components/asesmen/RestArea";
import PopUp from "@components/asesmen/PopUp";

export default function AKB() {
  const [data, setData] = useState<AKBSample[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [questionPage, setQuestionPage] = useState(1);
  const [dataPage, setDataPage] = useState(1);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [atRestRoom, setAtRestRoom] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpPath, setPopUpPath] = useState("");
  function addLeadingZero(num: number, size: number) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  useEffect(() => {
    const dataSorted = dataJson.sort(
      (a, b) => a.sequence_number - b.sequence_number
    );
    setData(dataSorted);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries[0].intersectionRatio);
        if (entries[0].intersectionRatio === 1) {
          setIsAnswerVisible(true);
        } else {
          setIsAnswerVisible(false);
        }
      },
      { threshold: 0.25 }
    );
    const frameJawaban = document.getElementById("frame-jawaban");
    if (frameJawaban != null) {
      observer.observe(frameJawaban);
    }
    return () => {
      if (frameJawaban != null) {
        observer.unobserve(frameJawaban);
      }
    };
  }, [dataPage, questionPage]);
  useEffect(() => {
    setAtRestRoom(false);
    setQuestionPage(1);
    setTimer(15);
  }, [dataPage]);
  useEffect(() => {
    if (timer === 0) {
      console.log("Time's up");
      return;
    }
    const interval = setInterval(() => {
      console.log(timer);
      setTimer((prev) => prev! - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  return (
    <div className="w-[1366px] mx-auto">
      <div className="p-4 flex flex-row items-center justify-between">
        <Image src={EmtekaLogo} alt="" className="h-8 max-w-fit" />
        <div className="w-8 h-8 bg-neutral-500 rounded-full"></div>
      </div>
      {!atRestRoom && (
        <div className="px-20 py-10">
          <div className="flex flex-row items-center justify-between">
            <p className="text-[2rem] font-bold">
              {dataJson[dataPage - 1].name}
            </p>
            <p className="text-base font-normal rounded-full border-[1px] border-neutral-950 px-4 py-2">
              <span className="font-bold">{dataPage}</span>/{data.length}{" "}
              <span className="font-bold">Subtes</span>
            </p>
          </div>
          <div className="mt-4 p-4 bg-secondary-50 rounded-[8px] flex flex-row items-center justify-between">
            <div className="flex flex-row">
              {dataJson[dataPage - 1].questions?.map((question, index) => (
                <p
                  key={question.id}
                  className={`hover:cursor-pointer text-center w-10 h-10 rounded-full font-medium flex items-center justify-center ml-2 ${index + 1 === questionPage ? "bg-secondary-500 text-neutral-0" : "bg-neutral-0"}`}
                  onClick={() => setQuestionPage(index + 1)}
                >
                  {addLeadingZero(index + 1, 2)}
                </p>
              ))}
            </div>
            <div className="flex flex-row items-center">
              <Image src={Timer} alt="" className="h-6 w-6 mr-4" />
              <div className="font-medium text-lg flex flex-row justify-center items-center">
                <p className="bg-secondary-200 w-10 h-10 rounded-md flex items-center justify-center mr-2">
                  {addLeadingZero(Math.floor(timer! / 3600), 2)}
                </p>
                <p className="mr-2">:</p>
                <p className="bg-secondary-200 w-10 h-10 rounded-md flex items-center justify-center mr-2">
                  {addLeadingZero(Math.floor((timer! / 60) % 60), 2)}
                </p>
                <p className="mr-2">:</p>
                <p className="bg-secondary-200 w-10 h-10 rounded-md flex items-center justify-center">
                  {addLeadingZero(Math.floor(timer! % 60), 2)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-row">
            <div className="w-[calc(100%-35%)] flex flex-col">
              {dataJson[dataPage - 1].questions[questionPage - 1]
                .url_gambar && (
                <p className="text-xl font-base">Perhatikan gambar berikut!</p>
              )}
              {dataJson[dataPage - 1].questions[questionPage - 1]
                .url_gambar && (
                <Image
                  src={`/${dataJson[dataPage - 1].questions[questionPage - 1].url_gambar}`}
                  alt=""
                  className="cursor-pointer"
                  width={280}
                  height={280}
                  onClick={() => {
                    setShowPopUp(true);
                    setPopUpPath(
                      `/${dataJson[dataPage - 1].questions[questionPage - 1].url_gambar}`
                    );
                  }}
                />
              )}
              <p className="text-xl font-base">
                {dataJson[dataPage - 1].questions[questionPage - 1].content}
              </p>
            </div>
            <div
              id="frame-jawaban"
              className="w-[calc(100%-65%)] flex flex-col justify-between"
            >
              <RadioGroup
                defaultValue={
                  dataJson[dataPage - 1].questions[questionPage - 1]
                    .id_jawaban_user ?? ""
                }
                onValueChange={(value) => {
                  const newData = dataJson;
                  newData[dataPage - 1].questions[
                    questionPage - 1
                  ].id_jawaban_user = value;
                  setData(newData);
                }}
              >
                {dataJson[dataPage - 1].questions[
                  questionPage - 1
                ].multiple_choices.map((choice, index) => (
                  <div
                    key={index}
                    className="bg-secondary-50 rounded-[8px] px-4 py-2 mb-4 hover:cursor-pointer"
                    onClick={() => {
                      const radio = document.getElementById(choice.id);
                      if (radio != null) {
                        radio.click();
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2 my-2">
                      <RadioGroupItem value={choice.id} id={choice.id} />
                      <Label
                        className="font-normal text-base flex flex-row items-center space-x-2"
                        htmlFor={choice.id}
                      >
                        {choice.url_gambar && (
                          <Image
                            src={`/${choice.url_gambar}`}
                            alt=""
                            width={200}
                            height={200}
                          />
                        )}
                        {choice?.content! ?? ""}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <div
                key={questionPage}
                className={`${isAnswerVisible ? "absolute bottom-8 translate-x-1/2" : "flex flex-row items-center justify-center"}`}
              >
                <Button
                  variant={"secondary"}
                  className="text-neutral-300 border-neutral-300 mr-3"
                  onClick={() => {
                    if (questionPage > 1) setQuestionPage((prev) => prev - 1);
                  }}
                >
                  Kembali
                </Button>
                <Button
                  className="ml-3"
                  onClick={() => {
                    if (
                      questionPage <
                        dataJson[dataPage - 1].questions?.length! ??
                      0
                    )
                      setQuestionPage((prev) => prev + 1);
                    if (
                      questionPage === dataJson[dataPage - 1].questions?.length!
                    ) {
                      const userAnswer = dataJson[dataPage - 1].questions?.map(
                        (question) => question.id_jawaban_user
                      );
                      if (userAnswer[userAnswer.length - 1] == "") {
                        alert("Kamu belum menjawab pertanyaan ini!");
                        return;
                      }
                      setAtRestRoom(true);
                    }
                  }}
                >
                  {questionPage === dataJson[dataPage - 1].questions?.length!
                    ? "Subtes Selanjutnya"
                    : "Selanjutnya"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {atRestRoom && (
        <div className="flex items-center justify-center">
          <RestArea
            setDataPage={setDataPage}
            dataJson={dataJson}
            dataPage={dataPage}
          />
        </div>
      )}
      <PopUp
        show={showPopUp}
        onClose={() => {
          setShowPopUp(false);
          setPopUpPath("");
        }}
        path={popUpPath}
      />
    </div>
  );
}
