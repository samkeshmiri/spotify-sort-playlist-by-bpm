import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  RefreshToken,
  GetPlaylistTracksResponse,
  TrackAnalysisResponse,
  CreatePlaylistResponse,
  MeResponse,
  AddTracksToPlaylistResponse,
  Playlist,
} from "./types";
import QueryString from "qs";
import * as dotenv from "dotenv";

dotenv.config();

const refreshToken = process.env.REFRESH_TOKEN;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:8888/callback";

let spotifyApiClient: AxiosInstance;

export async function initialiseSpotifyClient() {
  spotifyApiClient = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  spotifyApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      throw error;
    }
  );
}

export function redirectLogin(res: any) {
  const scopes =
    "playlist-modify-public playlist-read-private playlist-modify-private";
  const state = "some_state";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      QueryString.stringify({
        response_type: "code",
        client_id,
        scope: scopes,
        redirect_uri,
        state,
      })
  );
}

export async function login(request: any) {
  const code = request.query.code;
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const spotifyAccountClient: AxiosInstance = axios.create({
    baseURL: tokenUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = {
    code,
    redirect_uri,
    grant_type: "authorization_code",
  };

  await spotifyAccountClient.post(tokenUrl, body, {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  await getAccessToken();
}

export async function getAccessToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const axiosRequester: AxiosInstance = axios.create({
    baseURL: tokenUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const { data }: AxiosResponse<RefreshToken> = await axiosRequester.post(
    tokenUrl,
    body,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log("set new access token");
  return data.access_token;
}

export async function getPlaylistTracks(playlistId: string) {
  const endpoint = `/playlists/${playlistId}/tracks`;
  const { data } = await spotifyApiClient.get<GetPlaylistTracksResponse>(
    endpoint
  );
  const tracks = data.items.map((i) => i.track.id);
  return { tracks };
}

export async function sortTracks(tracks: string[]) {
  const ids = "?ids=" + tracks.join(",");
  const endpoint = `/audio-features${ids}`;
  const { data } = await spotifyApiClient.get<TrackAnalysisResponse>(endpoint);
  const map = new Map<string, number>();

  data.audio_features.forEach((t) => {
    map.set(t.uri, t.tempo);
  });

  return Array.from(
    new Map([...map.entries()].sort((a, b) => a[1] - b[1])).keys()
  );
}

export async function createPlaylist(userId: string, playlistName: string) {
  const endpoint = `/users/${userId}/playlists`;
  const newPlaylistName = `${playlistName}_bpm_sort`;

  const { data } = await spotifyApiClient.post<CreatePlaylistResponse>(
    endpoint,
    {
      name: newPlaylistName,
    }
  );

  return data.id;
}

export async function getUserId() {
  const endpoint = "/me";
  const { data } = await spotifyApiClient.get<MeResponse>(endpoint);
  return data.id;
}

export async function addTracks(playlistId: string, tracks: string[]) {
  const endpoint = `/playlists/${playlistId}/tracks`;

  await spotifyApiClient.post<AddTracksToPlaylistResponse>(endpoint, tracks);
  console.log("tracks added to playlist");
}

export async function getPlaylistName(playlistId: string) {
  const endpoint = `/playlists/${playlistId}`;
  const { data } = await spotifyApiClient.get<Playlist>(endpoint);
  return data;
}
