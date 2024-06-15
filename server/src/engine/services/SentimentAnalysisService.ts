import SqlOperation from '../../database/operations/sqlDBOperations';
import Sentiment from 'sentiment';

class SentimentAnalysisService {
    private db: SqlOperation;
    private sentiment: Sentiment;

    constructor() {
        this.db = new SqlOperation();
        this.sentiment = new Sentiment();
    }

    async analyzeFeedbackSentiments(): Promise<{ feedback_id: number; comment: string; sentiment: number; }[]> {
        const feedbacks = await this.db.selectAll('Feedback', { comment: { $ne: null } }) as { feedback_id: number; comment: string; }[];

        const sentimentResults = feedbacks.map(feedback => {
            const result = this.sentiment.analyze(feedback.comment);
            return {
                feedback_id: feedback.feedback_id,
                comment: feedback.comment,
                sentiment: result.score
            };
        });

        return sentimentResults;
    }
}

export const sentimentAnalysisService = new SentimentAnalysisService();
