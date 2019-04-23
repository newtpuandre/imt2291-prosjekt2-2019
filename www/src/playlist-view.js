import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';
import store from './js/store/index';

class PlaylistView extends PolymerElement {
  static get properties () {
    return {
      playlist:{
        type: Array
      },
      playlistVideos:{
        type: Array
      },
      isSubscribed:{
        type: Boolean,
        value: false
      },
      route:{
        type: Object
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

      this.route = subroute;

      this.playlist = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getPlaylist.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlist = data;
      });
  
      this.playlistVideos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getPlaylistVideos.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlistVideos = data;
      });

      fetch (`${window.MyAppGlobals.serverURL}api/user/getSubscriptionStatus.php?id=` + subroute.path ,{
        credentials: "include"
      })
      .then(res=>res.json())
      .then(data=>{
        this.isSubscribed = data;
      });
    }
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        ul {
          list-style-type: none;
        }

      </style>

      <div class="card">
        <h1>Spilleliste: [[playlist.name]]</h1>
        <p><img src="[[playlist.thumbnail]]"></p>
        <p>Beskrivelse: [[playlist.description]]</p>
        <template is="dom-if" if="{{user.isStudent}}">
        <template is="dom-if" if="{{isSubscribed}}">
        <button on-click="subButton">Avslutt abonnementet</button>
        </template>
        <template is="dom-if" if="{{!isSubscribed}}">
        <button on-click="subButton">Abonner</button>
        </template>
        </template>
        <h1>Videoer i denne spillelisten</h1>
        <ul>
          <template is="dom-repeat" items="[[playlistVideos]]">
            <li>
            <b>[[item.title]]</b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            </li>
          </template>
        </ul>

      </div>
    `;
  }
 
  subButton(e){
    this.set('isSubscribed', !this.isSubscribed);
    let sub;
    if(!this.isSubscribed) {
      console.log("Unsub");
      sub = 0;
    } else {
      console.log("subscribed");
      sub = 1;
    }

    fetch (`${window.MyAppGlobals.serverURL}api/user/changeSubStatus.php?id=` + this.route.path + `&sub=` + sub,{
      credentials: "include"
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
    });


  }

}

customElements.define('playlist-view', PlaylistView);
