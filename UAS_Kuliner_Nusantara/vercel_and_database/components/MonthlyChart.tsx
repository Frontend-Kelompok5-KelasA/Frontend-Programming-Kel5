"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const BULAN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
    title: string;
    data: number[]; 
};

export default function MonthlyChart({ title, data }: Props) {
    return (
        <div className="card chart-card p-3">
            <h6 className="chart-title">{title}</h6>
            <Line
                data={{
                    labels: BULAN,
                    datasets: [
                        {
                            data,
                            borderColor: "#ff9800",
                            backgroundColor: "rgba(255, 152, 0, 0.15)",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                        x: { grid: { display: false } },
                    },
                }}
            />
        </div>
    );
}