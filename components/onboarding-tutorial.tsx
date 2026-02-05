import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/lib/i18n-context';
import { useColors } from '@/hooks/use-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface TutorialStep {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface OnboardingTutorialProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTutorial({
  visible,
  onComplete,
  onSkip,
}: OnboardingTutorialProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      icon: 'hand-right-outline',
      title: t('onboarding.welcome_title'),
      description: t('onboarding.welcome_description'),
    },
    {
      id: 'create',
      icon: 'create-outline',
      title: t('onboarding.create_title'),
      description: t('onboarding.create_description'),
    },
    {
      id: 'compare',
      icon: 'git-compare-outline',
      title: t('onboarding.compare_title'),
      description: t('onboarding.compare_description'),
    },
    {
      id: 'snapshots',
      icon: 'camera-outline',
      title: t('onboarding.snapshots_title'),
      description: t('onboarding.snapshots_description'),
    },
    {
      id: 'export',
      icon: 'document-text-outline',
      title: t('onboarding.export_title'),
      description: t('onboarding.export_description'),
    },
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const animateStep = (direction: 'next' | 'prev') => {
    const toValue = direction === 'next' ? -50 : 50;
    
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (direction === 'next') {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
      
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      animateStep('next');
    }
  };

  const handlePrevious = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep > 0) {
      animateStep('prev');
    }
  };

  const handleSkip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%',
            maxWidth: 400,
          }}
        >
          {/* Content Card */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
            }}
          >
            {/* Icon */}
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Ionicons name={currentStepData.icon} size={40} color={colors.primary} />
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.text,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {currentStepData.title}
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 16,
                color: colors.muted,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              {currentStepData.description}
            </Text>

            {/* Progress Indicators */}
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 32,
              }}
            >
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: colors.border,
                  }}
                >
                  {index <= currentStep && (
                    <LinearGradient
                      colors={['#14B8A6', '#86EFAC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ height: '100%' }}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={{ width: '100%', gap: 12 }}>
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  {isLastStep ? t('onboarding.get_started') : t('onboarding.next')}
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                {!isFirstStep && (
                  <TouchableOpacity
                    onPress={handlePrevious}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: colors.background,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 14,
                        fontWeight: '600',
                      }}
                    >
                      {t('onboarding.previous')}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleSkip}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {t('onboarding.skip')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
