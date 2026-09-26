'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import Link from 'next/link';
import styles from './HeroParallax.module.css';

export interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

export const HeroParallax = ({
  products,
  headerTitle,
  headerSubtitle,
}: {
  products: Product[];
  headerTitle?: React.ReactNode;
  headerSubtitle?: React.ReactNode;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div ref={ref} className={styles.container}>
      <Header title={headerTitle} subtitle={headerSubtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className={styles.motionWrapper}
      >
        <motion.div className={styles.rowReverse}>
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className={styles.row}>
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        {thirdRow.length > 0 && (
          <motion.div className={styles.rowReverse}>
            {thirdRow.map((product) => (
              <ProductCard product={product} translate={translateX} key={product.title} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const Header = ({
  title,
  subtitle,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        {title || (
          <>
            The Ultimate <br /> development studio
          </>
        )}
      </h2>
      <p className={styles.description}>
        {subtitle ||
          'We build beautiful products with the latest technologies and frameworks. We are a team of passionate developers and designers that love to build amazing products.'}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className={styles.productCard}
    >
      <Link href={product.link} className={styles.productLink}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.productImage}
          loading="lazy"
        />
      </Link>
      <div className={styles.overlay}></div>
      <h3 className={styles.productTitle}>{product.title}</h3>
    </motion.div>
  );
};
