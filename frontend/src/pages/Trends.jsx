import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getLastTenDays = () => {
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
};

export default function Trends() {
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse] = await Promise.all([axios.get("/backend/naukri")]);

        const jobsData = jobsResponse.data.map(item => ({
          ...item,
          date: formatDate(new Date(item.time)),
        }));

        const lastTenDays = getLastTenDays();

        const jobsCountPerDay = lastTenDays.map(day =>
          jobsData.filter(job => job.date === day).length
        );

        setBarChartData({
          labels: lastTenDays,
          datasets: [{
            label: 'Jobs posted in the last 10 days',
            data: jobsCountPerDay,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          }]
        });

        setLineChartData({
          labels: lastTenDays,
          datasets: [{
            label: 'Jobs posted in the last 10 days',
            data: jobsCountPerDay,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.4,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const config = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Job Trends Over the Last 10 Days</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05, zIndex: 1, transition: { duration: 0.3 } }}
          className="p-8 bg-white shadow-lg rounded-lg h-96 transform transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-center font-bold text-xl mb-4 text-gray-700">Jobs posted in the last 10 days (Bar Chart)</h2>
          <Bar data={barChartData} options={config} />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05, zIndex: 1, transition: { duration: 0.3 } }}
          className="p-8 bg-white shadow-lg rounded-lg h-96 transform transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-center font-bold text-xl mb-4 text-gray-700">Jobs posted in the last 10 days (Line Chart)</h2>
          <Line data={lineChartData} options={config} />
        </motion.div>
      </div>
      <motion.footer
        className="mt-8 text-center text-gray-600"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>&copy; {new Date().getFullYear()} TrendingJobs4All. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
}