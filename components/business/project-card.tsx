import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/financial-calculator';
import { ProjectStatusBadge } from '@/components/project-status-badge';
import { hasActiveReminder } from '@/lib/notification-manager';
import type { ProjectData } from '@/types/project';
import * as Haptics from 'expo-haptics';

interface ProjectCardProps {
  project: ProjectData;
  onPress: () => void;
  className?: string;
}

export const ProjectCard = React.memo(function ProjectCard({ project, onPress, className }: ProjectCardProps) {
  const [hasReminder, setHasReminder] = useState(false);

  useEffect(() => {
    checkReminder();
  }, [project.id]);

  const checkReminder = async () => {
    const active = await hasActiveReminder(project.id);
    setHasReminder(active);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getStatusColor = () => {
    if (!project.results) return 'bg-muted';
    
    const isViable = project.results.roi > 0 && project.results.npv > 0;
    return isViable ? 'bg-success' : 'bg-error';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
      ]}
      className={cn('mb-3', className)}
    >
      <View className="bg-surface rounded-2xl p-6 border border-border/50 shadow-md">
        {/* Header with status badge */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-foreground flex-1" numberOfLines={2}>
                {project.name || 'Untitled Project'}
              </Text>
              {hasReminder && (
                <Text className="text-base">🔔</Text>
              )}
            </View>
            <Text className="text-xs text-muted mt-1">
              {formatDate(project.updatedAt)}
            </Text>
          </View>
          {project.results && (
            <ProjectStatusBadge roi={project.results.roi} npv={project.results.npv} />
          )}
        </View>

        {/* Metrics Preview */}
        {project.results && (
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-muted">ROI</Text>
              <Text className={cn(
                'text-base font-semibold',
                project.results.roi > 0 ? 'text-success' : 'text-error'
              )}>
                {formatPercentage(project.results.roi)}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className="text-xs text-muted">NPV</Text>
              <Text className={cn(
                'text-base font-semibold',
                project.results.npv > 0 ? 'text-success' : 'text-error'
              )}>
                {formatCurrency(project.results.npv)}
              </Text>
            </View>
          </View>
        )}

        {/* No results yet */}
        {!project.results && (
          <Text className="text-sm text-muted italic">
            No analysis yet
          </Text>
        )}
      </View>
    </Pressable>
  );
});
