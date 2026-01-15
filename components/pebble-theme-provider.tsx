"use client"

import { initI18nTranslations } from '@rippling/lib-i18n';
import oneUiService from '@rippling/pebble/services';
import { ThemeProvider, THEME_CONFIGS } from '@rippling/pebble/theme';
import resources from '@rippling/pebble/translations/locales/en-US/one-ui.json';
import React, { useEffect, useState } from 'react';
import GlobalStyle from '@rippling/pebble/GlobalStyle';

const defaultNameSpace = 'one-ui';
const namespaces = [defaultNameSpace];
const language = 'en-US';
const supportedLanguages = [language];

function initPebble() {
  oneUiService.init({} as any);
  return initI18nTranslations({
    resources: {
      [language]: {
        [defaultNameSpace]: resources,
      },
    },
    namespaces,
    supportedLanguages,
    defaultNameSpace,
    fallbackLanguage: language,
    language,
    debug: true,
  });
}

export default function PebbleThemeProvider({ children }: { children: React.ReactNode }) {
  const [isPebbleReady, setIsPebbleReady] = useState(false);

  useEffect(() => {
    initPebble().then(() => {
      setIsPebbleReady(true);
    });
  }, []);

  if (!isPebbleReady) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeProvider themeConfigs={THEME_CONFIGS} defaultTheme="berry" defaultColorMode="light">
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
