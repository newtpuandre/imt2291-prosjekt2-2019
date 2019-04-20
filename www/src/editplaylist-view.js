import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';
import store from './js/store/index';

class EditPlaylistView extends PolymerElement {
  static get properties () {
    return {
      playlist:{
        type: Array
      },
      playlistVideos:{
        type: Array
      },
      userPlaylists:{
        type: Array
      },
      route:{
        type: Object
      },
      editMode:{
        type: Boolean,
        value: false
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
    if (subroute.prefix == "/editplaylist" && subroute.path != ""){ //Only load a specific playlist

      this.set('editMode', true);

      this.route = subroute;

      this.playlist = [];
      fetch (`${window.MyAppGlobals.serverURL}api/getPlaylist.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlist = data;
        console.log(data);
      });
  
      this.playlistVideos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/getPlaylistVideos.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlistVideos = data;
      });

    } else if (subroute.prefix =="/editplaylist" && subroute.path == "") { //Load all users playlists

      this.set('editMode', false);

      this.userPlaylists = [];
      fetch (`${window.MyAppGlobals.serverURL}api/getUserPlaylists.php`,{
        credentials: "include"
      })
      .then(res=>res.json())
      .then(data=>{
        this.userPlaylists = data;
      });
    }
    
  }

  moveUp(e) {
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/updateVideoPos.php?down=0`, {
        method: 'POST',
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      console.log(res);
      if (res.status=='SUCCESS') {  //Handle error
        let i = 0; //Loop variable
        let found = 0; //Index of selected item
        for (var idx of this.playlistVideos){ //Loop over all videos
          if (idx[0] == data.get('vidId')) {
            found = i; //Item is found on index I
          }
          i++;
        }

        var video = this.get(["playlistVideos", found - 1]); //Get item below selected item
        this.set(['playlistVideos.'+ (found - 1)], this.get(["playlistVideos", found])); //Move selected item down 1
        this.set(['playlistVideos.'+ found], video); //Set selected video "slot" to the item below

      } else {

      }   
    })
  }

  moveDown(e) {
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/updateVideoPos.php?down=1`, {
        method: 'POST',
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      console.log(res);
      if (res.status=='SUCCESS') {  //Handle error
        let i = 0;//Loop variable
        let found = 0;//Index of selected item
        for (var idx of this.playlistVideos){ //Loop over all videos
          if (idx[0] == data.get('vidId')) {
            found = i;//Item is found on index I
          }
          i++;
        }

        var video = this.get(["playlistVideos", found + 1]); //Get item above selected item
        this.set(['playlistVideos.'+ (found + 1)], this.get(["playlistVideos", found])); //Move selected item up 1
        this.set(['playlistVideos.'+ found], video); //Set selected video "slot" to the item above
      } else {

      }   
    })


  }

  updatePlaylist(e){

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

        .grid-container {
          display: grid;
          grid-template-columns: auto auto auto;
          padding: 10px;
        }
    
        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          text-align: left;
        }
      </style>

      <div class="card">

        <template is="dom-if" if="{{user.isTeacher}}">
      

        <template is="dom-if" if="{{editMode}}">
        <h1>Endre Spilleliste: [[playlist.name]]</h1>
        <p>Spilleliste navn:</p>
        <input type="text" value="[[playlist.name]]">
        <p>Miniatyrbilde:</p>
        <p><img src="[[playlist.thumbnail]]"></p>
        <p><input type="file"></p>
        <p>Beskrivelse:</p>
        <input type="text" value="[[playlist.description]]">
        <p><button>Oppdater</button></p>
        <h1>Videoer i denne spillelisten</h1>
        <ul>
          <template is="dom-repeat" items="[[playlistVideos]]">
            <li>
            <form class="video" onsubmit="javascript: return false;">
            <input type="hidden" name="vidId" id="vidId" value="[[item.id]]" />
            <input type="hidden" name="routeId" id="routeId" value="[[route.path]]" />
            <b>[[item.title]]</b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <button on-click="moveUp">Flytt opp</button>
            <button on-click="moveDown">Flytt ned</button>
            <button>Bruk video Miniatyrbilde for denne spillelisten</button>
            </form>
            </li>
          </template>
        </ul>
        </template>

        <template is="dom-if" if="{{!editMode}}">
        <h1>Endre spilleliste</h1>
        <div class="grid-container">
          <template is="dom-repeat" items="[[userPlaylists]]">
            <div class="grid-item">
            <b>[[item.name]]</b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <a href="/editplaylist/{{item.id}}"><button>Endre spilleliste</button></a>
            </div>
          </template>
        </div>
        </template>


        </template>

        <template is="dom-if" if="{{!user.isTeacher}}">
        <h1>Du må være en lærer for å se denne siden!</h1>
        </template>

      </div>
    `;
  }


}

customElements.define('editplaylist-view', EditPlaylistView);
