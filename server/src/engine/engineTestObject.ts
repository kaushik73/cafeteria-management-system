import { recommendationEngine } from ".";

recommendationEngine.generateNextDayRecommendation((data: any) => {
  // console.log("data", data);
});
recommendationEngine.getNextDayRecommendation((data: any) => {
  console.log("data-getNextDayRecommendation", data);
});
