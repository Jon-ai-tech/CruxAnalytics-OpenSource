import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import {
  calculateMultiVariableSensitivity,
  formatSensitivityValue,
  getVariableNameES,
  type SensitivityVariable,
  type SensitivityResult,
} from '@/lib/sensitivity-calculator';
import type { ProjectData } from '@/types/project';

interface SensitivityMatrixProps {
  project: ProjectData;
  metric: 'npv' | 'roi';
}

export function SensitivityMatrix({ project, metric }: SensitivityMatrixProps) {
  const { t, language } = useTranslation();
  const colors = useColors();

  const variations = [-30, -20, -10, 0, 10, 20, 30];
  const results = calculateMultiVariableSensitivity(project, variations);

  const variables: SensitivityVariable[] = [
    'initialInvestment',
    'yearlyRevenue',
    'operatingCosts',
    'maintenanceCosts',
  ];

  const getVariableLabel = (variable: SensitivityVariable): string => {
    return t(`sensitivity.${variable}`);
  };

  const getValue = (result: SensitivityResult): number => {
    return metric === 'npv' ? result.npv : result.roi;
  };

  const getBaseValue = (): number => {
    const baseResult = results.initialInvestment.find((r) => r.variation === 0);
    return baseResult ? getValue(baseResult) : 0;
  };

  const baseValue = getBaseValue();

  const getCellColor = (value: number): string => {
    if (metric === 'npv') {
      const change = ((value - baseValue) / Math.abs(baseValue)) * 100;
      if (change > 10) return '#22C55E20'; // Green with opacity
      if (change < -10) return '#EF444420'; // Red with opacity
      return '#F59E0B20'; // Yellow with opacity
    } else {
      // ROI
      if (value > baseValue + 5) return '#22C55E20';
      if (value < baseValue - 5) return '#EF444420';
      return '#F59E0B20';
    }
  };

  const getTextColor = (value: number): string => {
    if (metric === 'npv') {
      const change = ((value - baseValue) / Math.abs(baseValue)) * 100;
      if (change > 10) return '#22C55E';
      if (change < -10) return '#EF4444';
      return '#F59E0B';
    } else {
      if (value > baseValue + 5) return '#22C55E';
      if (value < baseValue - 5) return '#EF4444';
      return '#F59E0B';
    }
  };

  return (
    <View className="bg-surface rounded-xl border border-border p-4">
      <Text className="text-lg font-bold text-foreground mb-4">
        {t('sensitivity.matrix_title')} - {metric === 'npv' ? t('results.npv') : t('results.roi')}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row */}
          <View className="flex-row mb-2">
            <View className="w-32 justify-center pr-2">
              <Text className="text-xs font-semibold text-muted">
                {t('sensitivity.variable')}
              </Text>
            </View>
            {variations.map((variation) => (
              <View
                key={variation}
                className="w-20 items-center justify-center px-1"
              >
                <Text
                  className={`text-xs font-semibold ${variation === 0 ? 'text-primary' : 'text-muted'
                    }`}
                >
                  {variation > 0 ? '+' : ''}
                  {variation}%
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {variables.map((variable) => (
            <View key={variable} className="flex-row mb-2">
              <View className="w-32 justify-center pr-2">
                <Text className="text-xs font-medium text-foreground">
                  {getVariableLabel(variable)}
                </Text>
              </View>
              {results[variable].map((result) => {
                const value = getValue(result);
                const isBase = result.variation === 0;
                const bgColor = getCellColor(value);
                const textColor = getTextColor(value);

                return (
                  <View
                    key={result.variation}
                    className={`w-20 items-center justify-center px-1 py-2 rounded ${isBase ? 'border-2' : 'border'
                      }`}
                    style={{
                      backgroundColor: bgColor,
                      borderColor: isBase ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: isBase ? colors.primary : textColor }}
                    >
                      {formatSensitivityValue(
                        value,
                        metric === 'npv' ? 'currency' : 'percentage'
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="flex-row items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-4 rounded" style={{ backgroundColor: '#22C55E20' }} />
          <Text className="text-xs text-muted">{t('sensitivity.positive')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B20' }} />
          <Text className="text-xs text-muted">{t('sensitivity.neutral')}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-4 rounded" style={{ backgroundColor: '#EF444420' }} />
          <Text className="text-xs text-muted">{t('sensitivity.negative')}</Text>
        </View>
      </View>
    </View>
  );
}
