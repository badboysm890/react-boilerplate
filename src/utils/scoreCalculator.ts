// Weights for overall score calculation
const WEIGHTS = {
  EDUCATION: 0.25,
  EXPERIENCE: 0.35,
  SKILLS: 0.40
};

export function calculateSkillScore(matches: string[], missing: string[]): number {
  const totalSkills = matches.length + missing.length;
  if (totalSkills === 0) return 0;
  
  return Math.round((matches.length / totalSkills) * 100);
}

export function calculateOverallScore(
  educationScore: number,
  experienceScore: number,
  skillScore: number
): number {
  return Math.round(
    (educationScore * WEIGHTS.EDUCATION) +
    (experienceScore * WEIGHTS.EXPERIENCE) +
    (skillScore * WEIGHTS.SKILLS)
  );
}

export function formatScore(score: number): string {
  return `${score}%`;
}