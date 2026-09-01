import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

type CardVariant = 'clay' | 'flat' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  clickable?: boolean;
  padded?: boolean;
  children: ReactNode;
}

export function Card({
  variant = 'clay',
  clickable = false,
  padded = false,
  children,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    variant === 'flat' ? styles.flat : '',
    variant === 'elevated' ? styles.elevated : '',
    clickable ? styles.clickable : '',
    padded ? styles.padded : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

/* ── Card Sub-components ────────────────────────────── */

interface CardImageProps {
  children: ReactNode;
  className?: string;
}

export function CardImage({ children, className = '' }: CardImageProps) {
  return (
    <div className={`${styles.cardImage} ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`${styles.cardBody} ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`${styles.cardFooter} ${className}`}>
      {children}
    </div>
  );
}

/* ── Card Badge ─────────────────────────────────────── */

type BadgeType = 'sale' | 'new' | 'outOfStock';

interface CardBadgeProps {
  type: BadgeType;
  children: ReactNode;
}

const badgeStyles: Record<BadgeType, string> = {
  sale: styles.badgeSale,
  new: styles.badgeNew,
  outOfStock: styles.badgeOutOfStock,
};

export function CardBadge({ type, children }: CardBadgeProps) {
  return (
    <span className={`${styles.badge} ${badgeStyles[type]}`}>
      {children}
    </span>
  );
}
