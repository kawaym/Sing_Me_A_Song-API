import { jest } from "@jest/globals";
import * as recommendationRepository from "../../src/repositories/recommendationRepository.js";
import * as recommendationService from "../../src/services/recommendationsService.js";
import * as errorUtils from "../../src/utils/errorUtils.js";
import * as recommendationFactory from "../factories/recommendationsFactory.js";

let exports = {};

describe("Sing Me a Song Recommendations Unit Tests", () => {
  describe("create recommendation", () => {
    it("should create a card with success", async () => {
      const recommendationdCreated = jest.spyOn(
        recommendationRepository,
        "create"
      );

      await recommendationService.insert({
        name: "Ascence - About You",
        youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
      });

      expect(recommendationdCreated).toBeCalledTimes(1);
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

      expect(recommendationUpvoted).toBeCalledTimes(1);
      expect(recommendationFound).toBeCalledTimes(1);
      expect(recommendationUpvoted).toHaveBeenCalledWith(id, "increment");
    });
    it("should throw an error for a invalid id", async () => {
      const id = 9999999999;

      const errorThrew = jest.spyOn(errorUtils, "notFoundError");

      await recommendationService.upvote(id);

      expect(errorThrew).toBeCalledTimes(1);
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

      expect(recommendationDownvoted).toBeCalledTimes(1);
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

      const errorThrew = jest.spyOn(errorUtils, "notFoundError");

      await recommendationService.downvote(id);

      expect(errorThrew).toBeCalledTimes(1);
    });
  });
});
