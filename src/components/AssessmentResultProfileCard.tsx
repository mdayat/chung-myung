import { AccessTimeIcon } from "./icons/AccessTimeIcon";
import { HeartOutlineIcon } from "./icons/HeartOutlineIcon";
import { RedHeartIcon } from "./icons/RedHeartIcon";
import { Button } from "./shadcn/Button";
import { Typography } from "./shadcn/Typography";
import { typeAssessment } from "../pages/hasil-asesmen";

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
    <div className='relative flex h-[656px] w-[400px] flex-col items-center overflow-clip rounded-2xl bg-secondary-500 px-[37px] py-6 text-center'>
      <div className='z-0'>
        <div className='absolute -inset-x-[70px] -inset-y-[200px] h-[548px] w-[536px] overflow-clip rounded-full bg-secondary-600' />
        <div className='absolute -inset-x-24 -inset-y-[229px] z-10 h-[606px] w-[596px] overflow-clip rounded-full bg-secondary-600 opacity-60' />
      </div>
      <div className='flex h-full flex-col justify-between'>
        <div className='z-30'>
          <div className='flex flex-col gap-3'>
            <Typography className='text-neutral-25' variant='h5' weight='bold'>
              {assessmentType === typeAssessment.kesiapanBelajar
                ? `Hasil ${typeAssessment.kesiapanBelajar}`
                : `Hasil ${typeAssessment.akhir}`}
            </Typography>
            <div className='flex flex-row items-center justify-center gap-2'>
              <AccessTimeIcon className='h-5 w-5 fill-neutral-200' />
              <Typography variant='b4' className='text-neutral-200'>
                {createdAt}
              </Typography>
            </div>
          </div>
          <Typography
            variant='d1'
            weight='bold'
            className='mt-10 text-neutral-100'
          >
            {nilai}%
          </Typography>
          <div className='mt-8 gap-1'>
            <Typography variant='b3' className='text-neutral-200'>
              Materi
            </Typography>
            <Typography
              variant='h5'
              weight='bold'
              className='text-secondary-100'
            >
              {materialName}
            </Typography>
          </div>
        </div>

        <div className='z-30'>
          {attempt === 1 && nilai === 100 && (
            <>
              <div className='flex flex-row justify-center gap-8'>
                <RedHeartIcon className='h-16 w-16' />
                <RedHeartIcon className='h-16 w-16' />
                <RedHeartIcon className='h-16 w-16' />
              </div>
              <Typography variant='b3' className='mt-6 text-neutral-100'>
                Keren! Kamu langsung dapat nilai sempurna! Yuk, lanjut belajar!
              </Typography>
              <div className='mt-12 flex flex-row gap-3'>
                <Button
                  variant='secondary'
                  className='border-neutral-25 text-neutral-25'
                >
                  Kembali ke Home
                </Button>
                <Button
                  variant='primary'
                  className='bg-primary-400 text-neutral-700'
                >
                  Lanjut Belajar
                </Button>
              </div>
            </>
          )}

          {attempt <= 2 && nilai < 100 && (
            <>
              <div className='flex flex-row justify-center gap-8'>
                <RedHeartIcon className='h-16 w-16' />
                <RedHeartIcon className='h-16 w-16' />
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
              </div>
              <Typography variant='b3' className='mt-6 text-neutral-100'>
                Semangat! Masih ada kesempatan, <br /> Coba lagi agar nilai Kamu
                lebih baik!
              </Typography>
              <div className='mt-12 flex flex-row gap-3'>
                <Button variant='secondary' className='border-neutral-25'>
                  Kembali ke Home
                </Button>
                <Button
                  variant='primary'
                  className='bg-primary-400 text-neutral-700'
                >
                  Kerjakan Ulang
                </Button>
              </div>
            </>
          )}

          {attempt <= 3 && attempt > 1 && nilai === 100 && (
            <>
              <div className='flex flex-row justify-center gap-8'>
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
              </div>
              <Typography variant='b3' className='mt-6 text-neutral-100'>
                Hore! Akhirnya Kamu dapat nilai sempurna! <br /> Ayo Lanjut
                belajar!
              </Typography>
              <div className='mt-12 flex flex-row gap-3'>
                <Button
                  variant='secondary'
                  className='border-neutral-25 text-neutral-25'
                >
                  Kembali ke Home
                </Button>
                <Button
                  variant='primary'
                  className='bg-primary-400 text-neutral-700'
                >
                  Lanjut Belajar
                </Button>
              </div>
            </>
          )}

          {attempt === 3 && nilai < 100 && (
            <>
              <div className='flex flex-row justify-center gap-8'>
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
                <HeartOutlineIcon className='h-16 w-16 fill-neutral-0' />
              </div>
              <Typography variant='b3' className='mt-6 text-neutral-100'>
                Jangan khawatir, <br /> ayo pelajari materi yang belum dikuasai!
              </Typography>
              <div className='mt-12 flex flex-row gap-3'>
                <Button
                  variant='secondary'
                  className='border-neutral-25 text-neutral-25'
                >
                  Kembali ke Home
                </Button>
                <Button
                  variant='primary'
                  className='bg-primary-400 text-neutral-700'
                >
                  Lanjut Belajar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
