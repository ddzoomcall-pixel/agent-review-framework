'use client';

import { useState } from 'react';
import styles from '../shared.module.css';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  }

  return (
    <button className={styles.themeToggle} onClick={toggle} aria-label="Toggle dark mode">
      {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
