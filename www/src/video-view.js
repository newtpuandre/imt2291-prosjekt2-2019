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
      fileURL: {
        type: String,
      },
      videoInfo: {
        type: Object,
      },
      comments: {
        type: Array,
        value: []
      },
      cues: {
        type: Array,
        value: []
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

  ready() {
    super.ready();

    // Subtitles aren't displayed on the video itself (TODO: Show in fullscreen)
    this.$.videoSubs.track.mode = "hidden";

    // When the subtitles have been loaded (fetched from the backend server)
    this.$.videoSubs.addEventListener('load', e => {
      const trackCues = e.target.track.cues;

      for(let i = 0; i < trackCues.length; i++) {
        this.push("cues", trackCues[i]);
      };
    });
    
    this.$.video.textTracks[0].addEventListener('cuechange', e => { // When a cue change event occurs

      // Loop over all shown cues, remove class 'active'
      this.shadowRoot.querySelectorAll('#subtitles ul li').forEach(li => {
        li.classList.remove('active');                      
      });

      for(let i = 0; i < e.target.activeCues.length; i++) { // Loop over active cues
        // Get the current row in the subtitles
        var row = this.shadowRoot.querySelector(`#subtitles li[data-id="${e.target.activeCues[i].id}"]`);
        row.classList.add('active'); // Add the active class to it

        // Put the current subtitle at the top of the box
        this.$.subtitles.scrollTop = row.offsetTop - this.$.subtitles.offsetTop;
      }
    });
  }

  loadData(subroute){
    if(subroute.prefix == "/video" && subroute.path != "") {
      this.route = subroute;

      // Retrieve the general info about the video (title, desc etc.)
      fetch (`${window.MyAppGlobals.serverURL}api/video/getVideoInfo.php?id=` + subroute.path)
      .then(res => res.json())
      .then(res => {
        this.videoInfo = res.video;

        // Used to retrieve the files associated with a video
        this.fileURL = `${window.MyAppGlobals.serverURL}api/video/getFile.php?id=${res.id}`;
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
          // Clear the input form
          this.shadowRoot.querySelector("#addComment").reset();

          // unshift puts the element at the start of the array
          this.unshift("comments", res.comment);
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
   * @returns {bool} True if the ID matches
   */
  postedByUser(id) {
    return id == this.user.uid;
  }

  /**
   * Puts the video at the time the clicked subtitle is
   * @param {event} id The event holding the ID of the cue to skip to
   */
  skipTo(id) {
    this.$.video.currentTime = this.cues[id.target.dataset.message].startTime;
  }

  /**
   * Changes the playback speed of the video
   * @param {event} e 
   */
  changePlaybackSpeed(e) {
    this.$.video.playbackRate = e.target.value;
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        .container {
          display: flex;
        }

        .video {
          width: 65%; /* Empty space on side for subtitles */
          height: 56.25%; /* 16:9 Aspect Ratio */
        }

        #subtitles {
          height: 350px;
          width: 500px;
          overflow-y: scroll;
        }
    
        #subtitles ul {
          list-style-type: none;
        }
    
        #subtitles li {
          padding: 2px 5px;
        }

        #subtitles li.active {
          background-color: #bfbfbf;
        }
      </style>


      <!-- TODO: Make this not look like shit -->

      
      <div class="card">
        <h1>[[videoInfo.title]]</h1>
        
        <video id="video" crossorigin="true" controls class="video" src="[[fileURL]]&type=video" type="video/*">
          <track id="videoSubs" label="English" default kind="subtitles" srclang="en" src="[[fileURL]]&type=subtitle">
          Your browser does not support the video tag.
        </video>
        
        <p>Hastighet:</p>
        <select id="videoSpeed" name="videoSpeed" on-click="changePlaybackSpeed">
          <option value="0.5">0.5</option>
          <option value="0.75">0.75</option>
          <option value="1" selected="selected">1</option>
          <option value="1.25">1.25</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
        </select>

        <br>
        <h3>[[videoInfo.description]]</h3>
        <br><br>

        <!-- TODO: Put the subtitles on the side -->
        <div id="subtitles">
          <ul>
            <template is="dom-repeat" items="[[cues]]">

              <!-- Both the li and p elements have an on-click, so the user
                  can click on either the text or the entire box -->
              <li data-id$="[[item.id]]" class="active" on-click="skipTo" data-message$="{{item.id}}">
                <p on-click="skipTo" data-message$="{{item.id}}">[[item.text]]</p>
                <br>
              </li>
            </template>
          </ul>
        </div>

        <!-- If logged in -->
        <template is="dom-if" if="[[user.uid]]">
          <form onsubmit="javascript: return false;" id="addComment">
            <input type="text" maxlength="500" name="comment" id="comment" required> <br>
            <button on-click="addComment">Kommenter</button>
          </form>
        </template>

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
      </div>
      `;
  }
}

customElements.define('video-view', VideoView);