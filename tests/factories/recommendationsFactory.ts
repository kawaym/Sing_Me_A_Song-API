import * as recommendationsService from "../../src/services/recommendationsService.js";
import prisma from "../../src/database.js";

export async function create() {
  const recommendation: recommendationsService.CreateRecommendationData = {
    name: "Ascence - About You",
    youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
  };

  const response = await prisma.recommendation.create({ data: recommendation });
  return response;
}

export async function lowScore() {
  const rec = await create();

  const response = await prisma.recommendation.update({
    data: { score: -5 },
    where: { id: rec.id },
  });
  return response;
}
