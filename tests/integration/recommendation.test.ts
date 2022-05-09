import supertest from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/database.js";
import recommendationService, {
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import recommendationFactory from "../factories/recommendationsFactory.js";

let exports = {};

describe("Sing Me a Song Recommendations Integration Tests", () => {
  describe("POST /recommendations", () => {
    it("Should return 201 for a valid body", async () => {
      const link: CreateRecommendationData = {
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
  describe("GET /recommendations", () => {
    it("should return an array of recommendations", async () => {
      await recommendationFactory.create();
      const response = await supertest(app).get("/recommendations");
      const { status, body } = response;
      expect(status).toEqual(200);
      expect(body.length).toBeLessThanOrEqual(10);
    });
  });
  describe("GET /recommendations/:id", () => {
    it("should return a recommendation", async () => {
      const { id } = await recommendationFactory.create();
      const response = await supertest(app).get(`/recommendations/${id}`);

      const { status } = response;
      expect(status).toEqual(200);
    });
  });
  describe("GET /recommendations/random", () => {
    it("should return a recommendation", async () => {
      await recommendationFactory.createMany();
      const response = await supertest(app).get("/recommendations/random");

      const { status } = response;
      expect(status).toEqual(200);
    });
  });
  describe("GET /recommendations/top/:amount", () => {
    it("should return an array of recommendations", async () => {
      await recommendationFactory.createMany();
      const amount = 3;
      const response = await supertest(app).get(
        `/recommendations/top/${amount}`
      );

      const { status, body } = response;
      expect(status).toEqual(200);
      expect(body.length).toEqual(amount);
    });
  });
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
});
