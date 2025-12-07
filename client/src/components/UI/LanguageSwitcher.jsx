import React, { useMemo } from 'react';
import { useLang } from '@/context';

export const buildLanguageOptions = (language, setLanguage, t) => {
  const codes = ['fr', 'en', 'nl'];
  return codes.map((code) => ({
    code,
    label: t?.(`lang.${code}`) || code.toUpperCase(),
    active: language === code,
    onSelect: () => setLanguage(code),
  }));
};

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLang();
  const options = useMemo(() => buildLanguageOptions(language, setLanguage, t), [language, setLanguage, t]);

  return React.createElement(
    'div',
    { className: 'dropdown dropdown-end' },
    React.createElement(
      'div',
      { tabIndex: 0, role: 'button', className: 'btn btn-ghost btn-sm px-3' },
      language.toUpperCase(),
    ),
    React.createElement(
      'ul',
      { className: 'dropdown-content menu menu-sm mt-3 z-[1] p-2 shadow bg-[var(--n)] text-[var(--nc)] rounded-box w-36' },
      options.map((opt) =>
        React.createElement(
          'li',
          { key: opt.code },
          React.createElement(
            'button',
            {
              type: 'button',
              className: `justify-between ${opt.active ? 'font-semibold text-[var(--p)]' : ''}`,
              onClick: opt.onSelect,
            },
            React.createElement('span', null, opt.label),
            opt.active ? React.createElement('span', { 'aria-hidden': 'true' }, '✓') : null,
          ),
        ),
      ),
    ),
  );
};

export default LanguageSwitcher;
