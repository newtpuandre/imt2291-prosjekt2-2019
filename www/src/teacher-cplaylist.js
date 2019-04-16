import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class TeacherCPlaylist extends PolymerElement {

  constructor () {
    super();

    this.userVideos = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getUserVideos.php`,{
      credentials: "include"
    })
    .then(res=>res.json())
    .then(data=>{
      this.userVideos = data;
      console.log(data);
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
      userVideos:{
        type: Array,
      },
      selectedVideos:{
        type: Array
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
      </style>

      <div class="card">
      <template is="dom-if" if="{{user.isTeacher}}">
        <h1>Lag spilleliste</h1>
        <form class="createPlaylist" name="createPlaylist" id="createPlaylist" onsubmit="javascript: return false;">
        <p>Spilleliste navn</p>
        <input type="text" name="name"/>
        <p>Beskrivelse</p>
        <input type="text" name="description"/>
        <p>miniatyrbilde</p>
        <input type="file" name="thumbnail" accept="image/*">
        <p><button on-click="create">Lag spilleliste</button></p>
        <template is="dom-repeat" items="[[selectedVideos]]">
        [[item.title]]
        </template>
        </form>
        <h1>Velg Videoer (Videoer kan velges senere)</h1>

        <div class="grid-container">
          <template id="list" is="dom-repeat" items="{{userVideos}}">
          <div class="grid-item">

          <form class="selectVideo" name="selectVideo" id="selectVideo" onsubmit="javascript: return false;">
            <b>[[item.title]]</b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <input type="hidden" name="vidId" id="vidId" value="[[item.id]]" />
            <p><button on-click="selectVid">Velg Video</button></p>
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

  create(e) {
    const data = new FormData(e.target.form); // Wrap the form in a FormData object
    fetch (`${window.MyAppGlobals.serverURL}api/createPlaylist.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      console.log(res);
      if (res.status=='SUCCESS') {  //Handle error

      } else {

      }   
    })
  }

  selectVid(e){

    const data = new FormData(e.target.form);
    /*for (var pair of data.entries())
    {
      console.log(pair[0]+ ', '+ pair[1]); 
    }*/
    let i = 0;
    for (var idx of this.userVideos){ //Loop over all userVideos
      console.log(i);
      if (idx[0] == data.get('vidId')) { //Find selected and remove it from userVideos
        console.log(i + "delete");
        this.userVideos.splice(i, 1);
        console.log(this.userVideos);
      }
        i++;
    }

  }

}

customElements.define('teacher-cplaylist', TeacherCPlaylist);
