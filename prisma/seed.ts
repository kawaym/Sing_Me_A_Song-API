import prisma from "../src/database.js";

async function main() {
  //upsert = update/insert
  //melhor que create por que pode dar conflito em campos unicos
  await prisma.recommendation.upsert({
    where: { name: "Scarlet Fire" },
    update: {},
    create: {
      name: "Scarlet Fire",
      youtubeLink: "https://www.youtube.com/watch?v=8yOskhDn468",
      score: 0,
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
