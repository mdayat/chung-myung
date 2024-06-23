import { Typography } from "@components/shadcn/Typography";
import React from "react";

interface ContentTitleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ContentTitle({
  title,
  description,
  icon,
}: ContentTitleProps) {
  return (
    <div className="flex flex-row gap-2">
      <span className="flex items-center justify-center h-10 w-10 rounded-full border border-secondary-400">
        {icon}
      </span>
      <div className="flex flex-col">
        <Typography variant="p3" weight="bold" className="text-neutral-950">
          {title}
        </Typography>
        <Typography variant="p4" className="text-neutral-500">
          {description}
        </Typography>
      </div>
    </div>
  );
}
