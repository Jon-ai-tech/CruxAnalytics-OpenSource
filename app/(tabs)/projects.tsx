import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { ProjectCard } from '@/components/business/project-card';
import { SkeletonProjectList } from '@/components/business/skeleton-project-card';
import { SearchBar } from '@/components/search-bar';
import { FilterChips } from '@/components/filter-chips';
import { useTranslation } from '@/lib/i18n-context';
import { getAllProjects } from '@/lib/project-storage';
import { eventEmitter, Events } from '@/lib/event-emitter';
import type { ProjectData } from '@/types/project';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useProjectFilters } from '@/hooks/use-project-filters';

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    counts,
  } = useProjectFilters(projects);

  useEffect(() => {
    loadProjects();
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

  const handleProjectPress = (project: ProjectData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/project/${project.id}`);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="gap-6">
          <Text className="text-3xl font-heading text-foreground">
            {t('dashboard.projects_title')}
          </Text>

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
    </ScreenContainer>
  );
}
