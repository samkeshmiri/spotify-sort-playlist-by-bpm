"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylistName = exports.addTracks = exports.getUserId = exports.createPlaylist = exports.sortTracks = exports.getPlaylistTracks = exports.getAccessToken = exports.login = exports.redirectLogin = exports.initialiseSpotifyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const refreshToken = process.env.REFRESH_TOKEN;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:8888/callback";
let spotifyApiClient;
function initialiseSpotifyClient() {
    return __awaiter(this, void 0, void 0, function* () {
        spotifyApiClient = axios_1.default.create({
            baseURL: "https://api.spotify.com/v1",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${yield getAccessToken()}`,
            },
        });
        spotifyApiClient.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            throw error;
        });
    });
}
exports.initialiseSpotifyClient = initialiseSpotifyClient;
function redirectLogin(res) {
    const scopes = "playlist-modify-public playlist-read-private playlist-modify-private";
    const state = "some_state";
    res.redirect("https://accounts.spotify.com/authorize?" +
        qs_1.default.stringify({
            response_type: "code",
            client_id,
            scope: scopes,
            redirect_uri,
            state,
        }));
}
exports.redirectLogin = redirectLogin;
function login(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = request.query.code;
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const spotifyAccountClient = axios_1.default.create({
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
        yield spotifyAccountClient.post(tokenUrl, body, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    Buffer.from(client_id + ":" + client_secret).toString("base64"),
            },
        });
        yield getAccessToken();
    });
}
exports.login = login;
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const axiosRequester = axios_1.default.create({
            baseURL: tokenUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        };
        const { data } = yield axiosRequester.post(tokenUrl, body, {
            headers: {
                Authorization: "Basic " +
                    Buffer.from(client_id + ":" + client_secret).toString("base64"),
                "Content-type": "application/x-www-form-urlencoded",
            },
        });
        console.log("set new access token");
        return data.access_token;
    });
}
exports.getAccessToken = getAccessToken;
function getPlaylistTracks(playlistId) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/playlists/${playlistId}/tracks`;
        const { data } = yield spotifyApiClient.get(endpoint);
        const tracks = data.items.map((i) => i.track.id);
        return { tracks };
    });
}
exports.getPlaylistTracks = getPlaylistTracks;
function sortTracks(tracks) {
    return __awaiter(this, void 0, void 0, function* () {
        const ids = "?ids=" + tracks.join(",");
        const endpoint = `/audio-features${ids}`;
        const { data } = yield spotifyApiClient.get(endpoint);
        const map = new Map();
        data.audio_features.forEach((t) => {
            map.set(t.uri, t.tempo);
        });
        return Array.from(new Map([...map.entries()].sort((a, b) => a[1] - b[1])).keys());
    });
}
exports.sortTracks = sortTracks;
function createPlaylist(userId, playlistName) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/users/${userId}/playlists`;
        const newPlaylistName = `${playlistName}_bpm_sort`;
        const { data } = yield spotifyApiClient.post(endpoint, {
            name: newPlaylistName,
        });
        return data.id;
    });
}
exports.createPlaylist = createPlaylist;
function getUserId() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = "/me";
        const { data } = yield spotifyApiClient.get(endpoint);
        return data.id;
    });
}
exports.getUserId = getUserId;
function addTracks(playlistId, tracks) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/playlists/${playlistId}/tracks`;
        yield spotifyApiClient.post(endpoint, tracks);
        console.log("tracks added to playlist");
    });
}
exports.addTracks = addTracks;
function getPlaylistName(playlistId) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = `/playlists/${playlistId}`;
        const { data } = yield spotifyApiClient.get(endpoint);
        return data;
    });
}
exports.getPlaylistName = getPlaylistName;
//# sourceMappingURL=spotifyClient.js.map