#!/usr/bin/env node
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
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const spotifyClient_1 = require("./spotifyClient");
const port = process.env.PORT;
const app = (0, express_1.default)();
// TODO: see if userId is returned on login instead of another call on /me
// TODO: separate client from service - client return the response format
// TODO: get playlist id
// TODO: turn into cli tool
// TODO: add request types
// TODO: does addTracks need to return snapshot id?
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server running at http://localhost:8888 ⚡️");
    yield (0, spotifyClient_1.initialiseSpotifyClient)();
}));
app.get("/login", (res) => {
    (0, spotifyClient_1.redirectLogin)(res);
});
// this is run on the redirect of the login function
app.get("/callback", (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, spotifyClient_1.login)(req);
}));
app.get("/sortPlaylist", (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, service_1.sortPlaylist)(req);
}));
//# sourceMappingURL=api.js.map