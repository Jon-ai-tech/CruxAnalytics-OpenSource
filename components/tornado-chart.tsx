import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import {
  generateTornadoChartData,
  formatSensitivityValue,
  getVariableNameES,
  type TornadoChartData,
} from '@/lib/sensitivity-calculator';
import type { ProjectData } from '@/types/project';

interface TornadoChartProps {
  project: ProjectData;
}

export function TornadoChart({ project }: TornadoChartProps) {
  const { t, language } = useTranslation();
  const colors = useColors();

  const data = generateTornadoChartData(project);

  // Find max absolute value for scaling
  const maxAbsValue = Math.max(
    ...data.map((d) => Math.max(Math.abs(d.negativeImpact), Math.abs(d.positiveImpact)))
  );

  const getVariableLabel = (item: TornadoChartData): string => {
    return language === 'es' ? getVariableNameES(item.variable) : item.variableName;
  };

  const getBarWidth = (value: number): number => {
    return (Math.abs(value) / maxAbsValue) * 100;
  };

  const variableColors = [
    '#0a7ea4', // Primary blue
    '#22C55E', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
  ];

  return (
    <View className="bg-surface/80 glass dark:glass-dark rounded-xl border border-border p-4">
      <Text className="text-lg font-bold text-foreground mb-2 font-heading-medium">
        {t('sensitivity.tornado_title')}
      </Text>
      <Text className="text-xs text-muted mb-4 font-body">
        {t('sensitivity.tornado_description')}
      </Text>

      <View className="gap-4">
        {data.map((item, index) => {
          const negativeWidth = getBarWidth(item.negativeImpact);
          const positiveWidth = getBarWidth(item.positiveImpact);
          const barColor = variableColors[index % variableColors.length];

          return (
            <View key={item.variable}>
              {/* Variable Label */}
              <Text className="text-sm font-semibold text-foreground mb-2">
                {getVariableLabel(item)}
              </Text>

              {/* Tornado Bar */}
              <View className="flex-row items-center">
                {/* Negative Side (Left) */}
                <View className="flex-1 flex-row justify-end items-center pr-2">
                  <Text className="text-xs text-muted mr-2">
                    {formatSensitivityValue(item.negativeImpact, 'currency')}
                  </Text>
                  <View
                    className="h-8 rounded-l"
                    style={{
                      width: `${negativeWidth}%`,
                      backgroundColor: `${barColor}80`, // 50% opacity
                    }}
                  />
                </View>

                {/* Center Line */}
                <View className="w-0.5 h-10" style={{ backgroundColor: colors.border }} />

                {/* Positive Side (Right) */}
                <View className="flex-1 flex-row items-center pl-2">
                  <View
                    className="h-8 rounded-r"
                    style={{
                      width: `${positiveWidth}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  <Text className="text-xs text-muted ml-2">
                    {formatSensitivityValue(item.positiveImpact, 'currency')}
                  </Text>
                </View>
              </View>

              {/* Range Label */}
              <Text className="text-xs text-muted text-center mt-1">
                {t('sensitivity.range')}: {formatSensitivityValue(item.range, 'currency')}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="mt-4 pt-4 border-t border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded" style={{ backgroundColor: `${variableColors[0]}80` }} />
            <Text className="text-xs text-muted">{t('sensitivity.negative_variation')}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded" style={{ backgroundColor: variableColors[0] }} />
            <Text className="text-xs text-muted">{t('sensitivity.positive_variation')}</Text>
          </View>
        </View>
        <Text className="text-xs text-muted text-center mt-2">
          {t('sensitivity.variation_note')}
        </Text>
      </View>
    </View>
  );
}
