/**
 * One decimal place is as precise as a softmax score deserves. The extremes are
 * shown as bounds so a near-certain score never reads as "100.0%" and a
 * negligible one never reads as "0.0%".
 */
export function formatPercent(probability: number): string {
  if (probability > 0.9995) return ">99.9%";
  if (probability > 0 && probability < 0.0005) return "<0.1%";
  return `${(probability * 100).toFixed(1)}%`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
