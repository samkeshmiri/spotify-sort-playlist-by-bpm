#!/usr/bin/env ts-node

import express from "express";
import { sortPlaylist } from "./service";
import { initialiseSpotifyClient, login, redirectLogin } from "./spotifyClient";
import yargs from "yargs";
import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
const app = express();

// TODO: see if userId is returned on login instead of another call on /me
// TODO: get playlist id
// TODO: add request types

const argv = yargs
  .usage("Usage: -id <id>")
  .option("id", {
    alias: "id",
    describe: "Playlist ID",
    type: "string",
  })
  .parseSync();

async function bootstrap() {
  app.listen(port, async () => {
    console.log("Server running at http://localhost:8888 ⚡️");
    await initialiseSpotifyClient();
  });
}

app.get("/login", (res: any) => {
  redirectLogin(res);
});

// run on the redirect of the login function
app.get("/callback", async (req: any) => {
  await login(req);
});

app.get("/sortPlaylist", async (req: any) => {
  await sortPlaylist(req.query.id);
});

async function sortPlaylistRequest(id: string) {
  await initialiseSpotifyClient();
  await sortPlaylist(id);
}

if (argv.id) {
  sortPlaylistRequest(argv.id);
} else {
  bootstrap();
}
