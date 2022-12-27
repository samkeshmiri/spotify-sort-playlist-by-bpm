import {
  getUserId,
  getPlaylistTracks,
  sortTracks,
  createPlaylist,
  addTracks,
  getPlaylistName,
} from "./spotifyClient";

export async function sortPlaylist(id: string) {
  if (!id) {
    throw new Error("provide playlist ID e.g. /sortPlaylist?id=xxx");
  }
  const playlistId = id;
  const { name } = await getPlaylistName(playlistId);
  const userId = await getUserId();
  const { tracks } = await getPlaylistTracks(playlistId);
  const sortedTracks = await sortTracks(tracks);
  const newPlaylistId = await createPlaylist(userId, name);
  await addTracks(newPlaylistId, sortedTracks);
}
