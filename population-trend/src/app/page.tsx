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
    if (currentChangeCodeStatus === undefined) return;
    changePopulationData(currentChangeCodeStatus.prefCode);
  }, [currentChangeCodeStatus]);

  const currentData = useMemo(() => {
    if (populationData === undefined) return [];
    if (prefectures === undefined) return [];

    const formatted: { [year: number]: any } = {};

    for (const [prefCode, prefData] of Object.entries(populationData)) {
      const totalPopulationData =
        prefData.data.find((d) => d.label === currentDisplayData)?.data || [];

      for (const { year, value } of totalPopulationData) {
        if (!formatted[year]) formatted[year] = { name: year.toString() };
        formatted[year][
          prefectures.find(
            (prefecture) => prefecture.prefCode == Number(prefCode),
          )?.prefName!
        ] = value;
      }
    }

    return Object.values(formatted); // recharts用に配列に変換
  }, [populationData, currentDisplayData]);

  const lineKeys = useMemo(() => {
    if (currentData.length === 0) return [];
    return Object.keys(currentData[0]).filter((key) => key !== 'name');
  }, [currentData]);

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-bold text-center py-4 w-full bg-gray-300 ">
        都道府県別人口推移グラフ
      </h1>
      <div className="items-center justify-items-center min-h-screen w-full px-4 font-[family-name:var(--font-geist-sans)] flex-grow">
        <div className="checkbox-container">
          {prefectures?.map((prefecture) => {
            const prefCode = prefecture.prefCode;
            const prefName = prefecture.prefName;
            return (
              <div key={prefCode} className="checkbox-base">
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
        <div className="btn-wrapper">
          <button
            onClick={() => setCurrentDisplayData('総人口')}
            className={`btn-base ${currentDisplayData === '総人口' ? 'bg-gray-300' : ''}`}
          >
            総人口
          </button>

          <button
            onClick={() => setCurrentDisplayData('年少人口')}
            className={`btn-base ${currentDisplayData === '年少人口' ? 'bg-gray-300' : ''}`}
          >
            年少人口
          </button>
          <button
            onClick={() => setCurrentDisplayData('生産年齢人口')}
            className={`btn-base ${currentDisplayData === '生産年齢人口' ? 'bg-gray-300' : ''}`}
          >
            生産年齢人口
          </button>

          <button
            onClick={() => setCurrentDisplayData('老年人口')}
            className={`btn-base ${currentDisplayData === '老年人口' ? 'bg-gray-300' : ''}`}
          >
            老年人口
          </button>
        </div>
        <div className="font-bold text-2xl my-8">{currentDisplayData}</div>
        <div className="graph-container">
          {currentData.length > 0 ? (
            <div className="w-full max-w-4xl mx-auto px-2">
              {/* Y軸ラベルとグラフ */}
              <div className="flex items-start mb-2">
                <div
                  className="text-sm text-center leading-tight"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                  }}
                >
                  人口数（万人）
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={currentData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      width={35}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => (value / 10000).toString()}
                    />
                    <Tooltip />
                    {lineKeys.map((key, index) => (
                      <Line
                        key={key}
                        dataKey={key}
                        stroke={
                          colors[
                            prefectures!.findIndex(
                              (pref) => pref.prefName === key,
                            )
                          ]
                        }
                        isAnimationActive={false}
                        dot={true}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* X軸ラベル */}
              <div className="text-sm text-right -mt-3">年</div>

              {/* 凡例 */}
              <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
                {lineKeys.map((key) => (
                  <div key={key} className="flex items-center gap-1">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor:
                          colors[
                            prefectures!.findIndex(
                              (pref) => pref.prefName === key,
                            )
                          ],
                      }}
                    />
                    <span>{key}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-2xl text-center">
                チェックボックスを選択してください
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
