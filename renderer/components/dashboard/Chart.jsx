import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { createStyles, Text, Box } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  chart: {
    flex: 4,
    WebkitBoxShadow: "2px 4px 10px 1px rgba(0, 0, 0, 0.47)",
    boxShadow: "2px 4px 10px 1px rgba(201, 201, 201, 0.47)",
    padding: 10,
    color: "gray",
  },
  title: {
    marginBottom: "20px",
  },
  chartGrid: {
    stroke: "rgb(228, 225, 225)",
  },
}));

const data = [
  { name: "January", Total: 1200 },
  { name: "February", Total: 2100 },
  { name: "March", Total: 0 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 900 },
  { name: "June", Total: 1700 },
];

const Chart = () => {
  const { classes } = useStyles();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return null when rendering on the server
  }

  return (
    <Box mt="md" className={classes.chart}>
      <Text className={classes.title}>Revenue earned</Text>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#47d6ab" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#47d6ab" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid
            strokeDasharray="3 3"
            className={classes.chartGrid}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#47d6ab"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
