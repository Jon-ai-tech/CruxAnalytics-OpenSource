// File removed as part of Open Source pivot.
export const getSubscriptionStatus = async (openId: string) => ({
    isPremium: true,
    tier: 'premium',
    expiryDate: null
});

export const upgradeToPremium = async () => ({ success: true });
export const syncRevenueCatSubscription = async () => ({ success: true });
