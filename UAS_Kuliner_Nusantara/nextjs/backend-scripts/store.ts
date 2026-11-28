import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data");

export interface UserRec {
  userId: number; email: string; username: string;
  password: string; role: string; profile: string; createdAt: string;
}

export interface FavoriteRec {
  favoriteId: number; userId: number; restaurantId: string; createdAt: string;
}

export interface ReviewRec {
  reviewId: number; userId: number; restaurantId: string;
  rating: number; comment: string; createdAt: string;
}

export interface RestoRec {
  id: string; name: string; city: string; place: string; desc: string;
  cat: string; tag: string; status: string; open_hour: string; rating: number;
  price: string; official_website: string; instagram: string; image: string;
  user_id?: number | null; created_at?: string;
}

// antrian supaya penulisan file tidak tabrakan
let queue: Promise<unknown> = Promise.resolve();

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DIR, file), "utf-8");
    return JSON.parse(raw.replace(/^\uFEFF/, "")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  const job = queue.then(() =>
    fs.writeFile(path.join(DIR, file), JSON.stringify(data, null, 2), "utf-8"),
  );
  queue = job.catch(() => {});
  return job;
}

export const readUsers = () => readJson<UserRec[]>("users.json", []);
export const writeUsers = (d: UserRec[]) => writeJson("users.json", d);

export const readFavorites = () => readJson<FavoriteRec[]>("favorites.json", []);
export const writeFavorites = (d: FavoriteRec[]) => writeJson("favorites.json", d);

export const readReviews = () => readJson<ReviewRec[]>("reviews.json", []);
export const writeReviews = (d: ReviewRec[]) => writeJson("reviews.json", d);

export const readRestos = () => readJson<RestoRec[]>("data.json", []);
export const writeRestos = (d: RestoRec[]) => writeJson("data.json", d);

export const readPages = () => readJson<Record<string, any>>("pages.json", {});
export const writePages = (d: Record<string, any>) => writeJson("pages.json", d);

export function nextId<T>(list: T[], pick: (x: T) => number) {
  return list.reduce((m, x) => Math.max(m, pick(x)), 0) + 1;
}

export function toApiResto(r: RestoRec, email?: string) {
  return {
    id: r.id, name: r.name, city: r.city, place: r.place,
    description: r.desc, desc: r.desc,
    cat: r.cat, tag: r.tag, status: r.status,
    openHour: r.open_hour, open_hour: r.open_hour,
    rating: r.rating, price: r.price,
    officialWebsite: r.official_website, official_website: r.official_website,
    instagram: r.instagram,
    image: r.image, userId: r.user_id ?? null,
    ...(email !== undefined ? { email } : {}),
  };
}

// pengganti query JOIN Review + User + Restaurant
export async function joinReviews() {
  const [reviews, users, restos] = await Promise.all([
    readReviews(), readUsers(), readRestos(),
  ]);
  return reviews
    .slice()
    .sort((a, b) => b.reviewId - a.reviewId)
    .map((rv) => {
      const u = users.find((x) => x.userId === rv.userId);
      const rs = restos.find((x) => x.id === rv.restaurantId);
      return {
        review_id: rv.reviewId, rating: rv.rating, comment: rv.comment,
        created_at: rv.createdAt,
        username: u?.username ?? null, email: u?.email ?? null,
        user_id: rv.userId,
        restaurant_id: rv.restaurantId,
        restaurant_name: rs?.name ?? null, city: rs?.city ?? null,
        owner_id: rs?.user_id ?? 0,
      };
    });
}

// hitung jumlah per bulan (tahun berjalan) untuk grafik admin
export function perMonth(dates: (string | undefined)[]) {
  const year = new Date().getFullYear();
  const out = Array(12).fill(0);
  dates.forEach((d) => {
    if (!d) return;
    const t = new Date(d.replace(" ", "T"));
    if (!isNaN(+t) && t.getFullYear() === year) out[t.getMonth()]++;
  });
  return out;
}