export interface Report {
  report_id: number;
  report_type: "monthlyFeedback" | "sales";
  generated_date: Date;
  menu_id: number;
  recommendation_id: number;
}
