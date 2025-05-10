export type Prefecture = {
  prefCode: number;
  prefName: string;
};

export interface PrefectureAPI {
  response: {
    message: string | null;
    result: Prefecture[];
  };
}

export const populationTypes = [
  { label: '総人口', value: 'total' },
  { label: '年少人口', value: 'young' },
  { label: '生産年齢人口', value: 'working' },
  { label: '老年人口', value: 'old' },
] as const;

export type PopulationType = (typeof populationTypes)[number]['label'];

export type PopulationData = {
  year: number;
  value: number;
  rate?: number;
};

export interface PopulationAPI {
  request: {
    prefCode: number;
  };
  response: {
    message: string | null;
    result: {
      boundaryYear: number;
      data: Array<{
        label: PopulationType;
        data: PopulationData[];
      }>;
    };
  };
}
