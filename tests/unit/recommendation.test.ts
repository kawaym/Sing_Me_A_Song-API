import { jest } from "@jest/globals";
import recommendationRepository from "../../src/repositories/recommendationRepository.js";
import recommendationService, {
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import errorUtils from "../../src/utils/errorUtils.js";
import recommendationFactory from "../factories/recommendationsFactory.js";
import prisma from "../../src/database.js";

describe("Sing Me a Song Recommendations Unit Tests", () => {
  describe("create recommendation", () => {
    it("should create a card with success", async () => {
      const recData: CreateRecommendationData = {
        name: "About You",
        youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
      };

      const recommendationdCreated = jest.spyOn(
        recommendationRepository,
        "create"
      );

      await recommendationService.insert(recData);

      expect(recommendationdCreated).toBeCalledTimes(1);
      expect(recommendationdCreated).toBeCalledWith(recData);
    });
  });
  describe("upvote recommendation", () => {
    it("should upvote a valid id with success", async () => {
      const { id } = await recommendationFactory.create();

      const recommendationUpvoted = jest.spyOn(
        recommendationRepository,
        "updateScore"
      );
      const recommendationFound = jest.spyOn(recommendationRepository, "find");

      await recommendationService.upvote(id);

      expect(recommendationUpvoted).toHaveBeenCalledWith(id, "increment");
      expect(recommendationUpvoted).toBeCalledTimes(1);
      expect(recommendationFound).toBeCalledTimes(1);
    });
    it("should throw an error for a invalid id", async () => {
      const id = 9999999999;

      expect(async () => {
        await recommendationService.upvote(id);
      }).rejects.toStrictEqual({ message: "", type: "not_found" });
    });
  });
  describe("downvote recommendation", () => {
    it("should downvote a valid id with success", async () => {
      const { id } = await recommendationFactory.create();

      const recommendationDownvoted = jest.spyOn(
        recommendationRepository,
        "updateScore"
      );
      const recommendationFound = jest.spyOn(recommendationRepository, "find");

      await recommendationService.downvote(id);

      expect(recommendationFound).toBeCalledTimes(1);
      expect(recommendationDownvoted).toHaveBeenCalledWith(id, "decrement");
    });
    it("should succesfully erase a low score recommendation", async () => {
      const { id } = await recommendationFactory.lowScore();

      const recommendationErased = jest.spyOn(
        recommendationRepository,
        "remove"
      );

      await recommendationService.downvote(id);

      expect(recommendationErased).toBeCalledTimes(1);
    });
    it("should throw an error for a invalid id", async () => {
      const id = 9999999999;

      expect(async () => {
        await recommendationService.downvote(id);
      }).rejects.toStrictEqual({ message: "", type: "not_found" });
    });
  });
  describe("get recommendation", () => {
    it("should  return an array of recommendations", async () => {
      await recommendationFactory.create();

      const recommendationFound = jest.spyOn(
        recommendationRepository,
        "findAll"
      );

      await recommendationService.get();

      expect(recommendationFound).toBeCalledTimes(1);
    });
  });
  describe("get recommendation by id", () => {
    it("should return a recommendation", async () => {
      const rec = await recommendationFactory.create();

      const recommendationFound = jest.spyOn(recommendationRepository, "find");

      const response = await recommendationService.getById(rec.id);

      expect(recommendationFound).toBeCalledWith(rec.id);
      expect(response.name).toEqual(rec.name);
    });
  });
  describe("get top recommendations", () => {
    it("should return an array of lenght X", async () => {
      const amount = 3;
      await recommendationFactory.create();

      const recommendationFound = jest.spyOn(
        recommendationRepository,
        "getAmountByScore"
      );

      await recommendationService.getTop(amount);

      expect(recommendationFound).toBeCalledTimes(1);
      expect(recommendationFound).toBeCalledWith(amount);
    });
  });
  describe("get random recommendations", () => {
    describe("and get correct filter", () => {
      it("should return 'lte' when random >= 0.7", () => {
        const value = 0.7;

        const response = recommendationService.getScoreFilter(value);

        expect(response).toBe("lte");
      });
      it("should return 'gt' when random < 0.7", () => {
        const value = 0.3;

        const response = recommendationService.getScoreFilter(value);

        expect(response).toBe("gt");
      });
      beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
      });
    });
    describe("and get recommendations by score", () => {
      it("should return recommendations when lenght isn't 0", async () => {
        const list = [
          { id: 1, name: "dummy", youtubeLink: "dummy", score: 11 },
          { id: 2, name: "dummy1", youtubeLink: "dummy1", score: 11 },
          { id: 3, name: "dummy2", youtubeLink: "dummy2", score: 12 },
          { id: 4, name: "dummy3", youtubeLink: "dummy3", score: 13 },
          { id: 5, name: "dummy4", youtubeLink: "dummy4", score: 41 },
          { id: 6, name: "dummy5", youtubeLink: "dummy5", score: 43 },
          { id: 7, name: "dummy6", youtubeLink: "dummy6", score: 23 },
        ];
        const recommendationFound = jest
          .spyOn(recommendationRepository, "findAll")
          .mockResolvedValue(list);

        const response = await recommendationService.getByScore("gt");

        expect(recommendationFound).toBeCalledTimes(1);
        expect(response).toBe(list);
      });
      it("should return findAll() when length is 0", async () => {
        const list = [
          { id: 1, name: "dummy", youtubeLink: "dummy", score: 11 },
          { id: 2, name: "dummy1", youtubeLink: "dummy1", score: 0 },
          { id: 3, name: "dummy2", youtubeLink: "dummy2", score: 12 },
          { id: 4, name: "dummy3", youtubeLink: "dummy3", score: -4 },
          { id: 5, name: "dummy4", youtubeLink: "dummy4", score: 41 },
          { id: 6, name: "dummy5", youtubeLink: "dummy5", score: 1 },
          { id: 7, name: "dummy6", youtubeLink: "dummy6", score: 23 },
        ];
        const recommendationFound = jest
          .spyOn(recommendationRepository, "findAll")
          .mockResolvedValueOnce([]);
        await recommendationService.getByScore("lte");

        expect(recommendationFound).toBeCalledTimes(2);
        expect(recommendationFound).toHaveBeenLastCalledWith();
      });
      beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
    });
    it("should call auxiliary functions correctly", async () => {
      const value = 0.7;
      const random = jest.spyOn(Math, "random").mockReturnValue(value);
      const scoreFilter = jest
        .spyOn(recommendationService, "getScoreFilter")
        .mockReturnValue("lte");

      const recommendations = jest
        .spyOn(recommendationService, "getByScore")
        .mockResolvedValue([
          { id: 1, name: "dummy", youtubeLink: "dummy", score: 10 },
          { id: 2, name: "dummy1", youtubeLink: "dummy1", score: 0 },
          { id: 3, name: "dummy2", youtubeLink: "dummy2", score: -5 },
          { id: 4, name: "dummy3", youtubeLink: "dummy3", score: -4 },
          { id: 5, name: "dummy4", youtubeLink: "dummy4", score: 8 },
          { id: 6, name: "dummy5", youtubeLink: "dummy5", score: 1 },
          { id: 7, name: "dummy6", youtubeLink: "dummy6", score: 2 },
        ]);

      const randomIndex = jest.spyOn(Math, "floor").mockReturnValue(1);

      const response = await recommendationService.getRandom();
      expect(random).toBeCalledTimes(2);
      expect(randomIndex).toBeCalledTimes(1);
    });
    it("should throw when no recommendations are found", async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;

      jest.spyOn(Math, "random").mockReturnValue(0.3);
      jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue("gt");
      jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

      return expect(
        async () => await recommendationService.getRandom()
      ).rejects.toStrictEqual({ message: "", type: "not_found" });
    });
    beforeEach(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
  });
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
