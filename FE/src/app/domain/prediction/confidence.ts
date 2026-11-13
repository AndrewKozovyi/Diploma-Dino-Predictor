export type ConfidenceLevel = 'high' | 'medium' | 'low';

const HIGH_CONFIDENCE = 0.8;
const MEDIUM_CONFIDENCE = 0.5;

export const confidenceLevel = (probability: number): ConfidenceLevel => {
  if (probability >= HIGH_CONFIDENCE) {
    return 'high';
  }

  return probability >= MEDIUM_CONFIDENCE ? 'medium' : 'low';
};
