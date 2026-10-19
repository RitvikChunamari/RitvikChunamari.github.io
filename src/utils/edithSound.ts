// Sound effects are completely disabled per design requirements
export const toggleEdithSound = (_enable?: boolean) => {
  return false;
};

export const isEdithSoundEnabled = () => false;

export const playEdithSound = (_type: 'blip' | 'lock' | 'scan' | 'hum' | 'boot' | 'toggle' | 'hover') => {
  // Silent no-op: Zero sound effects
};
