import { useEffect, useState } from "react";
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
import { ChartData } from "chart.js";
import { Category, Rent } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RentBarChart = ({
  rents,
  categories,
  className,
}: {
  rents: Rent[];
  categories: Category[];
  className?: string;
}) => {
  const [chartData, setChartData] = useState<ChartData<"bar"> | null>(null);

  useEffect(() => {
    const filteredCategories = categories.filter((category) =>
      rents.some((rent) => rent.category._id === category._id)
    );

    const labels = filteredCategories.map((category) => category.title);
    const prices = filteredCategories.map((category) => {
      const categoryRents = rents.filter(
        (rent) => rent.category._id === category._id
      );
      const total = categoryRents.reduce(
        (sum, rent) => sum + (rent.discountPrice || rent.price),
        0
      );
      return categoryRents.length ? total / categoryRents.length : 0;
    });

    const colors = rents.map(
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Total Rent Price by Category",
          data: prices,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
    });
  }, [rents]);

  return (
    <div className={`${className} h-[100vh]`}>
      {chartData ? (
        <Bar
          height={"360"}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RentBarChart;
