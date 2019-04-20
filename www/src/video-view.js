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
    console.log(this.user);
    if(this.user.uid) {
      console.log("logged in");
    } else {
      console.log("not logged in");
    }
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
        this.videoURL = `${window.MyAppGlobals.serverURL}api/video/getFile.php?id=${res.id}&type=video`;
        console.log("videoinfo", this.videoInfo);
      });

      // Retrieve the comments of the video
      fetch (`${window.MyAppGlobals.serverURL}api/video/getComments.php?id=` + subroute.path)
      .then(res => res.json())
      .then(res => {
        this.comments = res;
        console.log(res);
      });
    }
  }

  /**
   * Adds a comment to the video
   * @param {*} e The event holding the form data
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
        if(res.status == 'SUCCESS') {
          console.log("Comment added");
          this.comments.push(data.get("comment"));
        } else {
          console.log("Error adding comment");
        }   
      });
    }
  }

  /**
   * Deletes a comment
   * @param {event} e The event holding the form data
   */
  deleteComment(e) {
    const cid = e.target.form.id.value; // The ID of the comment
    fetch(`${window.MyAppGlobals.serverURL}api/video/deleteComment.php?cid=${cid}`)
    .then(res => res.json())
    .then(res => {
      if(res.status == "SUCCESS") {
        // Remove the comment from the array
        this.comments = this.comments.filter(comment => comment.id != cid);
      } else {
        console.log("Couldn't delete comment");
      }
    });
  }

  /**
   * Checks that the ID matches the logged in user
   * @param {int} id The ID of the user
   */
  postedByUser(id) {
    console.log(id, this.user.uid);
    return id == this.user.uid;
  }
  
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        .video {
          width: 65%; /* Empty space on side for subtitles */
          height: 56.25%; /* 16:9 Aspect Ratio */
        }
      </style>

      <div class="card">
        <h1>[[videoInfo.title]]</h1>
        
        <video controls class="video">
          <source src="[[videoURL]]" type="video/*">
            Your browser does not support the video tag.
        </video>

        <br>
        <h3>[[videoInfo.description]]</h3>
        <br><br>

        <!-- If logged in -->
        <template is="dom-if" if="[[user.uid]]">
          <form onsubmit="javascript: return false;" id="addComment">
            <input type="text" maxlength="500" name="comment" id="comment" required> <br>
            <button on-click="addComment">Kommenter</button>
          </form>
        </template>

        <!-- TODO: Make this not look like shit -->
        <template is="dom-repeat" items="[[comments]]">
          <div class="card">
            <p>[[item.name]]</p>
            <p>[[item.comment]]</p>
            
            <!-- The comment is posted by the current user, show delete button -->
            <template is="dom-if" if="{{postedByUser(item.userid)}}">
              <form onsubmit="javascript: return false;" id="deleteComment">
                <input type="hidden" name="id" value="[[item.id]]">
                <button on-click="deleteComment">Slett kommentar</button>
              </form>
            </template>
          </div>
        </template>

        <!-- TODO: Allow rating -->

        <!-- TODO: Subtitles on the side -->
      </div>
    `;
  }
}

customElements.define('video-view', VideoView);