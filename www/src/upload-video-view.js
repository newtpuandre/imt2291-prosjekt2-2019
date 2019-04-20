import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
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

        label {
          display: block;
        }
      </style>

      <div class="card">
        <template is="dom-if" if="{{user.isTeacher}}">
          <h1>Last opp video</h1>
        
          <form onsubmit="javascript: return false;" id="uploadForm" enctype="multipart/form-data">
            <label for="title">Tittel</label>
            <input type="text" name="title" id="title" maxlength="64" required>

            <label for="desc">Beskrivelse</label>
            <input type="text" name="desc" id="desc" maxlength="512">

            <label for="topic">Emne</label>
            <input type="text" name="topic" id="topic" maxlength="64" required>

            <label for="course">Fag</label>
            <input type="text" name="course" id="course" maxlength="64" required>

            <label for="thumbnail">Thumbnail</label>
            <input type="file" name="thumbnail" id="thumbnail" accept="image/*">

            <label for="video">Video</label>
            <input type="file" name="video" id="video" accept="video/*" required>

            <label for="subtitles">Undertekster</label>
            <input type="file" name="subtitles" id="subtitles">

            <br><br>
            <button on-click="uploadVideo">Last opp video</button>
          </form>
        </template>

        <template is="dom-if" if="{{!user.isTeacher}}">
          <h1>Du må være lærer for å se denne siden.</h1>
        </template>
      </div>
    `;
  }

  uploadVideo(e) {
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/video/uploadVideo.php`, {
      method: 'POST',
      credentials: "include",
      body: data
    }
    ).then(res => res.json())
    .then(res => {
      console.log(res);
      if(res.status == 'SUCCESS') {
        console.log("Video uploaded");
      } else {
        console.log("Error uploading video");
      }
    });
  }
}

customElements.define('upload-video-view', UploadVideoView);
