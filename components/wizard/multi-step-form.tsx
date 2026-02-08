import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  component: React.ReactNode;
  validation?: () => boolean;
  helpText?: string;
}

interface MultiStepFormProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel: () => void;
  showProgress?: boolean;
  loading?: boolean;
}

export function MultiStepForm({
  steps,
  onComplete,
  onCancel,
  showProgress = true,
  loading = false,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(callback, 150);
  };

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Validate current step
    const currentStepData = steps[currentStep];
    if (currentStepData.validation && !currentStepData.validation()) {
      return;
    }

    if (isLastStep) {
      onComplete();
    } else {
      animateTransition(() => {
        setCurrentStep(currentStep + 1);
      });
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isFirstStep) {
      onCancel();
    } else {
      animateTransition(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View className="flex-1">
      {/* Progress Bar */}
      {showProgress && (
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs text-muted font-body-medium">
              Paso {currentStep + 1} de {steps.length}
            </Text>
            <Text className="text-xs text-muted font-body-medium">
              {Math.round(progress)}%
            </Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-gradient-to-r from-gradient-start to-gradient-end rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Step Title */}
          {currentStepData.subtitle && (
            <Text className="text-sm text-primary mb-2 font-body-bold">
              {currentStepData.subtitle}
            </Text>
          )}

          {/* Step Content */}
          <View className="mb-6">{currentStepData.component}</View>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-6 pb-6 pt-4 border-t border-border bg-background">
        <View className="gap-3">
          {/* Next/Complete Button */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={loading}
            className={cn(
              "bg-gradient-to-r from-gradient-start to-gradient-end rounded-xl py-4 items-center",
              loading && "opacity-50"
            )}
          >
            <Text className="text-background font-semibold text-base font-body-bold">
              {loading ? 'Guardando...' : (isLastStep ? '✓ Calcular y Guardar' : 'Siguiente →')}
            </Text>
          </TouchableOpacity>

          {/* Back/Cancel Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="bg-surface border border-border rounded-xl py-4 items-center"
          >
            <Text className="text-foreground font-semibold text-base font-body-medium">
              {isFirstStep ? 'Cancelar' : '← Anterior'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step Indicator Dots */}
        <View className="flex-row justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <View
              key={index}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentStep
                  ? 'w-8 bg-primary'
                  : index < currentStep
                    ? 'w-2 bg-success'
                    : 'w-2 bg-border'
              )}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
