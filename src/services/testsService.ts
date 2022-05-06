import * as testsRepository from "../repositories/testsRepository.js";

export async function resetDatabase() {
  return testsRepository.resetDatabase();
}
export async function seedRecommendations() {
  const list = [
    ["Scarlet Fire", "https://www.youtube.com/watch?v=8yOskhDn468"],
    [
      "Starboy",
      "https://www.youtube.com/watch?v=34Na4j8AVgA&list=RD34Na4j8AVgA&start_radio=1",
    ],
    ["About You", "https://www.youtube.com/watch?v=bXHfrdi_fsU"],
  ];

  for (let i = 0; i < list.length - 1; i++) {
    testsRepository.seedRecommendations(list[i][0], list[i][1]);
  }
}
