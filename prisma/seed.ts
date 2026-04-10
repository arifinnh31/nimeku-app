import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.downloadLink.deleteMany();
  await prisma.streamServer.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.anime.deleteMany();

  console.log("Seeding data...");

  // 1. One Piece
  await prisma.anime.create({
    data: {
      title: "One Piece",
      slug: "one-piece",
      titleJapanese: "ワンピース",
      synopsis: "Gol D. Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line...",
      coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-6nS6DdbT6A9D.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-6nS6DdbT6A9D.jpg",
      rating: 8.9,
      type: "TV",
      status: "Ongoing",
      studio: "Toei Animation",
      season: "Fall",
      year: 1999,
      genres: ["Action", "Adventure", "Fantasy"],
      currentEpisode: 1100,
      totalEpisodes: null,
      airedDay: "Minggu",
      airedTime: "09:30",
      episodes: {
        create: [
          {
            number: 1100,
            title: "The Peak of Piracy! Luffy vs. Kaido",
            releasedAt: new Date("2026-03-24T00:00:00Z"),
            servers: {
              create: [
                { name: "Server 1", type: "embed", url: "https://player.example.com/embed/op1100" },
                { name: "Direct", type: "direct", url: "https://example.com/stream/op1100.mp4" },
              ],
            },
            downloadLinks: {
              create: [
                { resolution: "720p", provider: "GDrive", url: "https://drive.google.com/op1100-720p" },
                { resolution: "1080p", provider: "Mega", url: "https://mega.nz/op1100-1080p" },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Solo Leveling
  await prisma.anime.create({
    data: {
      title: "Solo Leveling",
      slug: "solo-leveling",
      titleJapanese: "俺だけレベルアップな件",
      synopsis: "Ten years ago, 'the Gate' appeared and connected the real world with the realm of magic and monsters...",
      coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-6JE798Y9X7W2.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-6JE798Y9X7W2.jpg",
      rating: 8.7,
      type: "TV",
      status: "Ongoing",
      studio: "A-1 Pictures",
      season: "Winter",
      year: 2024,
      genres: ["Action", "Adventure", "Fantasy"],
      currentEpisode: 12,
      totalEpisodes: 12,
      airedDay: "Sabtu",
      airedTime: "23:30",
      episodes: {
        create: [
          {
            number: 12,
            title: "Arise",
            releasedAt: new Date("2026-03-30T00:00:00Z"),
            servers: {
              create: [
                { name: "Server 1", type: "embed", url: "https://player.example.com/embed/sl12" },
              ],
            },
            downloadLinks: {
              create: [
                { resolution: "1080p", provider: "GDrive", url: "https://drive.google.com/sl12-1080p" },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Frieren
  await prisma.anime.create({
    data: {
      title: "Frieren: Beyond Journey's End",
      slug: "frieren-beyond-journeys-end",
      titleJapanese: "葬送のフリーレン",
      synopsis: "The adventure is over but life goes on for an elf mage beginning to learn what living is all about...",
      coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-nByS6S43M2G6.jpg",
      bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-nByS6S43M2G6.jpg",
      rating: 9.1,
      type: "TV",
      status: "Completed",
      studio: "Madhouse",
      season: "Fall",
      year: 2023,
      genres: ["Adventure", "Drama", "Fantasy"],
      currentEpisode: 28,
      totalEpisodes: 28,
      airedDay: "Jumat",
      airedTime: "22:00",
      episodes: {
        create: [
          {
            number: 28,
            title: "The Journey to Ende Continues",
            releasedAt: new Date("2026-03-22T00:00:00Z"),
            servers: {
              create: [
                { name: "Server 1", type: "embed", url: "https://player.example.com/embed/frieren28" },
              ],
            },
            downloadLinks: {
              create: [
                { resolution: "1080p", provider: "GDrive", url: "https://drive.google.com/frieren28-1080p" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seeding finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
