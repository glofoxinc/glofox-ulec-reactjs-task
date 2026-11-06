import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GymRow } from './types.js';

const CITIES: Array<{
  city: string;
  country: string;
  lat: number;
  lng: number;
}> = [
  { city: 'London', country: 'GB', lat: 51.5074, lng: -0.1278 },
  { city: 'Manchester', country: 'GB', lat: 53.4808, lng: -2.2426 },
  { city: 'Birmingham', country: 'GB', lat: 52.4862, lng: -1.8904 },
  { city: 'Dublin', country: 'IE', lat: 53.3498, lng: -6.2603 },
  { city: 'Cork', country: 'IE', lat: 51.8985, lng: -8.4756 },
  { city: 'New York', country: 'US', lat: 40.7128, lng: -74.006 },
  { city: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', country: 'US', lat: 41.8781, lng: -87.6298 },
  { city: 'Austin', country: 'US', lat: 30.2672, lng: -97.7431 },
  { city: 'Miami', country: 'US', lat: 25.7617, lng: -80.1918 },
  { city: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 },
  { city: 'Vancouver', country: 'CA', lat: 49.2827, lng: -123.1207 },
  { city: 'Madrid', country: 'ES', lat: 40.4168, lng: -3.7038 },
  { city: 'Barcelona', country: 'ES', lat: 41.3874, lng: 2.1686 },
  { city: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
  { city: 'Berlin', country: 'DE', lat: 52.52, lng: 13.405 },
  { city: 'Amsterdam', country: 'NL', lat: 52.3676, lng: 4.9041 },
  { city: 'Lisbon', country: 'PT', lat: 38.7223, lng: -9.1393 },
  { city: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
  { city: 'Melbourne', country: 'AU', lat: -37.8136, lng: 144.9631 },
  { city: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
  { city: 'Dubai', country: 'AE', lat: 25.2048, lng: 55.2708 },
  { city: 'Sao Paulo', country: 'BR', lat: -23.5505, lng: -46.6333 },
  { city: 'Mexico City', country: 'MX', lat: 19.4326, lng: -99.1332 },
];

const NAME_PREFIXES = [
  'Iron',
  'Peak',
  'Urban',
  'Core',
  'Pulse',
  'Forge',
  'Atlas',
  'Nova',
  'Summit',
  'Motion',
  'Vital',
  'Stride',
];

const NAME_SUFFIXES = [
  'Fitness',
  'Gym',
  'Studio',
  'Athletics',
  'Training',
  'Club',
  'Performance',
  'Strength',
];

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function buildSeedGyms(count = 300): GymRow[] {
  const random = mulberry32(989);
  const gyms: GymRow[] = [];

  for (let i = 0; i < count; i += 1) {
    const place = CITIES[i % CITIES.length];
    const prefix = NAME_PREFIXES[Math.floor(random() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(random() * NAME_SUFFIXES.length)];
    const capacity = 40 + Math.floor(random() * 260);
    const memberCount = Math.floor(capacity * (0.35 + random() * 1.4));
    const bookingsCount = Math.floor(memberCount * (0.8 + random() * 4.5));
    const revenueCents = Math.floor(
      bookingsCount * (800 + random() * 4200) + memberCount * (1500 + random() * 9000),
    );
    const utilization = round(
      Math.min(1.35, Math.max(0.12, bookingsCount / (capacity * 30) + random() * 0.25)),
      2,
    );
    const avgRating = round(2.4 + random() * 2.6, 1);

    gyms.push({
      id: `gym-${String(i + 1).padStart(3, '0')}`,
      name: `${prefix} ${suffix} ${place.city}`,
      city: place.city,
      country: place.country,
      latitude: round(place.lat + (random() - 0.5) * 0.18, 5),
      longitude: round(place.lng + (random() - 0.5) * 0.18, 5),
      bookings_count: bookingsCount,
      revenue_cents: revenueCents,
      capacity,
      member_count: memberCount,
      utilization,
      avg_rating: avgRating,
    });
  }

  return gyms;
}

export function seedDatabase(db: Database.Database, count = 300): number {
  const gyms = buildSeedGyms(count);
  const insert = db.prepare(`
    INSERT INTO gyms (
      id, name, city, country, latitude, longitude,
      bookings_count, revenue_cents, capacity, member_count, utilization, avg_rating
    ) VALUES (
      @id, @name, @city, @country, @latitude, @longitude,
      @bookings_count, @revenue_cents, @capacity, @member_count, @utilization, @avg_rating
    )
  `);

  const tx = db.transaction((rows: GymRow[]) => {
    db.exec('DELETE FROM gyms');
    for (const row of rows) {
      insert.run(row);
    }
  });

  tx(gyms);
  return gyms.length;
}

function main(): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDir = path.join(__dirname, '..', 'data');
  const dbPath = path.join(dataDir, 'gyms.sqlite');
  fs.mkdirSync(dataDir, { recursive: true });

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE gyms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      bookings_count INTEGER NOT NULL,
      revenue_cents INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      member_count INTEGER NOT NULL,
      utilization REAL NOT NULL,
      avg_rating REAL NOT NULL
    );
  `);

  const seeded = seedDatabase(db);
  db.close();
  console.log(`Seeded ${seeded} gyms into ${dbPath}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main();
}
