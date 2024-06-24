import Sentiment from "sentiment";
import { Feedback } from "../../models/Feedback";

class EngineSentimentAnalysisService {
  private sentiment: Sentiment;

  constructor() {
    this.sentiment = new Sentiment();
  }

  async analyzeFeedbackSentiments(
    feedbacks: Feedback[]
  ): Promise<{ feedback_id: number; sentiment: number }[]> {
    const sentimentResults = feedbacks.map((feedback) => {
      const result = this.sentiment.analyze(feedback.comment);
      return {
        feedback_id: feedback.feedback_id,
        sentiment: result.score,
        rating: feedback.rating,
      };
    });

    return sentimentResults;
  }

  async calculateAverageSentiment(feedbacks: Feedback[]): Promise<number> {
    const sentimentResults =
      await engineSentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);

    let totalSentiment = 0;
    for (const feedback of feedbacks) {
      const sentiment =
        sentimentResults.find(
          (result) => result.feedback_id === feedback.feedback_id
        )?.sentiment || 0;
      totalSentiment += sentiment;
    }

    const averageSentiment = totalSentiment / feedbacks.length;
    // console.log("Calculated average sentiment:", averageSentiment);
    return averageSentiment;
  }
}

export const engineSentimentAnalysisService =
  new EngineSentimentAnalysisService();
