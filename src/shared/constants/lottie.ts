export const LOTTIE_ANIMATIONS = {
  // Lottie JSON paths (these should be placed in public/lottie/ directory)
  LOADER: 'https://lottie.host/5adfecab-c189-4132-8d35-f343281be774/UsaexsfpSx.lottie',
  SUCCESS: 'https://lottie.host/8643e26a-26d0-4b9b-ab5f-cde27942387d/i8moXMHRpg.lottie',
  ERROR: 'https://lottie.host/9d56662f-3364-40b2-b16f-13da7cf700fb/7Yu9sAy5bs.lottie',
  EMPTY_CART: 'https://lottie.host/e34086f1-e474-4dc3-8ba3-8a5ca1a671f3/qm43W5KNIR.lottie',
  NOT_FOUND: 'https://lottie.host/cb696ccc-f65f-4a81-b011-e7f01baeedaa/3ubV7Zfwga.lottie',
  PAYMENT_PENDING: 'https://lottie.host/d6b5b899-4e60-476b-9230-769eea11714b/JWKlpishF8.lottie',
  CONFETTI: 'https://lottie.host/da355024-2ab2-4e5e-b3f1-c6eef643adb6/B4BNFUzIjI.lottie',
} as const;

export type LottieAnimationType = keyof typeof LOTTIE_ANIMATIONS;
