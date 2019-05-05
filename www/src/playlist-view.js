import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-button/paper-button.js';
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
      serverURL: {
        type: String,
        value: window.MyAppGlobals.serverURL
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

        paper-button {
          padding:0;
        }

        paper-button::shadow .button-content {
          padding:0;
        }

        paper-button button {
          padding:1em;
          background-color: transparent;
          border-color: transparent;
        }

        paper-button button::-moz-focus-inner {
          border: 0;
        }

      </style>

      <div class="card">
        <h1>Spilleliste: [[playlist.name]]</h1>
        <p><img src="[[playlist.thumbnail]]" width="360" height="180"></p>
        <p>Beskrivelse: [[playlist.description]]</p>
        <p>Laget av: [[playlist.lectname]]</p>
        <template is="dom-if" if="{{user.isStudent}}">
        <template is="dom-if" if="{{isSubscribed}}">
        <paper-button raised><button on-click="subButton">Avslutt abonnementet</button></paper-button>
        </template>
        <template is="dom-if" if="{{!isSubscribed}}">
        <paper-button raised><button on-click="subButton">Abonner</button></paper-button>
        </template>
        </template>
        <h1>Videoer i denne spillelisten</h1>
        <ul>
          <template is="dom-repeat" items="[[playlistVideos]]">
            <li>
            <a href="video/[[item.id]]"><b>[[item.title]]</b></a>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
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
      sub = 0;
    } else {
      sub = 1;
    }

    fetch (`${window.MyAppGlobals.serverURL}api/user/changeSubStatus.php?id=` + this.route.path + `&sub=` + sub,{
      credentials: "include"
    })
    .then(res=>res.json())
    .then(data=>{
      let toast = document.querySelector("#toast");
      toast.close();
      if(data.status == 'SUCCESS') {
        if(sub == 1) {
          toast.show("Du er nå abonnert");
        } else {
          toast.show("Du har nå avsluttet abonnementet");
        }
      } else {
        toast.show("En feil oppstod");
      }
    });


  }

}

customElements.define('playlist-view', PlaylistView);
