import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

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
          <View className="flex-row items-start justify-between glass rounded-2xl p-6 bg-gradient-to-r from-primary to-success">
            <View className="flex-1 gap-2">
              <Text className="text-4xl font-heading text-foreground">
                {t('home.welcome')}
              </Text>
              <Text className="text-base font-body text-muted">
                {t('home.subtitle')}
              </Text>
            </View>
            <LanguageSelector />
          </View>

          {/* Search and Filters */}
          {projects.length > 0 && (
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
          )}

          {/* Projects List */}
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-heading-medium text-foreground">
                {filteredProjects.length > 0 ? `${filteredProjects.length} ${t('common.all')}` : t('home.recent_projects')}
              </Text>
            </View>

            {loading ? (
              <SkeletonProjectList count={3} />
            ) : projects.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center gap-4">
                <IconSymbol size={48} name="folder.badge.plus" color={colors.primary} />
                <Text className="text-base font-body text-muted text-center mb-2">
                  {t('home.no_projects')}
                </Text>
                <Text className="text-sm font-body text-muted text-center">
                  {t('home.create_first')}
                </Text>
              </View>
            ) : filteredProjects.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center gap-4">
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

          {/* Quick Stats Card (if we have projects) */}
          {projects.length > 0 && (
            <View className="glass rounded-2xl p-6 border border-border">
              <Text className="text-lg font-heading-medium text-foreground mb-4">
                {t('dashboard.quick_stats')}
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1 items-center">
                  <IconSymbol size={32} name="folder.fill" color={colors.primary} />
                  <Text className="text-2xl font-heading text-primary mt-2">
                    {projects.length}
                  </Text>
                  <Text className="text-sm font-body text-muted">{t('dashboard.total_projects')}</Text>
                </View>
                <View className="flex-1 items-center">
                  <IconSymbol size={32} name="checkmark.circle.fill" color={colors.success} />
                  <Text className="text-2xl font-heading text-success mt-2">
                    {projects.filter(p => p.results && p.results.roi > 0).length}
                  </Text>
                  <Text className="text-sm font-body text-muted">{t('status.viable')}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={handleNewProject}
          className="bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
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
