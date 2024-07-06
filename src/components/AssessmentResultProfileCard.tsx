import { typeAssessment } from "../pages/hasil-asesmen";
import { AccessTimeIcon } from "./icons/AccessTimeIcon";
import { HeartOutlineIcon } from "./icons/HeartOutlineIcon";
import { RedHeartIcon } from "./icons/RedHeartIcon";
import { Button } from "./shadcn/Button";
import { Typography } from "./shadcn/Typography";

interface AssessmentResultProfileCardProps {
  createdAt: string;
  materialName: string;
  assessmentType: string;
  nilai: number;
  attempt: number;
}

export function AssessmentResultProfileCard({
  createdAt,
  materialName,
  assessmentType,
  nilai,
  attempt,
}: AssessmentResultProfileCardProps) {
  return (
    <div className="rounded-2xl bg-secondary-500 w-[400px] h-[656px] px-[37px] py-6 flex flex-col justify-between text-center">
      {/* <span className="w-[536px] h-[548px] bg-secondary-400"> </span> */}
      <div>
        <div className="flex flex-col gap-3 text-neutral-25">
          <Typography variant="h5" weight="bold">
            {assessmentType === typeAssessment.kesiapanBelajar
              ? `Hasil ${typeAssessment.kesiapanBelajar}`
              : `Hasil ${typeAssessment.akhir}`}
          </Typography>
          <div className="flex flex-row items-center justify-center gap-2">
            <AccessTimeIcon className="fill-neutral-200 h-5 w-5" />
            <Typography variant="p4" className="text-neutral-200">
              {createdAt}
            </Typography>
          </div>
        </div>
        <Typography
          variant="d1"
          weight="bold"
          className="mt-10 text-neutral-100"
        >
          {nilai}%
        </Typography>
        <div className="mt-8 gap-1">
          <Typography variant="p3" className="text-neutral-200">
            Materi
          </Typography>
          <Typography variant="h5" weight="bold" className="text-secondary-100">
            {materialName}
          </Typography>
        </div>
      </div>

      <div>
        {attempt === 1 && nilai === 100 && (
          <>
            <div className="flex flex-row gap-8 justify-center">
              <RedHeartIcon className="w-16 h-16" />
              <RedHeartIcon className="w-16 h-16" />
              <RedHeartIcon className="w-16 h-16" />
            </div>
            <Typography variant="p3" className="text-neutral-100 mt-6">
              Keren! Kamu langsung dapat nilai sempurna! Yuk, lanjut belajar!
            </Typography>
            <div className="flex flex-row gap-3 mt-12">
              <Button
                variant="secondary"
                className="text-neutral-25 border-neutral-25"
              >
                Kembali ke Home
              </Button>
              <Button
                variant="primary"
                className="bg-primary-400 text-neutral-700"
              >
                Lanjut Belajar
              </Button>
            </div>
          </>
        )}

        {attempt <= 2 && nilai < 100 && (
          <>
            <div className="flex flex-row gap-8 justify-center">
              <RedHeartIcon className="w-16 h-16" />
              <RedHeartIcon className="w-16 h-16" />
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
            </div>
            <Typography variant="p3" className="text-neutral-100 mt-6">
              Semangat! Masih ada kesempatan, <br /> Coba lagi agar nilai Kamu
              lebih baik!
            </Typography>
            <div className="flex flex-row gap-3 mt-12">
              <Button variant="secondary" className="border-neutral-25">
                Kembali ke Home
              </Button>
              <Button
                variant="primary"
                className="bg-primary-400 text-neutral-700"
              >
                Kerjakan Ulang
              </Button>
            </div>
          </>
        )}

        {attempt <= 3 && attempt > 1 && nilai === 100 && (
          <>
            <div className="flex flex-row gap-8 justify-center">
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
            </div>
            <Typography variant="p3" className="text-neutral-100 mt-6">
              Hore! Akhirnya Kamu dapat nilai sempurna! <br /> Ayo Lanjut
              belajar!
            </Typography>
            <div className="flex flex-row gap-3 mt-12">
              <Button
                variant="secondary"
                className="text-neutral-25 border-neutral-25"
              >
                Kembali ke Home
              </Button>
              <Button
                variant="primary"
                className="bg-primary-400 text-neutral-700"
              >
                Lanjut Belajar
              </Button>
            </div>
          </>
        )}

        {attempt === 3 && nilai < 100 && (
          <>
            <div className="flex flex-row gap-8 justify-center">
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
              <HeartOutlineIcon className="fill-neutral-0 w-16 h-16" />
            </div>
            <Typography variant="p3" className="text-neutral-100 mt-6">
              Jangan khawatir, <br /> ayo pelajari materi yang belum dikuasai!
            </Typography>
            <div className="flex flex-row gap-3 mt-12">
              <Button
                variant="secondary"
                className="text-neutral-25 border-neutral-25"
              >
                Kembali ke Home
              </Button>
              <Button
                variant="primary"
                className="bg-primary-400 text-neutral-700"
              >
                Lanjut Belajar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
