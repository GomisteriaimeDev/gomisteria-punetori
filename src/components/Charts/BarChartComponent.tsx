import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getEmployeeOrdersByWeek } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}: ${payload[0].value.toLocaleString()} orders`}</p>
      </div>
    );
  }

  return null;
};

const BarChartComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const result = await getEmployeeOrdersByWeek(currentUser?.id);
      if (result) {
        const formattedData = result.map((item: any, index: number) => {
          const weekRange = `${new Date(item.weekStart).toLocaleDateString()}`;
          let color = "#B1E3FF";
          switch (index) {
            case 0:
              color = "#BAEDBD";
              break;
            case 1:
              color = "#C6C7F8";
              break;
            case 2:
              color = "#B1E3FF";
              break;
            case 3:
              color = "#B1E3FF";
              break;
            default:
              break;
          }
          return {
            name: weekRange,
            value: item.completedOrders,
            color: color,
          };
        });
        setData(formattedData);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 24, right: 30, left: 0, bottom: 0 }}
        barSize={23}
        barCategoryGap="20%"
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
