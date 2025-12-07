import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LangProvider, useLang } from '../src/context/LangProvider.jsx';
import LanguageSwitcher, { buildLanguageOptions } from '../src/components/UI/LanguageSwitcher.jsx';

test('language switcher renders current language code', () => {
  const html = renderToString(
    React.createElement(
      LangProvider,
      { initialLanguage: 'fr' },
      React.createElement(LanguageSwitcher)
    )
  );
  strictEqual(html.includes('FR'), true);
});

test('language switcher options trigger setLanguage', () => {
  let selected = 'en';
  const mockSet = (lang) => { selected = lang; };
  const opts = buildLanguageOptions('en', mockSet, () => '');
  const frOption = opts.find((opt) => opt.code === 'fr');
  frOption.onSelect();
  strictEqual(selected, 'fr');
});

test('reservation page text switches with language', () => {
  const ReservationHeadline = () => {
    const { t } = useLang();
    return React.createElement('h1', null, t('reservations.title'));
  };

  const frHtml = renderToString(
    React.createElement(
      LangProvider,
      { initialLanguage: 'fr' },
      React.createElement(ReservationHeadline)
    )
  );
  const nlHtml = renderToString(
    React.createElement(
      LangProvider,
      { initialLanguage: 'nl' },
      React.createElement(ReservationHeadline)
    )
  );

  strictEqual(frHtml.includes('Réservez votre table'), true);
  strictEqual(nlHtml.includes('Reserveer je tafel'), true);
});
