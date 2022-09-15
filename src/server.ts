import express from "express";
import { PrismaClient } from "@prisma/client";
import convertHoursIntoMinutes from "./utils/convertHoursIntoMinutes";
import convertMinutesToHourString from "./utils/convertMinutesToHourString";
import cors from "cors";

const app = express();
const prisma = new PrismaClient({ log: ["query"] });
app.use(cors());

app.use(express.json());

const ads = [
  {
    id: 1,
    title: "Anúncio 1",
  },
  {
    id: 2,
    title: "Anúncio 2",
  },
  {
    id: 3,
    title: "Anúncio 3",
  },
];

app.get("/games", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    });

    return res.json(games);
  } catch (err) {
    console.log(err);
  }
});

app.post("/games/:gameId/ads", async (req, res) => {
  const { gameId } = req.params;
  const body: any = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId: gameId,
      discord: body.discord,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      weekDays: body.weekDays.join(","),
      hourEnd: convertHoursIntoMinutes(body.hourEnd),
      hourStart: convertHoursIntoMinutes(body.hourStart),
      useVoiceChannel: body.useVoiceChannel,
    },
  });
  return res.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const { id } = req.params;

  const ads = await prisma.ad.findMany({
    select: {
      gameId: true,
      hourEnd: true,
      hourStart: true,
      id: true,
      name: true,
      useVoiceChannel: true,
      weekDays: true,
      yearsPlaying: true,
    },
    where: {
      gameId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const updatedAds = ads.map((ad) => ({
    ...ad,
    weekDays: ad.weekDays.split(","),
    hourStart: convertMinutesToHourString(ad.hourStart),
    hourEnd: convertMinutesToHourString(ad.hourEnd),
  }));

  return res.status(200).json(updatedAds);
});

app.get("/games/:id/discord", async (req, res) => {
  const { id } = req.params;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: id,
    },
  });

  return res.status(200).json({ discord: ad.discord });
});

console.log("rodando na porta 3000");
app.listen(3000);
