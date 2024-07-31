export interface Feedback {
  feedback_id: number;
  rating: number;
  comment: string;
  feedback_date: Date;
  user_id: number;
  menu_id: number;
}

export interface FeedbackReport {
  item_name: string;
  average_rating: number;
  total_feedbacks: number;
}

export interface FeedbackRow {
  item_name: string;
  average_rating: string;
  total_feedbacks: number;
}
