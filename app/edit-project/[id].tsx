import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useTranslation } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';
import { getProject, updateProject } from '@/lib/project-storage';
import { calculateFinancialMetrics } from '@/lib/financial-calculator';
import type { ProjectData } from '@/types/project';

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<ProjectData | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [yearlyRevenue, setYearlyRevenue] = useState('');
  const [revenueGrowth, setRevenueGrowth] = useState('');
  const [operatingCosts, setOperatingCosts] = useState('');
  const [maintenanceCosts, setMaintenanceCosts] = useState('');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const loadedProject = await getProject(id);

      if (!loadedProject) {
        Alert.alert(t('validations.error'), t('errors.project_not_found'));
        router.back();
        return;
      }

      setProject(loadedProject);

      // Populate form
      setName(loadedProject.name);
      setInitialInvestment(loadedProject.initialInvestment.toString());
      setDiscountRate(loadedProject.discountRate.toString());
      setProjectDuration(loadedProject.projectDuration.toString());
      setYearlyRevenue(loadedProject.yearlyRevenue.toString());
      setRevenueGrowth(loadedProject.revenueGrowth.toString());
      setOperatingCosts(loadedProject.operatingCosts.toString());
      setMaintenanceCosts(loadedProject.maintenanceCosts.toString());
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert(t('validations.error'), t('errors.loading_project'));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert(t('validations.error'), t('validations.project_name_required'));
      return;
    }

    const investment = parseFloat(initialInvestment);
    const discount = parseFloat(discountRate);
    const duration = parseInt(projectDuration);
    const revenue = parseFloat(yearlyRevenue);
    const growth = parseFloat(revenueGrowth);
    const opCosts = parseFloat(operatingCosts);
    const maintCosts = parseFloat(maintenanceCosts);

    if (isNaN(investment) || investment <= 0) {
      Alert.alert(t('validations.error'), t('validations.initial_investment_required'));
      return;
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      Alert.alert(t('validations.error'), t('validations.discount_rate_invalid'));
      return;
    }

    if (isNaN(duration) || duration < 1 || duration > 360) {
      Alert.alert(t('validations.error'), t('validations.project_duration_invalid'));
      return;
    }

    if (isNaN(revenue) || revenue < 0) {
      Alert.alert(t('validations.error'), t('validations.yearly_revenue_invalid'));
      return;
    }

    if (isNaN(growth) || growth < -100 || growth > 1000) {
      Alert.alert(t('validations.error'), t('validations.revenue_growth_invalid'));
      return;
    }

    if (isNaN(opCosts) || opCosts < 0) {
      Alert.alert(t('validations.error'), t('validations.operating_costs_invalid'));
      return;
    }

    if (isNaN(maintCosts) || maintCosts < 0) {
      Alert.alert(t('validations.error'), t('validations.maintenance_costs_invalid'));
      return;
    }

    try {
      setSaving(true);

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Recalculate metrics for all scenarios
      const expectedResults = calculateFinancialMetrics({
        initialInvestment: investment,
        discountRate: discount,
        projectDuration: duration,
        yearlyRevenue: revenue,
        revenueGrowth: growth,
        operatingCosts: opCosts,
        maintenanceCosts: maintCosts,
        multiplier: 1,
      });

      const bestResults = calculateFinancialMetrics({
        initialInvestment: investment,
        discountRate: discount,
        projectDuration: duration,
        yearlyRevenue: revenue,
        revenueGrowth: growth,
        operatingCosts: opCosts,
        maintenanceCosts: maintCosts,
        multiplier: project?.bestCaseMultiplier || 1.3,
      });

      const worstResults = calculateFinancialMetrics({
        initialInvestment: investment,
        discountRate: discount,
        projectDuration: duration,
        yearlyRevenue: revenue,
        revenueGrowth: growth,
        operatingCosts: opCosts,
        maintenanceCosts: maintCosts,
        multiplier: project?.worstCaseMultiplier || 0.7,
      });

      const results = {
        roi: expectedResults.roi,
        npv: expectedResults.npv,
        paybackPeriod: expectedResults.paybackPeriod,
        irr: expectedResults.irr,
        roiBest: bestResults.roi,
        npvBest: bestResults.npv,
        paybackBest: bestResults.paybackPeriod,
        irrBest: bestResults.irr,
        roiWorst: worstResults.roi,
        npvWorst: worstResults.npv,
        paybackWorst: worstResults.paybackPeriod,
        irrWorst: worstResults.irr,
        monthlyCashFlow: expectedResults.monthlyCashFlow,
        cumulativeCashFlow: expectedResults.cumulativeCashFlow,
      };

      // Update project
      const updated = await updateProject(id, {
        name: name.trim(),
        initialInvestment: investment,
        discountRate: discount,
        projectDuration: duration,
        yearlyRevenue: revenue,
        revenueGrowth: growth,
        operatingCosts: opCosts,
        maintenanceCosts: maintCosts,
        results,
      });

      if (!updated) {
        throw new Error('Failed to update project');
      }

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        t('common.success'),
        t('project_form.project_updated'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert(t('validations.error'), t('errors.saving_project'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      t('project_form.discard_changes'),
      t('project_form.discard_changes_confirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.discard'),
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">{t('common.loading')}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            {t('project_form.edit_project')}
          </Text>
          <Text className="text-sm text-muted">
            {t('project_form.edit_project_desc')}
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Project Name */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.project_name')} *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('project_form.project_name_placeholder')}
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Initial Investment */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.initial_investment')} *
            </Text>
            <TextInput
              value={initialInvestment}
              onChangeText={setInitialInvestment}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Discount Rate */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.discount_rate')} (%)
            </Text>
            <TextInput
              value={discountRate}
              onChangeText={setDiscountRate}
              placeholder="10"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Project Duration */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.project_duration')} ({t('common.months')})
            </Text>
            <TextInput
              value={projectDuration}
              onChangeText={setProjectDuration}
              placeholder="24"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Yearly Revenue */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.yearly_revenue')}
            </Text>
            <TextInput
              value={yearlyRevenue}
              onChangeText={setYearlyRevenue}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Revenue Growth */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.revenue_growth')} (%)
            </Text>
            <TextInput
              value={revenueGrowth}
              onChangeText={setRevenueGrowth}
              placeholder="5"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Operating Costs */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.operating_costs')}
            </Text>
            <TextInput
              value={operatingCosts}
              onChangeText={setOperatingCosts}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>

          {/* Maintenance Costs */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('project_form.maintenance_costs')}
            </Text>
            <TextInput
              value={maintenanceCosts}
              onChangeText={setMaintenanceCosts}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
            />
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-8 mb-6">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={saving}
            className="flex-1 bg-surface border border-border rounded-xl py-4 items-center"
            style={{ opacity: saving ? 0.5 : 1 }}
          >
            <Text className="text-foreground font-semibold">
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="flex-1 bg-primary rounded-xl py-4 items-center"
            style={{ opacity: saving ? 0.5 : 1 }}
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-background font-semibold">
                {t('common.save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
