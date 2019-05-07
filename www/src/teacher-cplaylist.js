import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import store from './js/store/index';

class TeacherCPlaylist extends PolymerElement {

  constructor () {
    super();

    //Get users videos
    this.userVideos = [];
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/getUserVideos.php`,{
      credentials: "include"
    })
    .then(res=>res.json())
    .then(data=>{
      this.userVideos = data;
      //console.log(data);
    });

    this.selectedVideos = [];
    
    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    })
  }

  static get properties() {
    return {
      serverURL: {
        type: String,
        value: window.MyAppGlobals.serverURL
      },
      userVideos:{
        type: Array,
        notify: true
      },
      selectedVideos:{
        type: Array,
        notify: true
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
      }
    };
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
        <h1>Lag spilleliste</h1>
        <hr>
        <form onsubmit="javascript: return false;" id="createPlaylist" enctype="multipart/form-data">
        <paper-input label="Spilleliste navn" value="{{playName}}" maxlength="64"></paper-input>
        <paper-textarea label="Beskrivelse" value="{{playDesc}}" maxlength="256"></paper-textarea>
        <p>Miniatyrbilde</p>
        <input type="file" name="thumbnail" id="thumbnail" accept="image/*">
        <p><paper-button raised><button on-click="create">Lag spilleliste</button></paper-button></p>
        <h1>Valgte Videoer</h1>
        <div class="grid-container">
          <template is="dom-repeat" items="[[selectedVideos]]">
            <div class="grid-item">
            <b>[[item.title]]</b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail" width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <input type="hidden" name="vidId[]" id="vidId" value="[[item.id]]" />
            <p><paper-button raised><button on-click="removeVid">Fjern fra valgt video</button></paper-button></p>

            </div>
          </template>
        </div>
        </form>
        <h1>Velg Videoer (Videoer kan velges senere)</h1>

        <div class="grid-container">
          <template is="dom-repeat" id="list" items="{{userVideos}}" >
          <div class="grid-item">

          <form class="selectVideo" name="selectVideo" id="selectVideo" onsubmit="javascript: return false;">
            <b>[[item.title]]</b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail" width="100" height="52"></p>
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

        <template is="dom-if" if="{{!user.isTeacher}}">
         <h1>Du må være lærer for å se denne siden.</h1>
        </template>
      </div>

    `;
  }

  //Create playlist
  create(e) {
    const data = new FormData(e.target.form);
    data.append("name", this.playName);
    data.append("description", this.playDesc);

    //Create playlist and insert into DB
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/createPlaylist.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      let toast = document.querySelector("#toast");
      toast.close();
      if(res.status == 'SUCCESS') {
          toast.show("Spilleliste er nå opprettet");
      } else {
        toast.show("En feil oppstod");
      }  
    })
  }

  /**
   * Select video and add it to the playlist
   */
  selectVid(e){
    const data = new FormData(e.target.form);
    let i = 0;
    for (var idx of this.userVideos){ //Loop over all userVideos
      if (idx[0] == data.get('vidId')) { //Find selected and remove it from userVideos

        var video = this.get(["userVideos", i]); //Get array element
        this.push("selectedVideos", video); //Add to selected video list

        this.splice("userVideos", i, 1); //Remove from the other list
      }
        i++;
    }
  }

  /**
   * Remove videos from the playlist
   */
  removeVid(e){
    const data = new FormData(e.target.form);
    /*for (var pair of data.entries())
    {
      console.log(pair[0]+ ', '+ pair[1]); 
    }*/
    let i = 0;
    for (var idx of this.selectedVideos){ //Loop over all userVideos
      if (idx[0] == data.get('vidId[]')) { //Find selected and remove it from userVideos

        var video = this.get(["selectedVideos", i]); //Get array element
        this.push("userVideos", video); //Add to selected video list

        this.splice("selectedVideos", i, 1); //Remove from the other list
      }
        i++;
    }
  }
}

customElements.define('teacher-cplaylist', TeacherCPlaylist);
