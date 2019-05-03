import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class MyVideosView extends PolymerElement {
  static get properties () {
    return {
      videos: {
        type: Array,
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
    });

    fetch (`${window.MyAppGlobals.serverURL}api/video/getVideosFromTeacher.php?id=${this.user.uid}`)
    .then(res => res.json())
    .then(res => {
      this.videos = res.videos;
      console.log(this.videos);
    });
  }


  /**
   * Deletes a video
   * @param {event} e
   */
  deleteVideo(e) {
    let id = e.target.dataset.id;

    fetch(`${window.MyAppGlobals.serverURL}api/video/deleteVideo.php?id=${id}`,{
      credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if(res.status == "SUCCESS") {
        this.videos = this.videos.filter(v => v.id != id);
        console.log("Video deleted");
      } else {
        console.log("Problem deleting video");
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

      .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
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
      <h1>Dine videoer</h1>
      <hr>

      <div class="grid-container">
        <template is="dom-repeat" items="[[videos]]">
          <div class="grid-item">
            <h2>[[item.title]]</h2>

            <a href="/editVideo/[[item.id]]">Rediger</a>
            <a href="/myVideos" on-click="deleteVideo" data-id$="[[item.id]]">Slett</a>

            <p> <!-- Video thumbnail -->
              <img class="videoThumbnail" src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail">
            </p>

            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
          </div>
        </template>
      </div>
    </div>
    `;
  }
}

customElements.define('my-videos-view', MyVideosView);