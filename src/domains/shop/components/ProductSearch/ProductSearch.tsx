'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import styles from './ProductSearch.module.css';

interface ProductSearchProps {
  value: string;
  onSearch: (query: string) => void;
}

export function ProductSearch({ value, onSearch }: ProductSearchProps) {
  const t = useTranslations('shop');
  const [term, setTerm] = useState(value || '');

  useEffect(() => {
    setTerm(value || '');
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <form className={styles.searchWrapper} onSubmit={handleSubmit}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.input}
        placeholder={t('searchPlaceholder')}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      {term && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
