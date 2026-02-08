import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import { getProjectTemplates, type ProjectTemplate } from '@/lib/project-templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const templates = getProjectTemplates();

  const handleSelectTemplate = (template: ProjectTemplate) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSelectTemplate(template);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(t('common.language_code'), {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View className="flex-1">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground mb-2">
          {t('templates.select_template')}
        </Text>
        <Text className="text-base text-muted">
          {t('templates.select_description')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="gap-4">
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              onPress={() => handleSelectTemplate(template)}
              className="bg-surface rounded-xl p-5 border border-border active:opacity-70"
            >
              {/* Header */}
              <View className="flex-row items-center mb-3">
                <Text className="text-4xl mr-3">{template.icon}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    {t(template.nameKey)}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {t(template.descriptionKey)}
                  </Text>
                </View>
              </View>

              {/* Preview Values */}
              {template.id !== 'blank' && (
                <View className="bg-background/50 rounded-lg p-3 mt-2">
                  <View className="flex-row flex-wrap gap-3">
                    <View className="flex-1 min-w-[45%]">
                      <Text className="text-xs text-muted mb-1">
                        {t('form.initial_investment')}
                      </Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {formatCurrency(template.data.initialInvestment)}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%]">
                      <Text className="text-xs text-muted mb-1">
                        {t('form.yearly_revenue')}
                      </Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {formatCurrency(template.data.yearlyRevenue)}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%]">
                      <Text className="text-xs text-muted mb-1">
                        {t('form.monthly_costs')}
                      </Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {formatCurrency(template.data.monthlyCosts)}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-[45%]">
                      <Text className="text-xs text-muted mb-1">
                        {t('form.project_duration')}
                      </Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {template.data.projectDuration} {t('common.months')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
