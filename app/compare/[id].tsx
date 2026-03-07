import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { ScenarioSlider } from '@/components/business/scenario-slider';
import { MetricCard } from '@/components/business/metric-card';
import { ComparisonChart } from '@/components/business/comparison-chart';
import { useTranslation } from '@/lib/i18n-context';
import { getProject, saveScenarioSnapshot } from '@/lib/project-storage';
import { calculateFinancialMetrics } from '@/lib/financial-calculator';
import type { ProjectData, FinancialCalculationResult } from '@/types/project';

export default function CompareScenarioScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  // Adjustment sliders state
  const [salesAdjustment, setSalesAdjustment] = useState(0);
  const [costsAdjustment, setCostsAdjustment] = useState(0);
  const [discountAdjustment, setDiscountAdjustment] = useState(0);

  // Load project
  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const loadedProject = await getProject(id);
      if (loadedProject) {
        setProject(loadedProject);
      } else {
        Alert.alert(t('validations.error'), t('validations.project_not_found'));
        router.back();
      }
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert(t('validations.error'), t('errors.load_failed'));
    } finally {
      setLoading(false);
    }
  };

  // Calculate base scenario (original project)
  const baseScenario: FinancialCalculationResult | null = useMemo(() => {
    if (!project) return null;

    return calculateFinancialMetrics({
      initialInvestment: project.initialInvestment,
      discountRate: project.discountRate,
      projectDuration: project.projectDuration,
      yearlyRevenue: project.yearlyRevenue,
      revenueGrowth: project.revenueGrowth,
      operatingCosts: project.operatingCosts,
      maintenanceCosts: project.maintenanceCosts,
      multiplier: 1,
    });
  }, [project]);

  // Calculate dynamic scenario with adjustments
  const dynamicScenario: FinancialCalculationResult | null = useMemo(() => {
    if (!project) return null;

    // Apply adjustments
    const adjustedRevenue = project.yearlyRevenue * (1 + salesAdjustment / 100);
    const adjustedOperatingCosts = project.operatingCosts * (1 + costsAdjustment / 100);
    const adjustedMaintenanceCosts = project.maintenanceCosts * (1 + costsAdjustment / 100);
    const adjustedDiscountRate = project.discountRate + discountAdjustment;

    return calculateFinancialMetrics({
      initialInvestment: project.initialInvestment,
      discountRate: adjustedDiscountRate,
      projectDuration: project.projectDuration,
      yearlyRevenue: adjustedRevenue,
      revenueGrowth: project.revenueGrowth,
      operatingCosts: adjustedOperatingCosts,
      maintenanceCosts: adjustedMaintenanceCosts,
      multiplier: 1,
    });
  }, [project, salesAdjustment, costsAdjustment, discountAdjustment]);

  // Calculate differences
  const differences = useMemo(() => {
    if (!baseScenario || !dynamicScenario) return null;

    return {
      roiDiff: dynamicScenario.roi - baseScenario.roi,
      npvDiff: dynamicScenario.npv - baseScenario.npv,
      irrDiff: dynamicScenario.irr - baseScenario.irr,
      paybackDiff: dynamicScenario.paybackPeriod - baseScenario.paybackPeriod,
    };
  }, [baseScenario, dynamicScenario]);

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSalesAdjustment(0);
    setCostsAdjustment(0);
    setDiscountAdjustment(0);
  };

  const handleSaveSnapshot = async () => {
    if (!project || !dynamicScenario) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Prompt for snapshot name
      Alert.prompt(
        t('snapshots.save_title'),
        t('snapshots.save_description'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('common.save'),
            onPress: async (name?: string) => {
              if (!name || name.trim() === '') {
                Alert.alert(t('validations.error'), t('snapshots.name_required'));
                return;
              }

              try {
                await saveScenarioSnapshot(project.id, {
                  name: name.trim(),
                  salesAdjustment,
                  costsAdjustment,
                  discountAdjustment,
                  results: {
                    roi: dynamicScenario.roi,
                    npv: dynamicScenario.npv,
                    irr: dynamicScenario.irr,
                    paybackPeriod: dynamicScenario.paybackPeriod,
                    monthlyCashFlow: dynamicScenario.monthlyCashFlow,
                    cumulativeCashFlow: dynamicScenario.cumulativeCashFlow,
                  },
                  isBase: false,
                });

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                  t('common.success'),
                  t('snapshots.saved_successfully'),
                  [
                    {
                      text: t('snapshots.view_history'),
                      onPress: () => router.push(`/snapshots/${project.id}` as any),
                    },
                    {
                      text: t('common.ok'),
                      style: 'cancel',
                    },
                  ]
                );
              } catch (error) {
                console.error('Error saving snapshot:', error);
                Alert.alert(t('validations.error'), t('errors.save_failed'));
              }
            },
          },
        ],
        'plain-text',
        '',
        'default'
      );
    } catch (error) {
      console.error('Error prompting for snapshot name:', error);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted">{t('common.loading')}</Text>
      </ScreenContainer>
    );
  }

  if (!project || !baseScenario || !dynamicScenario || !differences) {
    return (
      <ScreenContainer className="justify-center items-center p-6">
        <Text className="text-foreground text-center">{t('validations.project_not_found')}</Text>
      </ScreenContainer>
    );
  }

  const formatDifference = (value: number, unit: string = '') => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}${unit}`;
  };

  const getDifferenceStatus = (value: number, inverse: boolean = false): 'positive' | 'negative' | 'neutral' => {
    if (Math.abs(value) < 0.01) return 'neutral';
    if (inverse) {
      return value < 0 ? 'positive' : 'negative';
    }
    return value > 0 ? 'positive' : 'negative';
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 active:opacity-70"
          >
            <Text className="text-primary font-semibold">← {t('common.go_back')}</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-foreground mb-2">
            {t('compare.title')}
          </Text>
          <Text className="text-base text-muted">
            {project.name}
          </Text>
        </View>

        {/* Adjustment Sliders */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">
              {t('compare.adjustments')}
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleSaveSnapshot}
                className="bg-primary px-4 py-2 rounded-full active:opacity-70"
              >
                <Text className="text-white font-semibold">💾 {t('snapshots.save_button')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReset}
                className="bg-surface px-4 py-2 rounded-full border border-border active:opacity-70"
              >
                <Text className="text-primary font-semibold">{t('compare.reset')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-4">
            <ScenarioSlider
              label={t('compare.sales_adjustment')}
              value={salesAdjustment}
              onValueChange={setSalesAdjustment}
              minimumValue={-50}
              maximumValue={50}
              step={5}
              unit="%"
              description={t('compare.sales_description')}
            />

            <ScenarioSlider
              label={t('compare.costs_adjustment')}
              value={costsAdjustment}
              onValueChange={setCostsAdjustment}
              minimumValue={-50}
              maximumValue={50}
              step={5}
              unit="%"
              description={t('compare.costs_description')}
            />

            <ScenarioSlider
              label={t('compare.discount_adjustment')}
              value={discountAdjustment}
              onValueChange={setDiscountAdjustment}
              minimumValue={-5}
              maximumValue={5}
              step={0.5}
              unit="%"
              description={t('compare.discount_description')}
            />
          </View>
        </View>

        {/* Comparison Results */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">
            {t('compare.comparison_results')}
          </Text>

          {/* ROI Comparison */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted mb-2">ROI</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <MetricCard
                  title={t('compare.base')}
                  value={`${baseScenario.roi.toFixed(2)}%`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('compare.dynamic')}
                  value={`${dynamicScenario.roi.toFixed(2)}%`}
                  status={getDifferenceStatus(differences.roiDiff)}
                  subtitle={formatDifference(differences.roiDiff, '%')}
                />
              </View>
            </View>
          </View>

          {/* NPV Comparison */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted mb-2">NPV</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <MetricCard
                  title={t('compare.base')}
                  value={`$${Math.round(baseScenario.npv).toLocaleString()}`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('compare.dynamic')}
                  value={`$${Math.round(dynamicScenario.npv).toLocaleString()}`}
                  status={getDifferenceStatus(differences.npvDiff)}
                  subtitle={formatDifference(Math.round(differences.npvDiff), '')}
                />
              </View>
            </View>
          </View>

          {/* IRR Comparison */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted mb-2">
              {t('metrics.irr.label')}
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <MetricCard
                  title={t('compare.base')}
                  value={`${baseScenario.irr.toFixed(2)}%`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('compare.dynamic')}
                  value={`${dynamicScenario.irr.toFixed(2)}%`}
                  status={getDifferenceStatus(differences.irrDiff)}
                  subtitle={formatDifference(differences.irrDiff, '%')}
                />
              </View>
            </View>
          </View>

          {/* Payback Comparison */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-muted mb-2">{t('metrics.payback.label')}</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <MetricCard
                  title={t('compare.base')}
                  value={`${baseScenario.paybackPeriod.toFixed(1)} ${t('common.months')}`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('compare.dynamic')}
                  value={`${dynamicScenario.paybackPeriod.toFixed(1)} ${t('common.months')}`}
                  status={getDifferenceStatus(differences.paybackDiff, true)}
                  subtitle={formatDifference(differences.paybackDiff, ` ${t('common.months')}`)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Comparative Charts */}
        <View className="mb-6 gap-6">
          <Text className="text-xl font-bold text-foreground">
            {t('compare.charts_title')}
          </Text>

          {/* Monthly Cash Flow Comparison */}
          <ComparisonChart
            baseData={baseScenario.monthlyCashFlow}
            dynamicData={dynamicScenario.monthlyCashFlow}
            labels={Array.from({ length: project.projectDuration }, (_, i) => `M${i + 1}`)}
            title={t('compare.monthly_cash_flow')}
            baseLabel={t('compare.base')}
            dynamicLabel={t('compare.dynamic')}
          />

          {/* Cumulative Cash Flow Comparison */}
          <ComparisonChart
            baseData={baseScenario.cumulativeCashFlow}
            dynamicData={dynamicScenario.cumulativeCashFlow}
            labels={Array.from({ length: project.projectDuration }, (_, i) => `M${i + 1}`)}
            title={t('compare.cumulative_cash_flow')}
            baseLabel={t('compare.base')}
            dynamicLabel={t('compare.dynamic')}
          />
        </View>

        {/* Info Box */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-6">
          <Text className="text-sm text-muted">
            {t('compare.info_text')}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
