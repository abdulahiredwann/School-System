import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Exam {
  midExam1: number;
  midExam2: number;
  finalExam: number;
}

interface Subject {
  _id: string;
  subjectName: string;
}

interface Results {
  exams: Exam;
  subject: Subject;
}

interface ProgressChartProps {
  results: Results[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ results }) => {
  const labels = results.map((result) => result.subject.subjectName);
  const midExam1Data = results.map((result) => result.exams.midExam1);
  const midExam2Data = results.map((result) => result.exams.midExam2);
  const finalExamData = results.map((result) => result.exams.finalExam);

  const data = {
    labels,
    datasets: [
      {
        label: "Mid Exam 1",
        data: midExam1Data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Mid Exam 2",
        data: midExam2Data,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Final Exam",
        data: finalExamData,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Student Progress",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProgressChart;
