'use client';

import { PopulationAPI, PrefectureAPI } from '@/api/api';
import { getPopulation, getPrefectures } from '@/api/implement';
import { useEffect, useState } from 'react';

interface checkBoxStatusProps {
  [key: number]: boolean;
}

export default function Home() {
  const [prefectures, setPrefectures] =
    useState<PrefectureAPI['response']['result']>();
  const [populationData, setPopulationData] =
    useState<PopulationAPI['response']['result']>();

  const [checkBoxStatus, setCheckBoxStatus] = useState<checkBoxStatusProps>(
    Object.fromEntries(Array.from({ length: 47 }, (_, i) => [i + 1, false])),
  );

  const fetchPrefectures = async () => {
    const res = await getPrefectures();
    if (res instanceof Error) {
      alert(res.message);
      return;
    }
    setPrefectures(res.result);
  };

  const fetchPopulation = async (prefCode: number) => {
    const res = await getPopulation({ prefCode });
    if (res instanceof Error) {
      alert(res.message);
      return;
    }
    setPopulationData(res.result);
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-row items-center justify-center flex-wrap w-xl my-auto">
        {prefectures?.map((prefecture) => {
          const prefCode = prefecture.prefCode;
          const prefName = prefecture.prefName;
          return (
            <div key={prefCode} className="gap-2 mx-4 my-1">
              <label>
                <input
                  type="checkbox"
                  name={prefName}
                  id={prefCode.toString()}
                  checked={checkBoxStatus[prefCode]}
                  onChange={() =>
                    setCheckBoxStatus((prev) => ({
                      ...prev,
                      [prefCode]: !prev[prefCode],
                    }))
                  }
                />
                {prefName}
              </label>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-2 items-center justify-center flex-wrap">
        <button onClick={fetchPrefectures} className="outlined">
          県リロード
        </button>
        <button
          onClick={() => fetchPopulation(selectedPrefCode)}
          className="outlined"
        >
          人口リロード
        </button>
        {prefectures?.map((prefecture) => {
          const prefCode = prefecture.prefCode;
          const prefName = prefecture.prefName;
          if (!checkBoxStatus[prefCode]) return null;
          return <div key={prefCode}>{prefName}</div>;
        })}
        {populationData?.boundaryYear || ' '}
      </div>
    </div>
  );
}
