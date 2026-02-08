import { Platform, Alert } from 'react-native';

/**
 * Cross-platform confirmation utility.
 * Uses Alert.alert on native platforms and window.confirm on Web.
 */
export async function confirmAction(
    title: string,
    message: string,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    isDestructive: boolean = false
): Promise<boolean> {
    if (Platform.OS === 'web') {
        return window.confirm(`${title}\n\n${message}`);
    }

    return new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: cancelText,
                    onPress: () => resolve(false),
                    style: 'cancel',
                },
                {
                    text: confirmText,
                    onPress: () => resolve(true),
                    style: isDestructive ? 'destructive' : 'default',
                },
            ],
            { cancelable: true, onDismiss: () => resolve(false) }
        );
    });
}

/**
 * Triggers a file download on the Web platform.
 * Used for exporting reports when Sharing API is unavailable or limited.
 */
export function downloadWebFile(content: string, fileName: string, mimeType: string = 'text/html') {
    if (Platform.OS !== 'web') return;

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
