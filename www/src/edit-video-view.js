import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class EditVideoView extends PolymerElement {

  constructor() {
    super();
    
    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    })
  }

  static get properties() {
    return {
      route: {
        type: Object
      },
      serverURL: {
        type: String,
        value: window.MyAppGlobals.serverURL
      },
      videoInfo: {
        type: Object
      },
      user: {
        type: Object,
        value: { student: false, teacher: false, admin: false }
      }
    };
  }

  static get observers() {
    return [
        'loadData(subroute)'
    ]
  }


  loadData(subroute){
    if(subroute.prefix == "/editVideo" && subroute.path != "") {
      this.route = subroute;

      // Retrieve the general info about the video (title, desc etc.)
      fetch (`${window.MyAppGlobals.serverURL}api/video/getVideoInfo.php?id=${subroute.path}`, {
        credentials: "include"
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        let main = this.shadowRoot.querySelector("#main");

        if(res.status == "SUCCESS") {
          this.videoInfo = res.video;
        } else {
          main.innerHTML = "<h2>Det oppstod en feil ved henting av video informasjonen.</h2>"
        }
      });
    }
  }

  /**
   * Edits a video
   * @param {event} e The event containing the form data 
   */
  editVideo(e) {
    const data = new FormData(e.target.form);
    data.append("vid", this.route.path);

    fetch (`${window.MyAppGlobals.serverURL}api/video/editVideo.php`, {
      method: 'POST',
      credentials: "include",
      body: data
    }
    ).then(res => res.json())
    .then(res => {
      console.log(res);
      let main = this.shadowRoot.querySelector("#main");

      if(res.status == 'SUCCESS') {

      } else {

      }
    });
  }

  /**
   * Checks that the ID matches the logged in user
   * @param {int} id The ID of the user
   * @returns {bool} True if the ID matches
   */
  postedByUser(id) {
    return id == this.user.uid;
  }

  saveThumbnail() {
    // Find the video
    let video = this.shadowRoot.querySelector("#video");

    // Create a canvas with the same size as the video
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    var canvasContext = canvas.getContext("2d");

    // Create the image
    canvasContext.drawImage(video, 0, 0);

    // Get the image out
    let image = canvas.toDataURL('image/png');

    // image = "data:image/png;base64,hgurGR44erRGegR43......."
    // We only want the actual image data, everything behind the comma
    image = image.split(",")[1];

    let data = new FormData();
    data.append("vid", this.videoInfo.id);
    data.append("thumbnail", image);

    fetch(`${window.MyAppGlobals.serverURL}api/video/updateThumbnail.php`, {
      method: 'POST',
      credentials: "include",
      body: data
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        label {
          display: block;
        }
      </style>

      <div class="card" id="main">
        <template is="dom-if" if="{{user.isTeacher}}">
          <h1>Redigerer <i>[[videoInfo.title]]</i></h1>
          <hr>
        
          <!-- TODO: Add subtitle input, add choose thumbnail from video -->
          <form onsubmit="javascript: return false;" id="editForm" enctype="multipart/form-data">
            <button on-click="editVideo">Lagre endringer</button>
            
            <label for="title">Tittel</label>
            <input type="text" name="title" id="title" maxlength="64" value="[[videoInfo.title]]" required>

            <label for="desc">Beskrivelse</label>
            <input type="text" name="desc" id="desc" maxlength="512" value="[[videoInfo.description]]" required>

            <label for="topic">Emne</label>
            <input type="text" name="topic" id="topic" maxlength="64" value="[[videoInfo.topic]]" required>

            <label for="course">Fag</label>
            <input type="text" name="course" id="course" maxlength="64" value="[[videoInfo.course]]" required>

            <label for="thumbnail">Thumbnail</label>
            <input type="file" name="thumbnail" id="thumbnail" accept="image/*">

            <label for="subtitles">Undertekster</label>
            <input type="file" name="subtitles" id="subtitles" accept=".vtt">
            <br>

            <video id="video" crossorigin="true" controls class="video" type="video/*"
                src="[[serverURL]]api/video/getFile.php?id=[[videoInfo.id]]&type=video">
              Your browser does not support the video tag.
            </video>
            <br>

            <button id="png" on-click="saveThumbnail">Lagre som thumbnail</button>
            <br><br>
          </form>
        </template>

        <!-- TODO: fix this -->
        <template is="dom-if" if="{{!postedByUser(videoInfo.uploader)}}">
          <h1>You don't have permission to access this page.</h1>
        </template>
      </div>
    `;
  }
}

customElements.define('edit-video-view', EditVideoView);