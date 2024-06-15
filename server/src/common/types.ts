export interface FeedbackReport {
  item_name: string;
  average_rating: number;
  total_feedbacks: number;
}

export interface FeedbackRow {
  item_name: string;
  average_rating: string; // AVG returns a DECIMAL, which is returned as a string in MySQL
  total_feedbacks: number;
}

export enum Role {
  Admin = "admin",
  Chef = "chef",
  Employee = "employee",
}

