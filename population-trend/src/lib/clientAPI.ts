// src/lib/clientAPI.ts
import type { PrefectureAPI, PopulationAPI } from '@/../types/api';

export const fetchPrefectures = async (): Promise<
  PrefectureAPI['response'] | Error
> => {
  try {
    const res = await fetch('/api/prefectures');
    if (!res.ok) throw new Error('Failed to fetch prefectures');
    return await res.json();
  } catch (err: any) {
    return new Error(err.message || 'Unknown error');
  }
};

export const fetchPopulation = async (
  prefCode: number,
): Promise<PopulationAPI['response'] | Error> => {
  try {
    const res = await fetch(`/api/population?prefCode=${prefCode}`);
    if (!res.ok) throw new Error('Failed to fetch population');
    return await res.json();
  } catch (err: any) {
    return new Error(err.message || 'Unknown error');
  }
};
