import { Prisma } from "@prisma/client";
import prisma from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

export async function create(
  createRecommendationData: CreateRecommendationData
) {
  await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

export function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);

  return prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: "desc" },
  });
}

export function getAmountByScore(take: number) {
  return prisma.recommendation.findMany({
    orderBy: { score: "desc" },
    take,
  });
}

export function getFindAllFilter(
  findAllWhere?: FindAllWhere
): Prisma.RecommendationWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

export function find(id: number) {
  return prisma.recommendation.findUnique({
    where: { id },
  });
}

export async function updateScore(
  id: number,
  operation: "increment" | "decrement"
) {
  await prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

export async function remove(id: number) {
  await prisma.recommendation.delete({
    where: { id },
  });
}
