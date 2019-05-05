import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class StudentView1 extends PolymerElement {
  static get properties () {
    return {
      playlists: {
        type: Array
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
    if (subroute.prefix == "/student" && subroute.path == ""){

      this.playlists = [];
      fetch (`${window.MyAppGlobals.serverURL}api/user/getSubscribedPlaylists.php`,{
        credentials: "include"
      })
      .then(res=>res.json())
      .then(data=>{
        this.playlists = data;
        console.log(data);
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
          padding: 10px;
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
      <template is="dom-if" if="{{user.isStudent}}">
        <h1>Abonnerte Spillelister</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="[[playlists]]">
            <div class="grid-item">
            <a data-page="playlist" href="/playlist/{{item.id}}"><b>[[item.name]]</b></a>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Laget av: [[item.lectname]]</p>

            <p><b>Siste opplastninger i denne spillelisten:</b></p>

            <template is="dom-repeat" items="[[item.videos]]">
 
            <a href="video/[[item.id]]"><b>[[item.title]]</b></a>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>

            </template>

            
            </div>
          </template>
          <template is="dom-if" if="[[!playlists]]">
          <p>Du har ikke abonnert på noen spillelister enda..</p>
          </template>
        </div>
        </template>

        <template is="dom-if" if="{{!user.isStudent}}">
        <h1>Du må være en student for å se denne siden!</h1>
        </template>

      </div>
    `;
  }



}

customElements.define('student-view1', StudentView1);
