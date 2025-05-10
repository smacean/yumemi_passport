import { PrefectureAPI } from '../../types/api';
import { PopulationAPI } from '../../types/api';

export const getPrefectures = async (): Promise<PrefectureAPI['response']> => {
  try {
    if (!process.env.NEXT_PUBLIC_X_API_KEY) {
      throw new Error('API key is not defined');
    }
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL is not defined');
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/v1/prefectures',
      {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY,
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching prefectures:', error);
    throw new Error('Failed to fetch prefectures');
  }
};

export const getPopulation = async (
  request: PopulationAPI['request'],
): Promise<PopulationAPI['response']> => {
  try {
    if (!process.env.NEXT_PUBLIC_X_API_KEY) {
      throw new Error('API key is not defined');
    }
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL is not defined');
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/population/composition/perYear?prefCode=${request.prefCode}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY,
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching population:', error);
    throw new Error('Failed to fetch population data');
  }
};
