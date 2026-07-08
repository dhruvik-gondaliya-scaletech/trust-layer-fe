export function useTrustTier(trustScore: number) {
  let tier = "GETTING STARTED";
  if (trustScore >= 1 && trustScore < 60) tier = "LOW";
  else if (trustScore >= 60 && trustScore < 80) tier = "MEDIUM";
  else if (trustScore >= 80 && trustScore < 100) tier = "HIGH";
  else if (trustScore === 100) tier = "EXCELLENT";
  return tier;
}
