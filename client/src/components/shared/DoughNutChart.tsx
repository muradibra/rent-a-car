import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData } from "chart.js";
import { Location, Rent } from "@/types";

ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

const RentDoughnutChart = ({
  rents,
  locations,
  className,
  content,
}: {
  rents: Rent[];
  locations: Location[];
  className?: string;
  content: string;
}) => {
  const [chartData, setChartData] = useState<ChartData<"doughnut"> | null>(
    null
  );

  useEffect(() => {
    const filteredLocations = locations.filter((location) =>
      rents.some((rent) =>
        rent.pickUpLocations.map((loc) => loc._id).includes(location._id)
      )
    );

    const labels = filteredLocations.map((location) => location.title);
    const prices = filteredLocations.map(
      (location) =>
        rents.filter((rent) =>
          rent.pickUpLocations.map((loc) => loc._id).includes(location._id)
        ).length
    );
    const colors = filteredLocations.map(
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Rent Count by Pickup Location",
          data: prices,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
    });
  }, [rents, locations]);

  return (
    <div
      className={`${className} flex flex-col gap-4 items-center justify-center`}
    >
      {chartData ? (
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
      <span>{content}</span>
    </div>
  );
};

export default RentDoughnutChart;
