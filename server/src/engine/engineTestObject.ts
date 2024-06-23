import { recommendationEngine } from ".";

async function run() {
<<<<<<< HEAD
  // await recommendationEngine.generateNextDayRecommendations(
  //   "dinner",
  //   (data: any) => {
  //     console.log("data-getNextDayRecommendation", data);
  //   }
  // );
  // await recommendationEngine.getNextDayRecommendations(
  //   "dinner",
  //   (data: any) => {
  //     console.log("data-getNextDayRecommendation", data);
  //   }
  // );
  // const ItemsToDiscard = await recommendationEngine.getItemsToDiscard();
  // console.log(ItemsToDiscard, "ItemsToDiscard");
=======
  await recommendationEngine.generateNextDayRecommendation((data: any) => {
    console.log("data-getNextDayRecommendation", data);
  });
  await recommendationEngine.getNextDayRecommendations((data: any) => {
    console.log("data-getNextDayRecommendation", data);
  });
>>>>>>> e10dfd21a8b093fc80a8046e1f240ed46a74aa27
}

run();
