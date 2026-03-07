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

import { ScreenContainer } from '@/components/screen-container';
import { MetricCard } from '@/components/business/metric-card';
import { ComparisonChart } from '@/components/business/comparison-chart';
import { useTranslation } from '@/lib/i18n-context';
import { getProject, getAllScenarios } from '@/lib/project-storage';
import type { ProjectData, ScenarioSnapshot } from '@/types/project';

export default function CompareSnapshotsScreen() {
  const { t } = useTranslation();
  const { id, a, b } = useLocalSearchParams<{ id: string; a: string; b: string }>();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [snapshotA, setSnapshotA] = useState<ScenarioSnapshot | null>(null);
  const [snapshotB, setSnapshotB] = useState<ScenarioSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id, a, b]);

  const loadData = async () => {
    try {
      setLoading(true);
      const loadedProject = await getProject(id);
      if (loadedProject) {
        setProject(loadedProject);
        const scenarios = await getAllScenarios(id);

        const foundA = scenarios.find(s => s.id === a);
        const foundB = scenarios.find(s => s.id === b);

        if (!foundA || !foundB) {
          Alert.alert(t('validations.error'), t('snapshots.not_found'));
          router.back();
          return;
        }

        setSnapshotA(foundA);
        setSnapshotB(foundB);
      } else {
        Alert.alert(t('validations.error'), t('validations.project_not_found'));
        router.back();
      }
    } catch (error) {
      console.error('Error loading snapshots:', error);
      Alert.alert(t('validations.error'), t('errors.load_failed'));
    } finally {
      setLoading(false);
    }
  };

  const differences = useMemo(() => {
    if (!snapshotA || !snapshotB) return null;

    return {
      roiDiff: snapshotB.results.roi - snapshotA.results.roi,
      npvDiff: snapshotB.results.npv - snapshotA.results.npv,
      irrDiff: snapshotB.results.irr - snapshotA.results.irr,
      paybackDiff: snapshotB.results.paybackPeriod - snapshotA.results.paybackPeriod,
    };
  }, [snapshotA, snapshotB]);

  if (loading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted">{t('common.loading')}</Text>
      </ScreenContainer>
    );
  }

  if (!project || !snapshotA || !snapshotB || !differences) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('common.language_code'), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAdjustment = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
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
            {t('snapshots.compare_snapshots')}
          </Text>
          <Text className="text-base text-muted">
            {project.name}
          </Text>
        </View>

        {/* Scenario Headers */}
        <View className="flex-row gap-3 mb-6">
          {/* Scenario A */}
          <View className="flex-1 bg-surface rounded-xl p-4 border-2 border-primary">
            <Text className="text-xs text-primary font-semibold mb-1">
              {t('snapshots.snapshot_a')}
            </Text>
            <Text className="text-lg font-bold text-foreground mb-1">
              {snapshotA.name}
            </Text>
            <Text className="text-xs text-muted mb-2">
              {formatDate(snapshotA.createdAt)}
            </Text>
            <View className="bg-background rounded-lg p-2">
              <Text className="text-xs text-muted mb-1">{t('snapshots.adjustments')}</Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.sales')}: {formatAdjustment(snapshotA.salesAdjustment)}
              </Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.costs')}: {formatAdjustment(snapshotA.costsAdjustment)}
              </Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.discount')}: {formatAdjustment(snapshotA.discountAdjustment)}
              </Text>
            </View>
          </View>

          {/* Scenario B */}
          <View className="flex-1 bg-surface rounded-xl p-4 border-2 border-warning">
            <Text className="text-xs text-warning font-semibold mb-1">
              {t('snapshots.snapshot_b')}
            </Text>
            <Text className="text-lg font-bold text-foreground mb-1">
              {snapshotB.name}
            </Text>
            <Text className="text-xs text-muted mb-2">
              {formatDate(snapshotB.createdAt)}
            </Text>
            <View className="bg-background rounded-lg p-2">
              <Text className="text-xs text-muted mb-1">{t('snapshots.adjustments')}</Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.sales')}: {formatAdjustment(snapshotB.salesAdjustment)}
              </Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.costs')}: {formatAdjustment(snapshotB.costsAdjustment)}
              </Text>
              <Text className="text-xs text-foreground">
                {t('snapshots.discount')}: {formatAdjustment(snapshotB.discountAdjustment)}
              </Text>
            </View>
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
                  title={t('snapshots.snapshot_a')}
                  value={`${snapshotA.results.roi.toFixed(2)}%`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('snapshots.snapshot_b')}
                  value={`${snapshotB.results.roi.toFixed(2)}%`}
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
                  title={t('snapshots.snapshot_a')}
                  value={`$${Math.round(snapshotA.results.npv).toLocaleString()}`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('snapshots.snapshot_b')}
                  value={`$${Math.round(snapshotB.results.npv).toLocaleString()}`}
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
                  title={t('snapshots.snapshot_a')}
                  value={`${snapshotA.results.irr.toFixed(2)}%`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('snapshots.snapshot_b')}
                  value={`${snapshotB.results.irr.toFixed(2)}%`}
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
                  title={t('snapshots.snapshot_a')}
                  value={`${snapshotA.results.paybackPeriod.toFixed(1)} ${t('common.months')}`}
                  status="neutral"
                />
              </View>
              <View className="flex-1">
                <MetricCard
                  title={t('snapshots.snapshot_b')}
                  value={`${snapshotB.results.paybackPeriod.toFixed(1)} ${t('common.months')}`}
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
            baseData={snapshotA.results.monthlyCashFlow}
            dynamicData={snapshotB.results.monthlyCashFlow}
            labels={Array.from({ length: project.projectDuration }, (_, i) => `M${i + 1}`)}
            title={t('compare.monthly_cash_flow')}
            baseLabel={snapshotA.name}
            dynamicLabel={snapshotB.name}
          />

          {/* Cumulative Cash Flow Comparison */}
          <ComparisonChart
            baseData={snapshotA.results.cumulativeCashFlow}
            dynamicData={snapshotB.results.cumulativeCashFlow}
            labels={Array.from({ length: project.projectDuration }, (_, i) => `M${i + 1}`)}
            title={t('compare.cumulative_cash_flow')}
            baseLabel={snapshotA.name}
            dynamicLabel={snapshotB.name}
          />
        </View>

        {/* Info Box */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-6">
          <Text className="text-sm text-muted">
            {t('snapshots.comparison_info')}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
