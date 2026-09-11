'use client';

import styles from './HeroSection.module.css';

/**
 * Decorative floating beads: CSS circles in pastel colors
 * that drift across the hero background.
 * Signature element per DESIGN.md.
 * Pure decoration, hidden from assistive tech.
 */
export function FloatingBeads() {
  const beads = [
    { size: 18, color: 'var(--color-primary)',   top: '12%', left: '8%',  delay: '0s',   dur: '7s'  },
    { size: 12, color: 'var(--color-secondary)',  top: '25%', left: '85%', delay: '1.2s', dur: '8s'  },
    { size: 22, color: 'var(--color-accent)',     top: '60%', left: '5%',  delay: '0.5s', dur: '9s'  },
    { size: 10, color: 'var(--color-tertiary)',   top: '75%', left: '90%', delay: '2s',   dur: '6s'  },
    { size: 16, color: 'var(--color-lavender)',   top: '40%', left: '92%', delay: '0.8s', dur: '7.5s'},
    { size: 14, color: 'var(--color-primary)',    top: '85%', left: '15%', delay: '1.5s', dur: '8.5s'},
    { size: 20, color: 'var(--color-secondary)',  top: '10%', left: '50%', delay: '0.3s', dur: '10s' },
    { size: 8,  color: 'var(--color-accent)',     top: '50%', left: '70%', delay: '2.5s', dur: '6.5s'},
    { size: 15, color: 'var(--color-tertiary)',   top: '30%', left: '30%', delay: '1s',   dur: '9s'  },
    { size: 11, color: 'var(--color-lavender)',   top: '70%', left: '55%', delay: '1.8s', dur: '7s'  },
  ];

  return (
    <div className={styles.beadsContainer} aria-hidden="true">
      {beads.map((b, i) => (
        <span
          key={i}
          className={styles.bead}
          style={{
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            top: b.top,
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        />
      ))}
    </div>
  );
}
