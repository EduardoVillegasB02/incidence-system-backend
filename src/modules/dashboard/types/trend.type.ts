export type Trend = {
  totalAssigned: number;
  totalFinished: number;
  days: Array<{
    date: string;
    assigned: number;
    finished: number;
    crimen: Record<string, number>;
    hours: Array<{
      hour: number;
      assigned: number;
      finished: number;
      crimen: Record<string, number>;
    }>;
  }>;
};
