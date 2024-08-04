import { CheckCircleIcon } from "@components/icons/CheckCircleIcon";
import { ChevronLeftIcon } from "@components/icons/ChevronLeftIcon";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { OpenInNewIcon } from "@components/icons/OpenInNewIcon";
import { WarningIcon } from "@components/icons/WarningIcon";
import { MateriCard } from "@components/MateriCard";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import { FailedResponse, SuccessResponse } from "@customTypes/api";
import Gambar from "@public/Coba.jpg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";

interface SubmateriData {
  status: string;

  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: "prerequisite" | "sub_material";
  number: number;
}

interface DetailMateri {
  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: string;
  number: number;

  status: string;
}

const DetailMateri = () => {
  const [detailMateri, setDetailMateri] = useState<DetailMateri>();
  const [subMateri, setSubMateri] = useState<SubmateriData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    setIsLoading(true);
    // ENV Disesuaikan Dengan Port Masing2 Dev
    (async () => {
      try {
        const materialID = "f64fb490-778d-4719-8d01-18f49a3b55a4";
        const DetailMateriResponse = (await (
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/materials/${materialID}/learning-materials/${id}`,
          )
        ).json()) as SuccessResponse<DetailMateri> | FailedResponse;

        const SubMateriResponse = (await (
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/materials/${materialID}/learning-materials`,
          )
        ).json()) as SuccessResponse<SubmateriData[]> | FailedResponse;
        console.log(SubMateriResponse);

        if (
          DetailMateriResponse.status === "failed" ||
          SubMateriResponse.status === "failed"
        ) {
          // do something when failed
          return;
        }
        setSubMateri(SubMateriResponse.data);
        setDetailMateri(DetailMateriResponse.data);
      } catch (error) {
        console.error(
          new Error(
            "Error when get all learning materials based on material ID: ",
            { cause: error },
          ),
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router.isReady, id]);
  console.log(detailMateri);
  return (
    <div className='px-8 pt-20'>
      <div onClick={router.back} className='hover:cursor-pointer'>
        <Typography
          variant='b4'
          weight='bold'
          className='flex text-secondary-300'
        >
          <ChevronLeftIcon className='h-5 w-5 fill-secondary-300' />
          Kembali
        </Typography>
      </div>
      <p>huhuhu</p>
      <div className='mt-5 flex'>
        <div className='relative'>
          {detailMateri?.type === "prerequisite" ? (
            <div className='absolute flex rounded-br-xl rounded-tl-xl bg-warning-200 p-2'>
              <WarningIcon className='mr-3 h-5 w-5 fill-warning-600' />
              <Typography variant='b4' className='' weight='bold'>
                Materi Prasyarat
              </Typography>
            </div>
          ) : (
            ""
          )}

          <Image
            src={Gambar}
            alt='Gambar'
            className='h-[180px] w-[320px] min-w-[320px] rounded-xl object-cover'
          />
          <div className='mt-5 flex justify-center'>
            <CheckCircleIcon className='mr-3 h-5 w-5 fill-success-600' />
            <Typography variant='b4' className='text-center text-success-600'>
              Sudah Di Pelajari
            </Typography>
          </div>
        </div>

        <div className='ml-10'>
          <Typography variant='h6' weight='bold' className='text-neutral-900'>
            Materi Prasyarat Bidang Ruang
          </Typography>
          <Typography
            variant='h3'
            weight='bold'
            className='my-3 text-neutral-900'
          >
            {detailMateri?.name}
          </Typography>
          <Typography variant='b3' weight='normal' className='text-neutral-500'>
            {detailMateri?.description}
          </Typography>

          <div className='mt-5 flex gap-4'>
            <Link href={`${detailMateri?.learningModuleURL}`} target='_blank'>
              <Button>
                Baca Online <OpenInNewIcon className='h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-3 h-1 w-full rounded-full bg-neutral-200'></div>

      <section className='mb-5'>
        <Typography variant='h5' weight='bold' className='my-5'>
          Pelajari sub-materi lainnya!
        </Typography>
        <div className='flex flex-wrap gap-4'>
          {!isLoading && subMateri ? (
            subMateri
              ?.filter((data: SubmateriData) => data.type === "sub_material")
              .map((data: SubmateriData) => {
                return (
                  <Link
                    key={data.id}
                    href={{
                      pathname: `/materi/${data.id}`,
                    }}
                  >
                    <MateriCard name={data.name} type={data.type} />
                  </Link>
                );
              })
          ) : (
            <div className='mt-10 flex w-full justify-center'>
              <LoaderSpinner className='h-16 w-16' />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DetailMateri;
