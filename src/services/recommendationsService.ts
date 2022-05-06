import { Recommendation } from "@prisma/client";
import * as recommendationRepository from "../repositories/recommendationRepository.js";
import * as errorUtils from "../utils/errorUtils.js";

export type CreateRecommendationData = Omit<Recommendation, "id" | "score">;

export async function insert(
  createRecommendationData: CreateRecommendationData
) {
  await recommendationRepository.create(createRecommendationData);
}

export async function upvote(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw errorUtils.notFoundError();

  await recommendationRepository.updateScore(id, "increment");
}

export async function downvote(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw errorUtils.notFoundError();

  await recommendationRepository.updateScore(id, "decrement");

  if (recommendation.score < -5) {
    await recommendationRepository.remove(id);
  }
}

export async function getById(id: number) {
  return recommendationRepository.find(id);
}

export async function get() {
  return recommendationRepository.findAll();
}

export async function getTop(amount: number) {
  return recommendationRepository.getAmountByScore(amount);
}

export async function getRandom() {
  const random = Math.random();
  const scoreFilter = getScoreFilter(random);

  const recommendations = await getByScore(scoreFilter);
  if (recommendations.length === 0) {
    throw errorUtils.notFoundError();
  }

  const randomIndex = Math.floor(Math.random() * recommendations.length);
  return recommendations[randomIndex];
}

export async function getByScore(scoreFilter: "gt" | "lte") {
  const recommendations = await recommendationRepository.findAll({
    score: 10,
    scoreFilter,
  });

  if (recommendations.length > 0) {
    return recommendations;
  }

  return recommendationRepository.findAll();
}

function getScoreFilter(random: number) {
  if (random < 0.7) {
    return "gt";
  }

  return "lte";
}
