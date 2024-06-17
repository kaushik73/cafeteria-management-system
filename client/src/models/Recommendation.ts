export interface Recommendation {
  recommendation_id: number;
  meal_type: "lunch" | "dinner" | "breakfast";
  recommendation_date: Date;
  average_rating: number;
  is_prepared: boolean | null;
  menu_id: number;
}
