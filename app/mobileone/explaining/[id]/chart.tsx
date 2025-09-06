"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

interface CustomTickProps {
  x?: number
  y?: number
  payload: { value: string }
}

export const description = "A stacked horizontal bar chart"




const chartData = [
  { summation: "Oil prices", excerpt: "Talk to use about oil...", interviewer: 186, guest: 880 },
  { summation: "Recession odds", excerpt: "What are the odds of a recession...", interviewer: 78, guest: 553 },
  { summation: "Inflation", excerpt: "Can you talk about recent inflation trends...", interviewer: 212, guest: 675 },
  { summation: "Tech stocks", excerpt: "What's your outlook on the tech sector...", interviewer: 155, guest: 489 },
  { summation: "Federal Reserve", excerpt: "How will the Fed's next meeting affect...", interviewer: 94, guest: 310 },
]


// --- calculate averages ---
const avgInterviewer =
  chartData.reduce((sum, d) => sum + d.interviewer, 0) / chartData.length;
const avgGuest =
  chartData.reduce((sum, d) => sum + d.guest, 0) / chartData.length;


const chartConfig = {
  interviewer: {
    label: "Interviewer",
    color: "var(--chart-1)",
  },
  guest: {
    label: "Guest",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Pick a random item from chartData
const randomItem = chartData[Math.floor(Math.random() * chartData.length)];
const summationMatch = randomItem.summation;

// Compare guest value vs guest mean
const guestDifferencePct = ((randomItem.guest - avgGuest) / avgGuest) * 100;

const guestDiffText = `Guest response to the question is ${guestDifferencePct.toFixed(
  2
)}% ${guestDifferencePct >= 0 ? "above" : "below"} the average.`;


// Custom Y-Axis Tick Component
const CustomYAxisTick = ({ x = 0, y = 0, payload }: CustomTickProps) => {
  const isMatch = payload?.value === summationMatch
  const fontWeight = isMatch ? "bold" : "normal"
  const fill = isMatch ? "#000" : "#888"

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={-5}
        dy={4}
        textAnchor="end"
        fill={fill}
        fontWeight={fontWeight}
      >
        {payload.value}
      </text>
    </g>
  );
};

export function ChartBarHorizontal() {
  return (
    <>
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="summation"
          type="category"
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          interval={0}
          tick={CustomYAxisTick} // Use the custom component here
          width={150} // Adjust width to prevent long labels from being cut off
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {/* Stacked bars */}
        <Bar
          dataKey="interviewer"
          stackId="visitors"
          fill="var(--color-interviewer)"
          radius={[0, 5, 5, 0]}
        />
        <Bar
          dataKey="guest"
          stackId="visitors"
          fill="var(--color-guest)"
          radius={[0, 5, 5, 0]}
        />
      </BarChart>
    </ChartContainer>
    <div className="pt-2">{guestDiffText}</div>
    </>

  )
}
export default ChartBarHorizontal