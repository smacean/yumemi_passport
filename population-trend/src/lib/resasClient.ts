import { PrefectureAPI, PopulationAPI } from '../../types/api';

const API_URL = process.env.API_URL!;
const API_KEY = process.env.X_API_KEY!;

export const getPrefectures = async (): Promise<PrefectureAPI['response']> => {
  const res = await fetch(`${API_URL}/api/v1/prefectures`, {
    headers: { 'X-API-KEY': API_KEY },
  });
  if (!res.ok) throw new Error('Failed to fetch prefectures');
  return res.json();
};

export const getPopulation = async (
  req: PopulationAPI['request'],
): Promise<PopulationAPI['response']> => {
  const res = await fetch(
    `${API_URL}/api/v1/population/composition/perYear?prefCode=${req.prefCode}`,
    {
      headers: { 'X-API-KEY': API_KEY },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch population');
  return res.json();
};
