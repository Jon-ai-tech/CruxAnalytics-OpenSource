import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTranslation } from '@/lib/i18n-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          <Text className="text-3xl font-heading text-foreground">
            {t('projects_list.title')}
          </Text>
          
          <View className="bg-surface rounded-3xl p-12 border border-border items-center gap-4">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-2">
              <IconSymbol size={48} name="folder.fill" color={colors.primary} />
            </View>
            <Text className="text-xl font-heading-medium text-foreground text-center">
              {t('projects_list.title')}
            </Text>
            <Text className="text-base font-body text-muted text-center max-w-md">
              {t('projects_list.coming_soon')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
