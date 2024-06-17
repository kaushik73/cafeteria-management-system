export interface Recommendation {
  meal_type: "lunch" | "dinner" | "breakfast";
  recommendation_date: Date;
  average_rating: number;
  is_prepared: boolean | null;
  menu_id: number;
  recommendation_id?: number;
}
