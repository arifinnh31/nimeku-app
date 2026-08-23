export const ALL_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Historical",
  "Horror",
  "Isekai",
  "Martial Arts",
  "Mecha",
  "Military",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "School",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const SEASONS = [
  "Winter",
  "Spring",
  "Summer",
  "Fall",
] as const;

export const SCHEDULE_DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

export const ADMIN_STATS = {
  totalAnime: 0,
  totalEpisodes: 0,
  viewsToday: 0,
  weeklyGrowth: 0,
};

/**
 * Format Season & Tahun agar rapi dan tidak redundan (misal: "Winter 2026", bukan "Winter 2026 2026")
 */
export function formatSeasonYear(season?: string | null, year?: number | null): string {
  if (!season && !year) return "-";
  if (!season) return year ? year.toString() : "-";
  if (!year) return season;
  if (season.includes(year.toString())) return season;
  return `${season} ${year}`;
}
