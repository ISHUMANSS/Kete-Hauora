import i18n from '../i18n';

describe('i18n configuration', () => {
  test('loads English translations by default', () => {
    expect(i18n.language).toBe('en');
    const translation = i18n.t('Welcome');
    expect(typeof translation).toBe('string');
  });

  test('returns correct English translation', () => {
    const translation = i18n.t('Welcome');
    expect(translation).toBe('Welcome to Te Kete Hauora');
  });

  test('switches to Māori translations', async () => {
    await i18n.changeLanguage('mi');
    expect(i18n.language).toBe('mi');

    const translation = i18n.t('Welcome');
    expect(translation).toBe('Nau mai ki Te Kete Hauora');
  });

  test('falls back to English when key missing in Māori', async () => {
    await i18n.changeLanguage('mi');
    const missingTranslation = i18n.t('NonExistentKey', { fallbackLng: 'en' });
    expect(missingTranslation).toBe('NonExistentKey');
  });
});
