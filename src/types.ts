export type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type RefreshToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
};

export type Playlist = {
  description: string;
  id: string;
  name: string;
};

export type CurrentUserPlaylists = {
  items: Playlist[];
};

export type GetPlaylistTracksResponse = {
  items: Item[];
};

type Item = {
  track: Track;
};

type Track = {
  id: string;
  name: string;
  uri: string;
};

export interface Tracks {
  trackId: string[];
}

export type TrackAnalysisResponse = {
  audio_features: AudioFeatures[];
};

type AudioFeatures = {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
};

export type MeResponse = {
  id: string;
};

export type CreatePlaylistResponse = {
  id: string;
};

export type AddTracksToPlaylistResponse = {
  snapshot_id: string;
};
