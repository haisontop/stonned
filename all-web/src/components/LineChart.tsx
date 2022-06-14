import React from 'react'
import { Box } from '@chakra-ui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  
} from 'chart.js'
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface LineProps {
  times: (number | Date)[]
  values: number[]
  graphLabel: string
  stepSize: number
}

export default function LineChart({ times, values, graphLabel, stepSize }: LineProps) {
  return (
    <Box width='100%'>
      <Line
        datasetIdKey='puffPrice'
        data={{
          labels: times,
          datasets: [
            {
              label: graphLabel,
              data: values,
              borderWidth: 1,
              pointRadius: 0,
              borderColor: '#4CE091'
            },
          ],
        }}
        options={{
          responsive: true,
          layout: {
            padding: 10,
          },
          interaction: {
            intersect: false
          },
          plugins: {
            legend: {display: false}
          },
          scales: {
            y: {
              ticks: {
                format: {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 4,
                }
              }
            },
            x: {
              grid: {
                drawOnChartArea: false
              },
              type: 'time',
              time: {
                unit: 'day',
                stepSize
              }
            }
          }

        }}
      />
    </Box>
  )
}
