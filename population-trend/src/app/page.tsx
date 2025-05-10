'use client';

import { PopulationAPI, PrefectureAPI } from '@/api/api';
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
  const [currentChangeCode, setCurrentChangeCode] = useState<number>();

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
    if (currentChangeCode === undefined) return;
    changePopulationData(currentChangeCode);
    console.log('currentData', currentData);
  }, [currentChangeCode]);

  const currentData = useMemo(() => {
    if (populationData === undefined) return [];

    const formatted: { [year: number]: any } = {};

    for (const [prefCode, prefData] of Object.entries(populationData)) {
      const totalPopulationData =
        prefData.data.find((d) => d.label === '総人口')?.data || [];

      for (const { year, value } of totalPopulationData) {
        if (!formatted[year]) formatted[year] = { name: year.toString() };
        formatted[year][`pref_${prefCode}`] = value;
      }
    }

    return Object.values(formatted); // recharts用に配列に変換
  }, [populationData]);

  const lineKeys = useMemo(() => {
    if (currentData.length === 0) return [];
    return Object.keys(currentData[0]).filter((key) => key !== 'name');
  }, [currentData]);

  const colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#ffffff',
    '#000000',
    '#ff7f00',
    '#1f78b4',
    '#33a02c',
    '#6a3d9a',
    '#b15928',
    '#fb9a99',
    '#cab2d6',
    '#ffff99',
    '#b2df8a',
    '#fdbf6f',
    '#a6cee3',
    '#ffb3e6',
    '#c2c2f0',
    '#ff6666',
    '#66ff66',
    '#9999ff',
    '#669999',
    '#ffcc99',
    '#66cccc',
    '#cc99ff',
    '#99cc00',
    '#ff9933',
    '#cc0066',
    '#3366cc',
    '#ff0066',
  ];

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
                    setCurrentChangeCode(prefCode);
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
