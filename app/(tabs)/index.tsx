import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components/screen-container';
import { ProjectCard } from '@/components/business/project-card';
import { SkeletonProjectList } from '@/components/business/skeleton-project-card';
import { OnboardingTutorial } from '@/components/onboarding-tutorial';
import { LanguageSelector } from '@/components/language-selector';
import { SearchBar } from '@/components/search-bar';
import { FilterChips } from '@/components/filter-chips';
import { SortSelector } from '@/components/sort-selector';
import { useTranslation } from '@/lib/i18n-context';
import { getAllProjects } from '@/lib/project-storage';
import { hasSeenTutorial, markTutorialAsSeen } from '@/lib/tutorial-storage';
import { eventEmitter, Events } from '@/lib/event-emitter';
import type { ProjectData } from '@/types/project';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useProjectFilters } from '@/hooks/use-project-filters';

// ============================================
// HEALTH SCORE HELPERS
// ============================================
function calculateHealthScore(projects: ProjectData[]): number | null {
  if (projects.length < 3) return null;
  
  const viableCount = projects.filter(p => p.results && p.results.roi > 0).length;
  const score = Math.round((viableCount / projects.length) * 100);
  return Math.min(100, Math.max(0, score));
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#86EFAC'; // Mint (success)
  if (score >= 50) return '#FB923C'; // Coral (warning)
  return '#FB923C'; // Coral (error)
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excelente';
  if (score >= 50) return 'Bueno';
  return 'Necesita atención';
}

// ============================================
// HEALTH SCORE GAUGE COMPONENT
// ============================================
function HealthScoreGauge({ score, colors }: { score: number | null; colors: any }) {
  return (
    <View className="bg-surface border border-border rounded-3xl p-8">
      <Text className="text-muted text-sm mb-4 uppercase tracking-wider font-body-medium">HEALTH SCORE</Text>
      {score !== null ? (
        <>
          <View 
            className="w-36 h-36 rounded-full border-8 items-center justify-center mb-4"
            style={{ borderColor: `${getScoreColor(score)}30` }}
          >
            <Text className="text-5xl font-mono text-foreground" style={{ letterSpacing: -0.01 * 16 }}>
              {score}
            </Text>
          </View>
          <Text className="text-success font-body-medium">{getScoreLabel(score)}</Text>
        </>
      ) : (
        <>
          <View className="w-36 h-36 rounded-full border-8 border-border items-center justify-center mb-4">
            <IconSymbol size={48} name="chart.line.uptrend.xyaxis" color={colors.muted} />
          </View>
          <Text className="text-muted font-body text-center text-sm">
            Completa al menos 3 análisis para ver tu score
          </Text>
        </>
      )}
    </View>
  );
}

// ============================================
// TOOL CARDS DATA & COMPONENT
// ============================================
function getToolCards(t: (key: string) => string) {
  return [
    { 
      icon: 'chart.line.uptrend.xyaxis', 
      title: t('calculators.break_even.title'), 
      description: t('calculators.break_even.description'),
      href: '/(tabs)/calculators/break-even' as const,
      color: 'primary' as const
    },
    { 
      icon: 'dollarsign.circle', 
      title: t('calculators.cash_flow.title'), 
      description: t('calculators.cash_flow.description'),
      href: '/(tabs)/calculators/cash-flow' as const,
      color: 'success' as const
    },
    { 
      icon: 'tag', 
      title: t('calculators.pricing.title'), 
      description: t('calculators.pricing.description'),
      href: '/(tabs)/calculators/pricing' as const,
      color: 'warning' as const
    },
    { 
      icon: 'creditcard', 
      title: t('calculators.loan.title'), 
      description: t('calculators.loan.description'),
      href: '/(tabs)/calculators/loan' as const,
      color: 'primary' as const
    },
    { 
      icon: 'person.2', 
      title: t('calculators.employee_roi.title'), 
      description: t('calculators.employee_roi.description'),
      href: '/(tabs)/calculators/employee-roi' as const,
      color: 'success' as const
    },
    { 
      icon: 'megaphone', 
      title: t('calculators.marketing_roi.title'), 
      description: t('calculators.marketing_roi.description'),
      href: '/(tabs)/calculators/marketing' as const,
      color: 'warning' as const
    },
  ];
}

function ToolCard({ icon, title, description, href, color, colors }: any) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(href);
  };

  // Color mapping for the icon background
  const getBgColor = () => {
    const colorValue = colors[color];
    // Convert hex to rgba with 10% opacity
    const hex = colorValue.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  };

  return (
    <Pressable 
      onPress={handlePress} 
      className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] mb-4"
      style={{ minWidth: 280 }}
    >
      <View className="bg-surface border border-border rounded-2xl p-6 h-full">
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mb-4"
          style={{ backgroundColor: getBgColor() }}
        >
          <IconSymbol size={24} name={icon} color={colors[color]} />
        </View>
        <Text className="text-lg font-heading-medium text-foreground mb-2">{title}</Text>
        <Text className="text-sm font-body text-muted">{description}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    sortOption,
    setSortOption,
    counts,
  } = useProjectFilters(projects);

  useEffect(() => {
    loadProjects();
    checkTutorialStatus();
  }, []);

  // Listen to project events for auto-refresh
  useEffect(() => {
    const unsubscribeCreated = eventEmitter.on(Events.PROJECT_CREATED, () => {
      loadProjects();
    });
    
    const unsubscribeUpdated = eventEmitter.on(Events.PROJECT_UPDATED, () => {
      loadProjects();
    });
    
    const unsubscribeDeleted = eventEmitter.on(Events.PROJECT_DELETED, () => {
      loadProjects();
    });
    
    const unsubscribeDuplicated = eventEmitter.on(Events.PROJECT_DUPLICATED, () => {
      loadProjects();
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeDuplicated();
    };
  }, []);

  const checkTutorialStatus = async () => {
    const seen = await hasSeenTutorial();
    if (!seen) {
      // Show tutorial after a short delay for better UX
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  };

  const handleTutorialComplete = async () => {
    await markTutorialAsSeen();
    setShowTutorial(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleTutorialSkip = async () => {
    await markTutorialAsSeen();
    setShowTutorial(false);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  }, []);

  const handleNewProject = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/new-project');
  };

  const handleProjectPress = (project: ProjectData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/project/${project.id}`);
  };

  return (
    <ScreenContainer className="relative">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-6 gap-6">
          {/* Header with Language Selector */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 gap-3">
              <Text className="text-5xl font-heading text-foreground" style={{ letterSpacing: -0.02 * 16 }}>
                {t('home.welcome')}
              </Text>
            </View>
            <LanguageSelector />
          </View>

          {/* Privacy Badge */}
          <View className="bg-success/10 border border-success/30 rounded-full px-3 py-1.5 flex-row items-center gap-2 self-start">
            <View className="w-1.5 h-1.5 rounded-full bg-success" />
            <Text className="text-xs font-mono text-success tracking-wider">
              LOCAL-ONLY | ENCRYPTED
            </Text>
          </View>

          {/* Health Score + Quick Stats Row */}
          {projects.length > 0 && (
            <View className="flex-row gap-6">
              <HealthScoreGauge score={calculateHealthScore(projects)} colors={colors} />
              <View className="flex-1 bg-surface border border-border rounded-3xl p-8">
                <Text className="text-xl font-heading-medium text-foreground mb-6">
                  {t('dashboard.quick_stats')}
                </Text>
                <View className="flex-col gap-4">
                  <View className="bg-primary/5 rounded-2xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <IconSymbol size={20} name="chart.bar.fill" color={colors.primary} />
                      <Text className="text-3xl font-heading text-primary">
                        {projects.length}
                      </Text>
                    </View>
                    <Text className="text-sm font-body text-muted">{t('dashboard.total_projects')}</Text>
                  </View>
                  <View className="bg-success/5 rounded-2xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <IconSymbol size={20} name="checkmark.circle.fill" color={colors.success} />
                      <Text className="text-3xl font-heading text-success">
                        {projects.filter(p => p.results && p.results.roi > 0).length}
                      </Text>
                    </View>
                    <Text className="text-sm font-body text-muted">{t('status.viable')}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Tool Cards Grid */}
          <View>
            <Text className="text-2xl font-heading-medium text-foreground mb-4">
              Herramientas de Análisis
            </Text>
            <View className="flex-row flex-wrap justify-between gap-4">
              {getToolCards(t).map(tool => (
                <ToolCard key={tool.href} {...tool} colors={colors} />
              ))}
            </View>
          </View>

          {/* Projects List */}
          {projects.length > 0 && (
            <>
              <Text className="text-2xl font-heading-medium text-foreground mb-4">
                Proyectos Recientes
              </Text>
              
              {/* Search and Filters */}
              <View className="gap-4">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder={t('projects_list.search_placeholder')}
                />
                
                <FilterChips
                  selected={filterOption}
                  onSelect={setFilterOption}
                  counts={counts}
                  labels={{
                    all: t('projects_list.filter_all'),
                    viable: t('status.viable'),
                    review: t('status.review'),
                    not_viable: t('status.not_viable'),
                  }}
                />
              </View>
            </>
          )}

          <View className="gap-4">
            {loading ? (
              <SkeletonProjectList count={3} />
            ) : projects.length === 0 ? (
              <View className="bg-surface border border-border rounded-3xl p-12 items-center gap-4">
                <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-2">
                  <IconSymbol size={40} name="folder.badge.plus" color={colors.primary} />
                </View>
                <Text className="text-xl font-heading-medium text-foreground text-center">
                  {t('home.no_projects')}
                </Text>
                <Text className="text-base font-body text-muted text-center max-w-sm">
                  {t('home.create_first')}
                </Text>
              </View>
            ) : filteredProjects.length === 0 ? (
              <View className="bg-surface border border-border rounded-2xl p-8 items-center gap-4">
                <IconSymbol size={48} name="magnifyingglass" color={colors.muted} />
                <Text className="text-base font-body text-muted text-center mb-2">
                  {t('projects_list.no_results')}
                </Text>
              </View>
            ) : (
              <View>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={() => handleProjectPress(project)}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={handleNewProject}
          className="bg-primary rounded-full w-16 h-16 items-center justify-center shadow-2xl"
          style={{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <IconSymbol size={28} name="plus" color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        visible={showTutorial}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    </ScreenContainer>
  );
}
