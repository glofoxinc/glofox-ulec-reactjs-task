export type GymRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  bookings_count: number;
  revenue_cents: number;
  capacity: number;
  member_count: number;
  utilization: number;
  avg_rating: number;
};

export type Gym = GymRow;
