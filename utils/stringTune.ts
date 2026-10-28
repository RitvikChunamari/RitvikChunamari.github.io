import StringTune, {
  StringDevInview,
  StringDevLayout,
  StringDevProgress,
  StringDevRulers,
  StringProgress,
  StringResponsive,
  StringSplit,
} from '@fiddle-digital/string-tune';

export const STRING_TUNE_DEVTOOL_TOKEN = "715a20919d5dd987fa3a03edc37fad33b19e4dc7b9e5d3b5";

export function initStringTune(): StringTune | null {
  if (typeof window === 'undefined') return null;

  // Make StringTune globally accessible on window for browser console access
  (window as any).StringTune = StringTune;

  const stringTune = StringTune.getInstance();
  (window as any).stringTune = stringTune;

  // Set the devtool access token requested by user
  stringTune.accessDevtoolToken = STRING_TUNE_DEVTOOL_TOKEN;

  // Set default scroll mode so it works seamlessly alongside Lenis smooth scroll
  stringTune.scrollDesktopMode = 'default';
  stringTune.scrollMobileMode = 'default';

  // Register developer inspection tools
  stringTune.use(StringDevInview);
  stringTune.use(StringDevLayout);
  stringTune.use(StringDevProgress);
  stringTune.use(StringDevRulers);

  // Register core motion/text/responsive modules
  stringTune.use(StringSplit);
  stringTune.use(StringProgress);
  stringTune.use(StringResponsive);

  // Start the StringTune runtime loop (60 FPS)
  stringTune.start(60);

  return stringTune;
}


// Auto-initialize when running in browser
if (typeof window !== 'undefined') {
  initStringTune();
}

export default StringTune;

