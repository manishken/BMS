import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ['Action', 'Romance', 'Horror', 'Thriller', 'Adventure', 'History'],
  datasets: [
    {
      label: 'Genre Preference',
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: 'rgba(125, 40, 120, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

export function AdminRadar() {
  return <Radar data={data} />;
}
