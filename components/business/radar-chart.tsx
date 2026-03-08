import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';

interface RadarAxis {
  label: string;
  baseValue: number;
  dynamicValue: number;
  higherIsBetter?: boolean;
}

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
  baseColor?: string;
  dynamicColor?: string;
  baseLabel?: string;
  dynamicLabel?: string;
}

function normalize(value: number, max: number, higherIsBetter = true): number {
  if (max === 0) return 0;
  const ratio = Math.min(Math.abs(value) / Math.abs(max), 1);
  return higherIsBetter ? ratio : 1 - ratio;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleRad: number,
): [number, number] {
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)];
}

export function RadarChart({
  axes,
  size = 220,
  baseColor = '#64748b',
  dynamicColor = '#00C0D4',
  baseLabel = 'Base',
  dynamicLabel = 'Dynamic',
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 36; // leave room for labels
  const n = axes.length;
  const levels = 4;

  // Compute max value per axis (considering both scenarios)
  const maxValues = axes.map((a) =>
    Math.max(Math.abs(a.baseValue), Math.abs(a.dynamicValue), 0.001),
  );

  // Angle for each axis (starting at top, -90°)
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  // Grid polygon points for a given level (0..levels)
  const gridPoints = (level: number): string => {
    const r = (R * level) / levels;
    return Array.from({ length: n }, (_, i) => {
      const [x, y] = polarToCartesian(cx, cy, r, angle(i));
      return `${x},${y}`;
    }).join(' ');
  };

  // Data polygon points
  const dataPoints = (which: 'base' | 'dynamic'): string =>
    axes
      .map((a, i) => {
        const raw = which === 'base' ? a.baseValue : a.dynamicValue;
        const norm = normalize(raw, maxValues[i], a.higherIsBetter !== false);
        const r = R * norm;
        const [x, y] = polarToCartesian(cx, cy, r, angle(i));
        return `${x},${y}`;
      })
      .join(' ');

  // Label offset
  const labelOffset = 18;

  return (
    <View>
      <Svg width={size} height={size}>
        {/* Grid levels */}
        {Array.from({ length: levels }, (_, lvl) => (
          <Polygon
            key={`grid-${lvl}`}
            points={gridPoints(lvl + 1)}
            fill="none"
            stroke="#334155"
            strokeWidth={0.8}
            opacity={0.6}
          />
        ))}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const [x, y] = polarToCartesian(cx, cy, R, angle(i));
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth={0.8}
              opacity={0.6}
            />
          );
        })}

        {/* Base polygon */}
        <Polygon
          points={dataPoints('base')}
          fill={baseColor}
          fillOpacity={0.15}
          stroke={baseColor}
          strokeWidth={1.5}
        />

        {/* Dynamic polygon */}
        <Polygon
          points={dataPoints('dynamic')}
          fill={dynamicColor}
          fillOpacity={0.2}
          stroke={dynamicColor}
          strokeWidth={2}
        />

        {/* Data dots - dynamic */}
        {axes.map((a, i) => {
          const raw = a.dynamicValue;
          const norm = normalize(raw, maxValues[i], a.higherIsBetter !== false);
          const r = R * norm;
          const [x, y] = polarToCartesian(cx, cy, r, angle(i));
          return (
            <Circle key={`dot-dyn-${i}`} cx={x} cy={y} r={3} fill={dynamicColor} />
          );
        })}

        {/* Axis labels */}
        {axes.map((a, i) => {
          const ang = angle(i);
          const [lx, ly] = polarToCartesian(cx, cy, R + labelOffset, ang);
          const textAnchor =
            Math.abs(lx - cx) < 5 ? 'middle' : lx < cx ? 'end' : 'start';
          return (
            <SvgText
              key={`label-${i}`}
              x={lx}
              y={ly + 4}
              fontSize={10}
              fill="#94a3b8"
              textAnchor={textAnchor}
            >
              {a.label}
            </SvgText>
          );
        })}
      </Svg>

      {/* Legend */}
      <View className="flex-row gap-4 justify-center mt-2">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: baseColor, opacity: 0.8 }} />
          <Text className="text-xs text-muted">{baseLabel}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: dynamicColor }} />
          <Text className="text-xs text-muted">{dynamicLabel}</Text>
        </View>
      </View>
    </View>
  );
}
