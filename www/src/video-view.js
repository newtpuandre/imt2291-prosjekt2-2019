import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import './shared-styles.js';
import store from './js/store/index';

class VideoView extends PolymerElement {
  static get properties () {
    return {
      route: {
        type: Object
      },
      videoURL: {
        type: String,
      },
      videoInfo: {
        type: Object,
      },
      comments: {
        type: Array
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
  }

  static get observers() {
    return [
        'loadData(subroute)'
    ]
  }

  loadData(subroute){
    if(subroute.prefix == "/video" && subroute.path != "") {
      this.route = subroute;

      // Retrieve the general info about the video (title, desc etc.)
      fetch (`${window.MyAppGlobals.serverURL}api/video/getVideoInfo.php?id=` + subroute.path)
      .then(res => res.json())
      .then(res => {
        this.videoInfo = res.video;

        // Used to retrieve the video file (when I get it to work)
        this.videoURL = `${window.MyAppGlobals.serverURL}api/video/getVideo.php?id=` + res.id;
        console.log("videoinfo", this.videoInfo);
      });

      // Retrieve the comments of the video
      fetch (`${window.MyAppGlobals.serverURL}api/video/getComments.php?id=` + subroute.path)
      .then(res => res.json())
      .then(res => {
        this.comments = res;
      });
    }
  }

  /**
   * Adds a comment to the video
   * @param {*} e the event
   */
  addComment(e) {
    let data = new FormData(e.target.form);
    data.append("id", this.route.path);

    if(data.get("comment") != "") { // Not a blank comment entered
      fetch(`${window.MyAppGlobals.serverURL}api/video/addComment.php`, {
        method: "POST",
        credentials: "include",
        body: data
      }
      ).then(res => res.json())
      .then(res => {
        console.log(res);
  
        if(res.status == 'SUCCESS') {
          console.log("Comment added");
         // this.comments.push(data.get("comment"));
        } else {
          console.log("Error adding comment");
        }   
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
      </style>

      <div class="card">
        <h1>[[videoInfo.title]]</h1>
        
        <video width="900" height="506" controls>
          <source src="[[videoURL]]" type="video/*">
            Your browser does not support the video tag.
        </video>

        <br><br>

        <!-- TODO: Only show if logged in -->
        <form onsubmit="javascript: return false;" id="addComment">
          <input type="text" maxlength="500" name="comment" id="comment" required> <br>
          <button on-click="addComment">Kommenter</button>
        </form>

        <!-- TODO: Make this not look like shit -->
        <template is="dom-repeat" items="[[comments]]">
          <div class="card">
            <p>[[item.name]]</p>
            <p>[[item.comment]]</p>

            <!-- Delete button -->
          </div>
        </template>

        <!-- TODO: Allow rating -->
      </div>
    `;
  }
}

customElements.define('video-view', VideoView);