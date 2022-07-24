const { Pool } = require('pg');
const { playlistModel } = require('./model/playlistModel');
const { songsListResponseModel } = require('./model/songsListResponseModel');

class PlaylistsServices {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const playlistQuery = {
      text: 'select * from playlists where playlists.id = $1',
      values: [playlistId],
    };

    const playlistSongsQuery = {
      text: `select songs.* from songs inner join playlist_songs
      on playlist_songs.song_id = songs.id
      where playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const playlistInfoResult = await this.pool.query(playlistQuery);
    const playlistSongsResult = await this.pool.query(playlistSongsQuery);

    return playlistInfoResult.rows.map(playlistModel)
      .map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        songs: playlistSongsResult.rows.map(songsListResponseModel),
      }))[0];
  }
}

module.exports = PlaylistsServices;
