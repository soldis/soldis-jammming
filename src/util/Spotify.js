import QueryString from 'query-string';

const clientID = '90dbda5272cc423ca8daaad46cb5de10';
const redirectURI = 'http://soldis-jammming.surge.sh';
const scope = 'playlist-modify-public playlist-modify-private';
const apiSearchUri = 'https://api.spotify.com/v1/search?';
const apiGetProfileUri = 'https://api.spotify.com/v1/me';
const apiPlaylistUri = 'https://api.spotify.com/v1/users/';

let Spotify = {
  token: '',
  user_id: '',
  expires: null,

// Authenticate if we have token in our hash string and get user_id
  init: function(){
    if (document.location.hash){
      // After probable redirection with access token
      let params = QueryString.parse(document.location.hash);
      if ('access_token' in params){
        // Saving access_token and expiration date
        this.token = params.access_token;
        if ('expires_in' in params){
          let dt = new Date();
          dt = dt.setTime(dt.getTime() + (params.expires_in - 60)*1000);
          this.expires = dt;
        }
        // Cleaning hash string
        document.location.hash = '';
        // Retrieveing user id
        if (this.user_id == ''){
          fetch(apiGetProfileUri, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`
            }
          }).then(
            response => {
              if (response.ok){
                return response.json();
              }
              console.log(response);
              throw new Error("Error in request!");
            },
            networkError => {
              console.log(`Network error: ${networkError}`);
              throw new Error('Network error!');
            }
          ).then(
            jsonResponse => {
              if ('id' in jsonResponse){
                this.user_id = jsonResponse.id;
              }
            }
          );
        }
      }
    }
  },

// Check if we are still logged in
  isLoggedIn(){
    if (this.token === '' || this.id === '') return false;
    if(this.expires){
      let dt = new Date();
      if (dt < this.expires) return true;
    }
    this.token = '';
    return false;
  },

// Search tracks
  search: function(term){
    return fetch(`${apiSearchUri}q=${term}&type=track`, {
      headers: {
        Host: 'api.spotify.com',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    }).then(
      response => {
        if (response.ok){
          return response.json();
        }
        console.log(response);
        throw new Error("Error in request!");
      },
      networkError => {
        console.log(`Network error: ${networkError}`);
        throw new Error('Network error!');
      }
    ).then(
      jsonResponse => {
        if ('tracks' in jsonResponse){
          return jsonResponse.tracks.items.map(item => {
            return {
              id: item.id,
              name: item.name,
              album: item.album.name,
              artist: item.artists[0].name
            };
          });
        }
      }
    );
    console.log(`Searching Spotify for ${encodeURI(term)}...`);
  },

// add playlist with tracks to Spotify account
  addPlayList: function(playListName, playList){
    // make request string and JSON object for creating playlist
    let addPlayListUri = apiPlaylistUri + this.user_id + '/playlists';
    let playlistJSON = {
      name: playListName
    };

    // create a playlist
    return fetch(addPlayListUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(playlistJSON)
    }).then(
      response => {
        if (response.ok){
          return response.json();
        }
        console.log(response);
        throw new Error("Error in request!");
      },
      networkError => {
        console.log(`Network error: ${networkError}`);
        throw new Error('Network error!');
      }
    ).then(jsonResponse => {
      // if we succeeded in creating a playlist continue with adding tracks to it
      if ('id' in jsonResponse){
        // make request string and JSON object
        let addTrackUri = apiPlaylistUri + this.user_id + '/playlists/' + jsonResponse.id + '/tracks';
        let tracksJSON = {
          uris: playList.map(track => {
            return 'spotify:track:' + track.id;
          })
        };
        return fetch(addTrackUri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify(tracksJSON)
        }).then(
          response => {
            if (response.ok){
              return true;
            }
            console.log(response);
            throw new Error("Error in request!");
          },
          networkError => {
            console.log(`Network error: ${networkError}`);
            throw new Error('Network error!');
          }
        );
      }
    });
  },

// Perform authentication request
  login: function(){
    this.token = '';
    this.expires = null;
    let loginString = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${encodeURI(redirectURI)}&scope=${encodeURI(scope)}&response_type=token`;
    document.location.href = loginString;
  }
};

export default Spotify;
