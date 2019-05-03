import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class MyView1 extends PolymerElement {
  static get properties () {
    return {
      videos: {
        type: Array
      },
      playlists: {
        type: Array
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      },
      searchQuery:{
        type: String,
        value: ""
      },
      searchMode:{
        type: Boolean
      },
      searchResultsPlaylist:{
        type: Array
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
    if ((subroute.prefix == "/view1" || subroute.prefix == "/") && subroute.path == ""){ //Only do the following if we are in the playlist page with ID
      this.set('searchMode', false);
      this.videos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/user/getNewVideos.php`)
      .then(res=>res.json())
      .then(data=>{
        this.videos = data;
        console.log(data);
      });
  
      this.playlists = [];
      fetch (`${window.MyAppGlobals.serverURL}api/user/getSubscribedPlaylists.php`,{
        credentials: "include"
      })
      .then(res=>res.json())
      .then(data=>{
        this.playlists = data;
        console.log(data);
      });

    } else if ((subroute.prefix == "/view1" || subroute.prefix == "/") && subroute.path != "") {
      this.set('searchMode', true);
      this.videos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/video/searchVideos.php?q=` + this.searchQuery)
      .then(res=>res.json())
      .then(data=>{
        this.videos = data;
        console.log(data);
      });

      this.searchResultsPlaylist = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/searchPlaylist.php?q=` + this.searchQuery)
      .then(res=>res.json())
      .then(data=>{
      this.searchResultsPlaylist = data;
      console.log(this.searchResultsPlaylist);
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

        .grid-container {
          display: grid;
          grid-template-columns: auto auto auto;
          padding: 5px;
        }
    
        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          margin: 2px;
          padding: 10px;
          text-align: left;
        }
      </style>

      <div class="card">
      <h1>Søk</h1>
      <input type="text" value="{{searchQuery::input}}">
      <a href="/view1/[[searchQuery]]"><button>Søk</button></a>
      <template is="dom-if" if="{{!searchMode}}">
      <h1>Nye Opplastninger</h1>
      <div class="grid-container">
          <template is="dom-repeat" items="[[videos]]">
            <div class="grid-item">
            <b><a href="/video/[[item.id]]">[[item.title]]</a></b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            </div>
          </template>
      </div>
      <template is="dom-if" if="{{user.isStudent}}">
      <h1>Abonnerte spillelister</h1>
      <div class="grid-container">
          <template is="dom-repeat" items="[[playlists]]">
            <div class="grid-item">
            <a data-page="playlist" href="/playlist/{{item.id}}"><b>[[item.name]]</b></a>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Laget av: [[item.lectname]]</p>
            </div>
          </template>
          <template is="dom-if" if="[[!playlists]]">
          <p>Du har ikke abonnert på noen spillelister enda..</p>
          </template>
        </div>
      </template>
      </template>
      <template is="dom-if" if="{{searchMode}}">
      <p><a href="/view1"><- Tilbake</a></p>
      <h2>Søke resultater for: [[searchQuery]]</h2>
      <h2>Videoer:</h2>
      <template is="dom-repeat" items="{{videos}}">
            <div class="grid-item">
            <a href="/video/[[item.id]]"><b>[[item.title]]</b></a>
            <!-- TODO: The serverURL shouldn't be hardcoded -->
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"
                  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <p>Lastet opp av: [[item.name]]</p>
            </div>
          </template>
      <h2>Spillelister</h2>
      <template is="dom-repeat" items="{{searchResultsPlaylist}}">
            <div class="grid-item">
            <b><a href="/playlist/[[item.id]]">[[item.name]]</a></b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            </div>
          </template>
      </template>
    </div>

    `;
  }

}

customElements.define('my-view1', MyView1);
