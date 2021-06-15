import * as express from "express";
import { MongoClient } from "mongodb";

const PORT = process.env.PORT ?? "3000";
const DB_HOST = process.env.DB_HOST ?? null;

const server = express();

server.get("/connect-db", async (_req, res) => {
  const connected = await (async (): Promise<boolean> => {
    try {
      if (DB_HOST === null) return false;
      const mongoClient = await MongoClient.connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return mongoClient.isConnected();
    } catch {
      return false;
    }
  })();

  const status = connected ? 200 : 500;
  res.status(status).json({ data: { connected } });
});

server.get("/ping", (_req, res) => {
  res.status(200).json({ data: { message: "pong" } });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
