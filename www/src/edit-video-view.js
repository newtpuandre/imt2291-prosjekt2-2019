import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import store from './js/store/index';

class EditVideoView extends PolymerElement {

  constructor() {
    super();
    
    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    });
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
    let toast = document.querySelector("#toast");
    toast.close();

    if(this.videoInfo.title == "" || this.videoInfo.description == "" || this.videoInfo.topic == "" || this.videoInfo.course == "") {
      toast.show("Fyll inn alle feltene");
    } else {
      // Create the data from the form that holds the subtitles/thumbnails files
      const files = this.shadowRoot.querySelector("#editForm");
      const data = new FormData(files);

      data.append("vid", this.route.path);
      data.append("title", this.videoInfo.title);
      data.append("desc", this.videoInfo.description);
      data.append("topic", this.videoInfo.topic);
      data.append("course", this.videoInfo.course);

      fetch(`${window.MyAppGlobals.serverURL}api/video/editVideo.php`, {
        method: "POST",
        credentials: "include",
        body: data
      }).then(res => res.json())
      .then(res => {
        if(res.status == "SUCCESS") {
          toast.show("Videoen ble redigert");
        } else {
          toast.show("En feil oppstod");
        }
      });
    }
  }

  /**
   * Checks that the ID matches the logged in user
   * @param {int} id The ID of the user
   * @returns {bool} True if the ID matches
   */
  postedByUser(id) {
    return id == this.user.uid;
  }

  /**
   * Sets the thumbnail of the video to the current frame of the video
   */
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
      method: "POST",
      credentials: "include",
      body: data
    })
    .then(res => res.json())
    .then(res => {
      let toast = document.querySelector("#toast");
      toast.close();

      if(res.status == "SUCCESS") {
        toast.show("Thumbnailen ble oppdatert");
      } else {
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

        label {
          display: block;
        }

        paper-input {
          width: 35%;
        }

        paper-textarea {
          width: 35%;
        }
      </style>

      <div class="card" id="main">
        <template is="dom-if" if="{{user.isTeacher}}">
          <h1>Redigerer <a href="/video/[[videoInfo.id]]"><i>[[videoInfo.title]]</i></a></h1>
          <hr>

          <paper-input label="Tittel" value="{{videoInfo.title}}" maxlength="64"></paper-input>
          <paper-textarea label="Beskrivelse" value="{{videoInfo.description}}" maxlength="512"></paper-textarea>
          <paper-input label="Emne" value="{{videoInfo.topic}}" maxlength="64"></paper-input>
          <paper-input label="Fag" value="{{videoInfo.course}}" maxlength="64"></paper-input>

          <form onsubmit="javascript: return false;" id="editForm" enctype="multipart/form-data">
            <label for="thumbnail">Thumbnail</label>
            <input type="file" name="thumbnail" id="thumbnail" accept="image/*">

            <label for="subtitles">Undertekster</label>
            <input type="file" name="subtitles" id="subtitles" accept=".vtt">
            <br><br>
          </form>

          <paper-button raised on-click="editVideo">Lagre endringer</paper-button>
          <br><br><br>

          <!-- Get the video so a new thumbnail from the video can be set -->
          <video id="video" crossorigin="true" controls class="video" type="video/*"
              src="[[serverURL]]api/video/getFile.php?id=[[videoInfo.id]]&type=video">
            Your browser does not support the video tag.
          </video>
          <br>

          <paper-button raised id="png" on-click="saveThumbnail">Lagre som thumbnail</paper-button>
          <br><br>
        </template>

        <template is="dom-if" if="{{!postedByUser(videoInfo.uploader)}}">
          <h1>Du har ikke adgang til denne siden</h1>
        </template>
      </div>
    `;
  }
}

customElements.define('edit-video-view', EditVideoView);