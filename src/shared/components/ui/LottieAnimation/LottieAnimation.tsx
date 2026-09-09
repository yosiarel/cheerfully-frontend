'use client';

import { useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LottieAnimationType, LOTTIE_ANIMATIONS } from '@/shared/constants/lottie';

interface LottieAnimationProps {
  type: LottieAnimationType;
  width?: string | number;
  height?: string | number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  speed?: number;
}

export const LottieAnimation = ({
  type,
  width = '100%',
  height = '100%',
  loop = true,
  autoplay = true,
  className = '',
  speed = 1,
}: LottieAnimationProps) => {
  const src = LOTTIE_ANIMATIONS[type];

  return (
    <div style={{ width, height }} className={className}>
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
