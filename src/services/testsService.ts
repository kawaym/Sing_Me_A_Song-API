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
    [
      "Bitch, Don't Kill my Vibe",
      "https://www.youtube.com/watch?v=GF8aaTu2kg0&list=PLdeOFBcwlKXBUUipt2MvNB4pYB4dh98Yh",
    ],
    ["goosebumps", "https://www.youtube.com/watch?v=Dst9gZkq1a8"],
    ["SICKO MODE", "https://www.youtube.com/watch?v=6ONRf7h3Mdk"],
    ["Highest in the room", "https://www.youtube.com/watch?v=OWl9p3oFKgg"],
    [
      "Why'd you only call me when you're high?",
      "https://www.youtube.com/watch?v=VsxlqmSDmBU",
    ],
    ["505", "https://www.youtube.com/watch?v=qU9mHegkTc4"],
    [
      "Take me Out",
      "https://www.youtube.com/watch?v=Ijk4j-r7qPA&list=RDGMEM6ijAnFTG9nX1G-kbWBUCJA&index=1",
    ],
    [
      "Stolen Dance",
      "https://www.youtube.com/watch?v=iX-QaNzd-0Y&list=RDGMEM6ijAnFTG9nX1G-kbWBUCJA&index=4",
    ],
  ];

  for (let i = 0; i < list.length - 1; i++) {
    testsRepository.seedRecommendations(list[i][0], list[i][1]);
  }
}
