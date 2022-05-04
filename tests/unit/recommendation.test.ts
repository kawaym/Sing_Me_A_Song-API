import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

describe("Sing Me a Song Recommendations Unit Tests", () => {
  describe("create recommendation", () => {
    it("should create a card with success", async () => {
      const recommendationdCreated = jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValue(null);

      await recommendationService.insert({
        name: "Ascence - About You",
        youtubeLink: "https://www.youtube.com/watch?v=bXHfrdi_fsU",
      });

      expect(recommendationdCreated).toBeCalledTimes(1);
    });
  });
});
