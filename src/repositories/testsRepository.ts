import prisma from "../database.js";

export async function resetDatabase() {
  return prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}

export async function seedRecommendations(name: string, youtubeLink: string) {
  await prisma.recommendation.create({ data: { name, youtubeLink } });
}
