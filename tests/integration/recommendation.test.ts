import supertest from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/database.js";
import * as recommendationsService from "../../src/services/recommendationsService.js";
import * as recommendationFactory from "../factories/recommendationsFactory.js";

let exports = {};

describe("Sing Me a Song Recommendations Integration Tests", () => {
  describe("POST /recommendations", () => {
    it("Should return 201 for a valid body", async () => {
      const link: recommendationsService.CreateRecommendationData = {
        name: "Ascence - About You",
        youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
      };

      const response = await supertest(app).post("/recommendations").send(link);
      const recommendationsWithSameName = await prisma.recommendation.findMany({
        where: {
          name: link.name,
        },
      });
      const { status } = response;
      expect(status).toEqual(201);
      expect(recommendationsWithSameName.length).toEqual(1);
    });
  });
  describe("POST /recommendations/:id/upvote", () => {
    it("Should return 200 for a valid id", async () => {
      const rec = await recommendationFactory.create();

      const response = await supertest(app).post(
        `/recommendations/${rec.id}/upvote`
      );
      const { status } = response;

      expect(status).toEqual(200);
    });
  });
  describe("POST /recommendations/:id/downvote", () => {
    it("Should return 200 for a valid id", async () => {
      const rec = await recommendationFactory.create();

      const response = await supertest(app).post(
        `/recommendations/${rec.id}/downvote`
      );
      const { status } = response;

      expect(status).toEqual(200);
    });
  });
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
});
