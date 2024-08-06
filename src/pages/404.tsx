import { Typography } from "@components/shadcn/Typography";
import { karla, nunito } from "@utils/fonts";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
  return (
    <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
      <Typography
        as='h1'
        variant='d1'
        weight='bold'
        className='mb-2 text-secondary-500'
      >
        404
      </Typography>
      <Typography as='h2' variant='h5' weight='bold'>
        Page Not Found!
      </Typography>
    </div>
  );
};

Custom404.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} mt-16 font-karla`}>
      {page}
    </main>
  );
};

export default Custom404;
