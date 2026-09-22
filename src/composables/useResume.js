import i18n from '@/i18n';
import { trackEvent } from '@/composables/useAnalytics';

const PT_CV_PATH = '/dias-matheus-cv.pdf';
const EN_CV_PATH = '/dias-matheus-cv-en.pdf';

// location tells the analytics which entry point earned the click
export const viewCV = (location) => {
  const lang = i18n.global.locale.value;

  trackEvent('cv_click', { lang, location });
  window.open(lang === 'pt' ? PT_CV_PATH : EN_CV_PATH, '_blank');
};
