import Sentiment from "sentiment";
import { Feedback } from "../../models/Feedback";

class SentimentAnalysisService {
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
        // comment: feedback.comment,
        sentiment: result.score,
      };
    });

    return sentimentResults;
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();
