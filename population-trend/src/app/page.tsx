'use client';

import { PopulationAPI, PopulationType, PrefectureAPI } from '@/api/api';
import { getPopulation, getPrefectures } from '@/api/implement';
import { format } from 'path';
import { use, useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { colors } from '@/utils/colors';

interface checkBoxStatusProps {
  [key: number]: boolean;
}

export default function Home() {
  const [prefectures, setPrefectures] =
    useState<PrefectureAPI['response']['result']>();
  const [populationData, setPopulationData] = useState<{
    [key: number]: PopulationAPI['response']['result'];
  }>();

  const [checkBoxStatus, setCheckBoxStatus] = useState<checkBoxStatusProps>(
    Object.fromEntries(Array.from({ length: 47 }, (_, i) => [i + 1, false])),
  );
  const [currentChangeCodeStatus, setCurrentChangeCodeStatus] = useState<{
    prefCode: number;
    status: boolean;
  }>();

  const [currentDisplayData, setCurrentDisplayData] =
    useState<PopulationType>('総人口');

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
    setPopulationData((prev) => ({ ...prev, [prefCode]: res.result }));
  };

  const changePopulationData = async (prefCode: number) => {
    // console.log('changePopulationData', prefCode);
    // console.log('checkBoxStatus', checkBoxStatus[prefCode]);
    if (checkBoxStatus[prefCode]) {
      fetchPopulation(prefCode);
    } else {
      setPopulationData((prev) => {
        const { [prefCode]: _, ...rest } = prev || {};
        return rest;
      });
    }
  };

  useEffect(() => {
    fetchPrefectures();
  }, []);

  useEffect(() => {
    // console.log('currentChangeCodeStatus', currentChangeCodeStatus);
    if (currentChangeCodeStatus === undefined) return;
    changePopulationData(currentChangeCodeStatus.prefCode);
    // console.log('currentData', currentData);
  }, [currentChangeCodeStatus]);

  const currentData = useMemo(() => {
    if (populationData === undefined) return [];

    const formatted: { [year: number]: any } = {};

    for (const [prefCode, prefData] of Object.entries(populationData)) {
      const totalPopulationData =
        prefData.data.find((d) => d.label === currentDisplayData)?.data || [];

      for (const { year, value } of totalPopulationData) {
        if (!formatted[year]) formatted[year] = { name: year.toString() };
        formatted[year][`pref_${prefCode}`] = value;
      }
    }

    return Object.values(formatted); // recharts用に配列に変換
  }, [populationData, currentDisplayData]);

  const lineKeys = useMemo(() => {
    if (currentData.length === 0) return [];
    return Object.keys(currentData[0]).filter((key) => key !== 'name');
  }, [currentData]);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex-grow">
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
                  onChange={() => {
                    setCurrentChangeCodeStatus({
                      prefCode,
                      status: !checkBoxStatus[prefCode],
                    });
                    setCheckBoxStatus((prev) => ({
                      ...prev,
                      [prefCode]: !prev[prefCode],
                    }));
                  }}
                />
                {prefName}
              </label>
            </div>
          );
        })}
      </div>
      <div className="gap-2 flex flex-row items-center justify-center">
        <button
          onClick={() => setCurrentDisplayData('総人口')}
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          総人口
        </button>

        <button
          onClick={() => setCurrentDisplayData('年少人口')}
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          年少人口
        </button>

        <button
          onClick={() => setCurrentDisplayData('生産年齢人口')}
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          生産年齢人口
        </button>

        <button
          onClick={() => setCurrentDisplayData('老年人口')}
          className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          老年人口
        </button>
      </div>
      <div>{currentDisplayData}</div>
      <div className="size-auto mt-8">
        {currentData.length > 0 ? (
          <LineChart
            width={800}
            height={500}
            data={currentData}
            margin={{ right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineKeys.map((key, index) => (
              <Line
                key={key}
                dataKey={key}
                stroke={colors[index % colors.length]}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-2xl text-center">
              チェックボックスを選択してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
