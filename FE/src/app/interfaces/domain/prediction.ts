export interface DinoType {
  code: string;
  name: string;
}

export interface PredictionCandidate {
  rank: number;
  probability: number;
  dinoType: DinoType;
}

export interface PredictionSummary {
  id: string;
  createdAt: string;
  originalFileName: string;
  dinoType: DinoType;
  probability: number;
}

export interface PredictionDetails {
  id: string;
  createdAt: string;
  originalFileName: string;
  imageUrl: string;
  camImageUrl: string | null;
  modelVersion: string;
  processingMs: number;
  candidates: PredictionCandidate[];
}

export interface PredictionQuery {
  top?: number;
  skip?: number;
  dinoTypeCode?: string;
  from?: string;
  to?: string;
}
