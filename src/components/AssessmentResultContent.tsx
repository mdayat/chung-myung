import Link from "next/link";
import { AssignmentIcon } from "./icons/AssignmentIcon";
import { CalculateIcon } from "./icons/CalculateIcon";
import { WatchLaterIcon } from "./icons/WatchLaterIcon";
import { Button } from "./shadcn/Button";
import { Typography } from "./shadcn/Typography";

interface OptionSoal {
  title: string;
  isAnswer: boolean;
}

interface SoalSubtest {
  soal: string;
  options: OptionSoal[];
  isTrue: boolean;
  pembahasan?: string;
}

interface AssessmentContent {
  judulSubtest: string;
  jumlahSoal: number;
  waktuPengerjaan: number;
  soalSubtest: SoalSubtest[];
}

interface AssessmentResultContentProps {
  data: AssessmentContent[];
}

export function AssessmentResultContent({
  data,
}: AssessmentResultContentProps) {
  return (
    <>
      {/* Navbar Subtest Section */}
      <div className="fixed flex items-center w-full max-w-[1366px] bg-neutral-0 !text-secondary-500 h-[52px] px-6 mb-6 gap-5 rounded-lg z-20">
        {data.map((subtest, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Link href={`#subtes${index + 1}`}>Subtes {index + 1}</Link>
          </Button>
        ))}
      </div>
      <div className="fixed w-full bg-secondary-100 h-[140px] mb-6 top-0 rounded-lg z-10"></div>
      <div className="fixed w-full max-w-[1366px] bg-neutral-0 h-[52px] mb-6 rounded-lg shadow-lg"></div>

      {/* Subtest Section */}
      <div className="flex flex-col gap-4">
        {data.map((subtest, index) => (
          <div
            id={`subtes${index + 1}`}
            className={`flex flex-col gap-4 scroll-mt-[160px] ${index === 0 ? "mt-[76px]" : ""}`}
            key={index}
          >
            {/* Uppper Subtes Section*/}
            <div className="overflow-clip rounded-lg mb-4">
              <div className="flex flex-row items-center justify-between px-6 py-[10px] bg-secondary-500">
                <Typography
                  variant="h6"
                  weight="bold"
                  className="text-neutral-25"
                >
                  Subtes {index + 1}
                </Typography>
                <div className="flex flex-row gap-4">
                  {subtest.soalSubtest.map((soal, soalIndex) => (
                    <Link
                      key={soalIndex}
                      href={`#soal-${index + 1}.${soalIndex + 1}  `}
                    >
                      <span
                        className={`flex items-center justify-center rounded-full w-10 h-10 ${soal.isTrue ? "bg-success-300" : "bg-error-300"}`}
                      >
                        <Typography
                          className={`${soal.isTrue ? "" : "text-neutral-0"}`}
                          variant="b3"
                          weight="bold"
                        >
                          {soalIndex + 1}
                        </Typography>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex px-6 pt-4 pb-3 gap-6 bg-secondary-200">
                {/* Judul Subtes Component */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-secondary-500">
                    <AssignmentIcon className="w-5 h-5 fill-secondary-500" />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="b3"
                      weight="bold"
                      className="text-neutral-950"
                    >
                      Judul Subtes
                    </Typography>
                    <Typography variant="b4" className="text-neutral-500">
                      {subtest.judulSubtest}
                    </Typography>
                  </div>
                </div>

                {/* Jumlah Soal Component */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-secondary-500">
                    <CalculateIcon className="w-5 h-5 fill-secondary-500" />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="b3"
                      weight="bold"
                      className="text-neutral-950"
                    >
                      Jumlah Soal
                    </Typography>
                    <Typography variant="b4" className="text-neutral-500">
                      {subtest.jumlahSoal} Soal
                    </Typography>
                  </div>
                </div>

                {/* Waktu Pengerjaan Compoenent */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-secondary-500">
                    <WatchLaterIcon className="w-5 h-5 fill-secondary-500" />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="b3"
                      weight="bold"
                      className="text-neutral-950"
                    >
                      Waktu Pengerjaan
                    </Typography>
                    <Typography variant="b4" className="text-neutral-500">
                      {subtest.waktuPengerjaan} Menit
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Soal Subtes Section */}
            <div className="flex flex-col gap-4">
              {subtest.soalSubtest.map((soal, soalIndex) => (
                <div
                  key={soalIndex}
                  id={`soal-${index + 1}.${soalIndex + 1}`}
                  className={`flex flex-col bg-neutral-0 p-6 gap-4 rounded-lg border scroll-mt-[150px] ${soal.isTrue ? "border-success-300" : "border-error-300"}`}
                >
                  <Typography
                    variant="h6"
                    weight="bold"
                    className="text-neutral-700"
                  >
                    Soal {soalIndex + 1}
                  </Typography>
                  {/* Soal & Answer Section */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <Typography variant="b3" className="text-neutral-700">
                        {soal.soal}
                      </Typography>
                      <ul>
                        {soal.options.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            <Typography
                              variant="b3"
                              className={`${soal.isTrue && option.isAnswer ? "text-success-500" : !soal.isTrue && option.isAnswer ? "text-error-500" : ""}`}
                            >
                              {option.title}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {soal.pembahasan ? (
                      <div className="flex flex-col gap-2">
                        <Typography
                          variant="b3"
                          weight="bold"
                          className="text-neutral-700"
                        >
                          Pembahasan:
                        </Typography>
                        <Typography variant="b3" className="text-neutral-700">
                          {soal.pembahasan}
                        </Typography>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <Typography variant="b3" className="text-neutral-400">
                          Pelajari materi di bawah ini dan coba lagi untuk
                          menemukan jawabannya.
                        </Typography>
                        <Button>Baca Materi</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
