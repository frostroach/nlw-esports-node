import express from "express";

const app = express();

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

app.get("/ads", (req, res) => {
  return res.status(200).json(ads);
});

app.listen(3000);
