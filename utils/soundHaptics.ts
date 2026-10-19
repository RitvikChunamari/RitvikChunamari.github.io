// Sound effects are completely disabled per design requirements
export const isSoundEnabled = (): boolean => false;
export const setSoundEnabled = (_enabled: boolean): void => {};
export const toggleSound = (): boolean => false;
export const playClick = (_pitch = 1.0): void => {};
export const playSwitchTone = (_mode = 'next'): void => {};
export const playBadgeImpact = (_velocity = 1.0): void => {};
export const playGrab = (): void => {};
export const playFling = (_velocity = 1.0): void => {};
