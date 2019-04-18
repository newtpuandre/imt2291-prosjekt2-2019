import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';
import store from './js/store/index';

class PlaylistView extends PolymerElement {
  static get properties () {
    return {
      playlist:{
        type:Array
      },
      playlistVideos:{
        type:Array
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      }
    }
  }

  

  constructor () {
    super();
    const data = store.getState();
    this.user = data.user;
    
    store.subscribe((state)=>{
      this.user = store.getState().user;
    })
  }

  static get observers() {
    return [
        'loadData(subroute)'
    ]
  }

  loadData(subroute){
    if (subroute.prefix == "/playlist" && subroute.path != ""){ //Only do the following if we are in the playlist page with ID
      this.playlist = [];
      fetch (`${window.MyAppGlobals.serverURL}api/getPlaylist.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlist = data;
      });
  
      /*this.playlistVideos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/getPlaylistVideos.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlist = data;
      });*/
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

      </style>
      <app-router>
            <app-route path="/playlist/:playlistId"></app-route>
        </app-router>
      <div class="card">
        <h1>Spilleliste: [[playlist.name]]</h1>
        <p><img src="[[playlist.thumbnail]]"></p>
        <p>Beskrivelse: [[playlist.description]]</p>
        <template is="dom-if" if="{{user.isStudent}}">
        <button>Abonner</button>
        </template>
        <h1>Videoer i denne spillelisten</h1>
        <template is="dom-if" if="[[!playlistVideos]]">
        <p>Det finnes ingen videoer i denne spillelisten enda..</p>
        </template>
        <template is="dom-if" if="[[playlistVideos]]">
        <p>Videoer</p>
        </template>

      </div>
    `;
  }
    
}

customElements.define('playlist-view', PlaylistView);
