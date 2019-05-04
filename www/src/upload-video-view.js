import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import store from './js/store/index';

class UploadVideoView extends PolymerElement {

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
      title: {
        type: String
      },
      description: {
        type: String
      },
      topic: {
        type: String
      },
      course: {
        type: String
      },
      user: {
        type: Object,
        value: { student: false, teacher: false, admin: false }
      }
    };
  }

  /**
   * Uploads a video
   * @param {event} e 
   */
  uploadVideo(e) {
    let toast = document.querySelector("#toast");
    toast.close();

    if(this.title == "" || this.description == "" || this.topic == "" || this.course == "") {
      toast.show("Fyll inn alle feltene");
    } else {
      const files = this.shadowRoot.querySelector("#uploadForm");
      const data = new FormData(files);

      const video = data.get("video");

      // All files are in the form, if the name isn't empty it's selected to upload
      // To be sure, check that the size isn't 0 as well
      if(video.name != "" && video.size != 0) {
        data.append("title", this.title);
        data.append("desc", this.description);
        data.append("topic", this.topic);
        data.append("course", this.course);
  
        fetch(`${window.MyAppGlobals.serverURL}api/video/uploadVideo.php`, {
          method: 'POST',
          credentials: "include",
          body: data
        }).then(res => res.json())
        .then(res => {
          console.log(res);
          if(res.status == 'SUCCESS') {
            toast.show("Video lastet opp");
          } else {
            toast.show("En feil oppstod");
          }
        });
      } else {
        toast.close();
        toast.show("Velg en videofil å laste opp");
      }
    }
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
      </style>

      <div class="card" id="main">
        <template is="dom-if" if="{{user.isTeacher}}">
          <h1>Last opp video</h1>
          <hr>
        
          <paper-input label="Tittel" value="{{title}}" maxlength="64"></paper-input>
          <paper-input label="Beskrivelse" value="{{description}}" maxlength="512"></paper-input>
          <paper-input label="Emne" value="{{topic}}" maxlength="64"></paper-input>
          <paper-input label="Fag" value="{{course}}" maxlength="64"></paper-input>

          <form onsubmit="javascript: return false;" id="uploadForm" enctype="multipart/form-data">
            <label for="thumbnail">Thumbnail</label>
            <input type="file" name="thumbnail" id="thumbnail" accept="image/*">

            <label for="video">Video</label>
            <input type="file" name="video" id="video" accept="video/*" required>

            <label for="subtitles">Undertekster</label>
            <input type="file" name="subtitles" id="subtitles" accept=".vtt">

            <br><br>
          </form>
          <paper-button raised on-click="uploadVideo">Last opp video</paper-button>
        </template>

        <template is="dom-if" if="{{!user.isTeacher}}">
          <h1>Du må være lærer for å se denne siden.</h1>
        </template>
      </div>
    `;
  }
}

customElements.define('upload-video-view', UploadVideoView);
