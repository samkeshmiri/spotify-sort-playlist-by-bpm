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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPlaylist = void 0;
const spotifyClient_1 = require("./spotifyClient");
function sortPlaylist(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.query.id) {
            throw new Error("provide playlist ID e.g. /sortPlaylist?id=xxx");
        }
        const playlistId = req.query.id.toString();
        const { name } = yield (0, spotifyClient_1.getPlaylistName)(playlistId);
        const userId = yield (0, spotifyClient_1.getUserId)();
        const { tracks } = yield (0, spotifyClient_1.getPlaylistTracks)(playlistId);
        const sortedTracks = yield (0, spotifyClient_1.sortTracks)(tracks);
        const createdPlaylistId = yield (0, spotifyClient_1.createPlaylist)(userId, name);
        yield (0, spotifyClient_1.addTracks)(createdPlaylistId, sortedTracks);
    });
}
exports.sortPlaylist = sortPlaylist;
//# sourceMappingURL=service.js.map