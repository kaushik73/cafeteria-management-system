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

export enum Role {
  Admin = "admin",
  Chef = "chef",
  Employee = "employee",
}

export interface Response<T> {
  status: "success" | "error" | "NAN";
  message: string;
  data: T;
}
