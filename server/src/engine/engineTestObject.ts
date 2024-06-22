import { recommendationEngine } from ".";

async function run() {
  await recommendationEngine.generateNextDayRecommendation((data: any) => {
    console.log("data-getNextDayRecommendation", data);
  });
  await recommendationEngine.getNextDayRecommendations((data: any) => {
    console.log("data-getNextDayRecommendation", data);
  });
}

run();
