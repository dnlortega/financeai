"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { TimeEvolutionData } from "@/app/_data/get-time-evolution";
import { ChartContainer, ChartTooltipContent } from "@/app/_components/ui/chart";

interface TimeEvolutionChartProps {
  data: TimeEvolutionData[];
}

const TimeEvolutionChart = ({ data }: TimeEvolutionChartProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-bold">Evolução Mensal</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            deposits: {
              label: "Depósitos",
              color: "#55B02E",
            },
            expenses: {
              label: "Despesas",
              color: "#E93939",
            },
            investments: {
              label: "Investimentos",
              color: "#FFFFFF",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#55B02E"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#E93939"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="investments"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TimeEvolutionChart;
