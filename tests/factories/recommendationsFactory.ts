import * as recommendationsService from "../../src/services/recommendationsService.js";
import prisma from "../../src/database.js";
import { faker } from "@faker-js/faker";

async function create() {
  const recommendation: recommendationsService.CreateRecommendationData = {
    name: "About You",
    youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
  };

  const response = await prisma.recommendation.create({ data: recommendation });
  return response;
}

async function lowScore() {
  const rec = await create();

  const response = await prisma.recommendation.update({
    data: { score: -50 },
    where: { id: rec.id },
  });
  return response;
}

async function createMany() {
  const list = [];
  for (let i = 0; i <= 20; i++) {
    list.push({
      name: faker.name.firstName(),
      youtubeLink: faker.internet.url(),
      score: parseInt(faker.random.numeric(3, { allowLeadingZeros: true })),
    });
  }

  const response = await prisma.recommendation.createMany({ data: list });
  return response;
}

const recommendationsFactory = { create, lowScore, createMany };
export default recommendationsFactory;
