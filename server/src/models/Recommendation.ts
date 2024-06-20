export interface Recommendation {
  meal_type: "lunch" | "dinner" | "breakfast";
  recommendation_date: Date;
  average_rating: number;
  average_sentiment: number;
  rollout_to_employee: boolean | null;
  menu_id: number;
  recommendation_id?: number;
}
