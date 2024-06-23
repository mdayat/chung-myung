import { useEffect, useState } from "react";
import { AKBSample } from "src/data/AKBSample";
import dataJson from "src/data/AKBSample.json";

export default function AKB() {
  const [data, setData] = useState<AKBSample[]>([]);
  useEffect(() => {
    setData(dataJson);
  }, []);
  return (
    <div>
      <h1 className="text-4xl font-bold">
        <p>{data[0]?.name}</p>
      </h1>
    </div>
  );
}
