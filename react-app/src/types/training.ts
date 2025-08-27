export interface Training {
  id: string;
  playerId: string;
  playerName: string; // "name - surname" format
  trainingDay: string; // ISO datetime string
  createdBy: string; // trainer user id who created this training
  createdAt: string; // ISO datetime string
}

export interface TrainingFormData {
  playerId: string;
  trainingDay: string;
}
