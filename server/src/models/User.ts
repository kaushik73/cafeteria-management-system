export interface IUser {
  id: number;
  role: "admin" | "chef" | "employee";
  name: string;
  email: string;
  user_id?: number;
  password: string;
}

export interface IUserAndPreference {
  id: number;
  role: "admin" | "chef" | "employee";
  name: string;
  email: string;
  user_id?: number;
  password: string;
  preference_id: number;
  dietary_preference: "vegetarian" | "non-vegetarian" | "eggetarian";
  spice_level: "high" | "medium" | "low";
  cuisine_preference: "north-indian" | "south-indian" | "other";
  sweet_tooth: boolean;
}
