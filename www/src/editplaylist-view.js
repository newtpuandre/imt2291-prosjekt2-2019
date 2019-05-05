import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import './shared-styles.js';
import store from './js/store/index';

class EditPlaylistView extends PolymerElement {
  static get properties () {
    return {
      playlist:{
        type: Array
      },
      serverURL: {
        type: String,
        value: window.MyAppGlobals.serverURL
      },
      playlistVideos:{
        type: Array
      },
      userPlaylists:{
        type: Array
      },
      userVideos:{
        type: Array
      },
      route:{
        type: Object
      },
      editMode:{
        type: Boolean,
        value: false
      },
      addVideo:{
        type: Boolean,
        value: false
      },
      posEdit:{
        type:Boolean,
        value: true
      },
      playName:{
        type: String
      },
      playDesc:{
        type: String
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      },
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
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getPlaylist.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlist = data;
        this.playName = this.playlist.name;
        this.playDesc = this.playlist.description;
      });


      this.playlistVideos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getPlaylistVideos.php?id=` + subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.playlistVideos = data;
      });

      this.userVideos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getUserVideos.php`,{
        credentials: "include"
      })
      .then(res=>res.json())
      .then(data=>{
        this.userVideos = data;
      });

    } else if (subroute.prefix =="/editplaylist" && subroute.path == "") { //Load all users playlists

      this.set('editMode', false);

      this.userPlaylists = [];
      fetch (`${window.MyAppGlobals.serverURL}api/playlist/getUserPlaylists.php`,{
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
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/updateVideoPos.php?down=0`, {
        method: 'POST',
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      let i = 0;//Loop variable
      let found = 0;//Index of selected item
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
        toast.show("Kunne ikke flytte videoen opp..");
      }   
    })
  }

  moveDown(e) {
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/updateVideoPos.php?down=1`, {
        method: 'POST',
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      let toast = document.querySelector("#toast");
      toast.close();
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
        toast.show("Kunne ikke flytte videoen ned..");
      }   
    })


  }

  updatePlaylist(e){
    const data = new FormData(e.target.form);
    data.append("pname", this.playName);
    data.append("pdesc", this.playDesc);
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/updatePlaylist.php`, {
      method: 'POST',
      credentials: 'include',
      body: data
    }
  ).then(res=>res.json())         // When a reply has arrived
  .then(res=>{
    let toast = document.querySelector("#toast");
    toast.close();
    if (res.status != 'ERROR' && res.status != 'SUCCESS') {  //Handle error
      this.set('playlist.thumbnail', res.status);
      toast.show("Spillelisten er nå oppdatert");
    } else if (res.status != 'ERROR'){
      toast.show("Spillelisten er nå oppdatert");
    }  else {
      toast.show("En feil oppstod");
    }
  })
  }
  
  addremvideo(e) {
    if(this.addVideo == false)
    this.set('addVideo', true);
    this.set('posEdit', false);

    //Dont show duplicate videos.
    if(this.playlistVideos != null){
      for(var myVideo of this.playlistVideos){
        let i = 0;
        for(var userVideo of this.userVideos){
          if (myVideo[0] == userVideo[0]){
            this.splice("userVideos", i , 1 );
          }
          i++;
        }
      }
    }
  }

  posedit(e) {
    console.log(this.playlistVideos);
    if(this.posEdit == false)
    this.set('posEdit', true);
    this.set('addVideo', false);
  }

  selectVid(e){
    const data = new FormData(e.target.form);
    /*for (var pair of data.entries())
    {
      console.log(pair[0]+ ', '+ pair[1]); 
    }*/
    
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/addVideoToPlaylist.php?id=` + this.route.path, {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
    });

    let i = 0;
    for (var idx of this.userVideos){ //Loop over all userVideos
      if (idx[0] == data.get('vidId')) { //Find selected and remove it from userVideos

        var video = this.get(["userVideos", i]); //Get array element
        if(this.playlistVideos == null) {
          this.playlistVideos = [];
        }
        this.push("playlistVideos", video); //Add to selected video list

        this.splice("userVideos", i, 1); //Remove from the other list
      }
        i++;
    }

  }

  removeVid(e){
    const data = new FormData(e.target.form);
    /*for (var pair of data.entries())
    {
      console.log(pair[0]+ ', '+ pair[1]); 
    }*/
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/deleteVideoFromPlaylist.php?id=` + this.route.path, {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
    });

    let i = 0;
    for (var idx of this.playlistVideos){ //Loop over all userVideos
      if (idx[0] == data.get('vidId[]')) { //Find selected and remove it from userVideos

        var video = this.get(["playlistVideos", i]); //Get array element
        this.push("userVideos", video); //Add to selected video list

        this.splice("playlistVideos", i, 1); //Remove from the other list
      }
        i++;
    }
  }

  useThumbnail(e){
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/updatePlaylistThumbnail.php?p=` + this.route.path + `&v=` + data.get('vidId'), {
      credentials: 'include'
    })
    .then(res=>res.json())
    .then(data=>{
      if (data.status != 'ERROR') {  //Handle error
        this.set('playlist.thumbnail', data.status);
        toast.show("Spillelisten er nå oppdatert");
      }  else {
        toast.show("En feil oppstod");
      }
    });


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

        <template is="dom-if" if="{{user.isTeacher}}">
      

        <template is="dom-if" if="{{editMode}}">
        <h1>Endre Spilleliste: [[playlist.name]]</h1>
        <hr>
        <form class="editPlaylist" onsubmit="javascript: return false;">
        <input type="hidden" name="pId" id="pId" value="[[playlist.id]]" />
        <paper-input label="Spilleliste navn" value="{{playName}}" maxlength="64" style="width:240px;"></paper-input>
        <p>Miniatyrbilde:</p>
        <p><img src="[[playlist.thumbnail]]" width="320" height="160"></p>
        <p><input type="file" name="thumbnail" id="thumbnail"></p>
        <paper-textarea label="Beskrivelse" value="{{playDesc}}" maxlength="256" style="width:240px;"></paper-textarea>
        <p><paper-button raised><button on-click="updatePlaylist">Oppdater</button></paper-button></p>
        </form>
        <paper-button raised><button on-click="posedit" >Endre Video rekkefølge</button></paper-button>
        <paper-button raised><button on-click="addremvideo">Legg til / fjern Videoer</button></paper-button>
        <template is="dom-if" if="{{posEdit}}">
        <h1>Videoer i denne spillelisten</h1>
        <hr>
        <ul>
          <template is="dom-repeat" items="{{playlistVideos}}">
            <li>
            <form class="video" onsubmit="javascript: return false;">
            <input type="hidden" name="vidId" id="vidId" value="[[item.id]]" />
            <input type="hidden" name="routeId" id="routeId" value="[[route.path]]" />
            <b>[[item.title]]</b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <paper-button raised><button on-click="moveUp">Flytt opp</button></paper-button>
            <paper-button raised><button on-click="moveDown">Flytt ned</button></paper-button>
            <paper-button raised><button on-click="useThumbnail">Bruk som thumbnail</button></paper-button>
            <!-- <button>Bruk video Miniatyrbilde for denne spillelisten</button> -->
            </form>
            </li>
          </template>
        </ul>
        </template>
        <template is="dom-if" if="{{addVideo}}">

        <h1>Videoer i spillelisten</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="{{playlistVideos}}">
            <div class="grid-item">

            <form class="removeVideo" name="removeVideo" id="removeVideo" onsubmit="javascript: return false;">
            <b>[[item.title]]</b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <input type="hidden" name="vidId[]" id="vidId" value="[[item.id]]" />
            <p><paper-button raised><button on-click="removeVid">Fjern fra spillelisten</button></paper-button ></p>
            </form>

            </div>
          </template>
        </div>

        <h1>Tilgjengelige Videoer</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" id="list" items="{{userVideos}}" >
          <div class="grid-item">

          <form class="selectVid" name="selectVid" id="selectVid" onsubmit="javascript: return false;">
            <b>[[item.title]]</b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <input type="hidden" name="vidId" id="vidId" value="[[item.id]]" />
            <p><paper-button raised><button on-click="selectVid">Velg Video</button></paper-button></p>
          </form>

          </div>
          </template>
        </div>

        </template>
        </template>

        <template is="dom-if" if="{{!editMode}}">
        <h1>Endre spilleliste</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="[[userPlaylists]]">
            <div class="grid-item">
            <b>[[item.name]]</b>
            <p><img src="[[item.thumbnail]]" width="320" height="160"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <a href="/editplaylist/{{item.id}}"><paper-button raised><button>Endre spilleliste</button></paper-button></a>
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
