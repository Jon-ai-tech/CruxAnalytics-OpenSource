import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText, G } from 'react-native-svg';

import { useTranslation } from '@/lib/i18n-context';
import type { BreakEvenData } from '@/lib/break-even-calculator';

interface BreakEvenChartProps {
  data: BreakEvenData;
}

export function BreakEvenChart({ data }: BreakEvenChartProps) {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth - 48, 600); // Min 600px for scrolling
  const chartHeight = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Find max value for Y axis
  const maxRevenue = Math.max(...data.cumulativeRevenue);
  const maxCosts = Math.max(...data.cumulativeCosts);
  const maxValue = Math.max(maxRevenue, maxCosts);
  const yMax = Math.ceil(maxValue / 10000) * 10000; // Round up to nearest 10k

  // Scale functions
  const scaleX = (month: number) => {
    return padding.left + (month / data.months.length) * plotWidth;
  };

  const scaleY = (value: number) => {
    return padding.top + plotHeight - (value / yMax) * plotHeight;
  };

  // Generate path for revenue line
  const revenuePath = data.cumulativeRevenue
    .map((value, index) => {
      const x = scaleX(index);
      const y = scaleY(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate path for costs line
  const costsPath = data.cumulativeCosts
    .map((value, index) => {
      const x = scaleX(index);
      const y = scaleY(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 6 }, (_, i) => (yMax / 5) * i);

  // X-axis labels (show every 12 months)
  const xTicks = data.months.filter((m) => m % 12 === 0 || m === 1);

  // Break-even point coordinates
  const breakEvenX = data.breakEvenPoint.achieved
    ? scaleX(data.breakEvenPoint.month - 1)
    : -1;
  const breakEvenY = data.breakEvenPoint.achieved
    ? scaleY(data.breakEvenPoint.amount)
    : -1;

  return (
    <View className="bg-surface/80 glass dark:glass-dark rounded-xl border border-border p-4">
      <Text className="text-lg font-bold text-foreground mb-4 font-heading-medium">
        {t('break_even.chart_title')}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {yTicks.map((tick) => {
            const y = scaleY(tick);
            return (
              <Line
                key={`grid-${tick}`}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Y-axis */}
          <Line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="#333"
            strokeWidth="2"
          />

          {/* X-axis */}
          <Line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="#333"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {yTicks.map((tick) => {
            const y = scaleY(tick);
            return (
              <SvgText
                key={`y-label-${tick}`}
                x={padding.left - 10}
                y={y + 4}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                ${(tick / 1000).toFixed(0)}k
              </SvgText>
            );
          })}

          {/* X-axis labels */}
          {xTicks.map((month) => {
            const x = scaleX(data.months.indexOf(month));
            return (
              <SvgText
                key={`x-label-${month}`}
                x={x}
                y={chartHeight - padding.bottom + 20}
                fontSize="10"
                fill="#666"
                textAnchor="middle"
              >
                {month}
              </SvgText>
            );
          })}

          {/* X-axis title */}
          <SvgText
            x={padding.left + plotWidth / 2}
            y={chartHeight - 5}
            fontSize="12"
            fill="#333"
            textAnchor="middle"
            fontWeight="600"
          >
            {t('break_even.months')}
          </SvgText>

          {/* Y-axis title */}
          <SvgText
            x={15}
            y={padding.top + plotHeight / 2}
            fontSize="12"
            fill="#333"
            textAnchor="middle"
            fontWeight="600"
            transform={`rotate(-90, 15, ${padding.top + plotHeight / 2})`}
          >
            {t('break_even.amount_usd')}
          </SvgText>

          {/* Costs line (red) */}
          <Path d={costsPath} stroke="#EF4444" strokeWidth="3" fill="none" />

          {/* Revenue line (green) */}
          <Path d={revenuePath} stroke="#22C55E" strokeWidth="3" fill="none" />

          {/* Break-even point */}
          {data.breakEvenPoint.achieved && (
            <G>
              {/* Vertical dashed line */}
              <Line
                x1={breakEvenX}
                y1={padding.top}
                x2={breakEvenX}
                y2={chartHeight - padding.bottom}
                stroke="#0a7ea4"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Circle marker */}
              <Circle cx={breakEvenX} cy={breakEvenY} r="6" fill="#0a7ea4" />
              <Circle cx={breakEvenX} cy={breakEvenY} r="4" fill="white" />

              {/* Label */}
              <SvgText
                x={breakEvenX}
                y={padding.top - 5}
                fontSize="11"
                fill="#0a7ea4"
                textAnchor="middle"
                fontWeight="700"
              >
                {t('break_even.break_even_point')}
              </SvgText>
            </G>
          )}
        </Svg>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mt-4">
        <View className="flex-row items-center gap-2">
          <View className="w-6 h-1 bg-success" />
          <Text className="text-xs text-foreground font-body">{t('break_even.cumulative_revenue')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-6 h-1 bg-error" />
          <Text className="text-xs text-foreground font-body">{t('break_even.cumulative_costs')}</Text>
        </View>
      </View>

      {/* Description */}
      <View className="bg-background rounded-lg p-3 mt-4">
        <Text className="text-xs text-muted leading-relaxed font-body">
          {t('break_even.chart_description')}
        </Text>
      </View>
    </View>
  );
}
