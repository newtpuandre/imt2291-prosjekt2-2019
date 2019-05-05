
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import store from './js/store/index';
import './shared-styles.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

class VideoView extends PolymerElement {
  static get properties() {
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
      rating: { // The users rating
        type: Number
      },
      speed: { // Speed of the video
        type: Number,
        value: 2 // The position in the array under (1)
      },
      speedValues: { // The possible speed values of the video
        type: Array,
        value: [
          0.5,
          0.75,
          1,
          1.25,
          1.5,
          2
        ]
      },
      comment: { // What's typed as a new comment to add
        type: String
      },
      comments: {
        type: Array,
        value: []
      },
      cues: { // The subtitles
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
        'loadData(subroute)',
        'changePlaybackSpeed(speed)',
        'updateRating(rating)'
    ]
  }

  ready() {
    super.ready();

    // Subtitles aren't displayed on the video itself
    this.$.videoSubs.track.mode = "hidden";

    // Fullscreen change for chrome, safari and opera
    this.$.video.addEventListener("webkitfullscreenchange", e => {
      this.$.videoSubs.track.mode = document.webkitIsFullScreen ? "showing" : "hidden";
    });

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

    // Not logged in, disable rating dropdown
    if(!this.user.uid) {
      this.shadowRoot.querySelector("#speedDropdown").disabled = true;
    }
  }

  loadData(subroute) {
    if(subroute.prefix == "/video" && subroute.path != "") {
      this.route = subroute;

      // Retrieve the general info about the video (title, desc etc.)
      fetch (`${window.MyAppGlobals.serverURL}api/video/getVideoInfo.php?id=` + subroute.path, {
        credentials: "include"
      })
      .then(res => res.json())
      .then(res => {
        this.videoInfo = res.video;

        this.rating = res.video.userRating;

        // Used to retrieve the files associated with a video
        this.fileURL = `${window.MyAppGlobals.serverURL}api/video/getFile.php?id=${res.id}`;
      });

      // Retrieve the comments of the video
      fetch (`${window.MyAppGlobals.serverURL}api/video/getComments.php?id=` + subroute.path)
      .then(res => res.json())
      .then(res => {
        if(res != null) {
          this.comments = res;
        }
      });
    }
  }

  /**
   * Adds a comment to the video
   * @param {*} e 
   */
  addComment(e) {
    // Only whitespace comments not allowed
    if(this.comment !== undefined && this.comment.trim().length != 0) {
      let data = new FormData();
      data.append("id", this.route.path);
      data.append("comment", this.comment);
  
      fetch(`${window.MyAppGlobals.serverURL}api/video/addComment.php`, {
        method: "POST",
        credentials: "include",
        body: data
      }
      ).then(res => res.json())
      .then(res => {
        let toast = document.querySelector("#toast");
        toast.close();

        if(res.status == 'SUCCESS') {
          // Clear the input form
          this.comment = "";

          // unshift puts the element at the start of the array
          this.unshift("comments", res.comment);
          toast.show("Kommentar lagt til");
        } else {
          toast.show("En feil oppstod");}   
      });
    }
  }

  /**
   * Deletes a comment
   * @param {event} e The event holding the form data
   */
  deleteComment(e) {
    let cid = e.target.dataset.id; // The ID of the comment

    fetch(`${window.MyAppGlobals.serverURL}api/video/deleteComment.php?cid=${cid}`)
    .then(res => res.json())
    .then(res => {
      let toast = document.querySelector("#toast");
      toast.close();

      if(res.status == "SUCCESS") {
        // Remove the comment from the array
        this.comments = this.comments.filter(comment => comment.id != cid);
        toast.show("Kommentar slettet");
      } else {
        toast.show("En feil oppstod");
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
   * @param {number} speed The index of the selected speed in this.speedValues
   */
  changePlaybackSpeed(speed) {
    this.$.video.playbackRate = this.speedValues[speed];
  }

  /**
   * Updates the users rating of the video
   * @param {event} rating The rating
   */
  updateRating(rating) {
    var data = new FormData();
    data.append("rating", rating);
    data.append("vid", this.route.path);

    fetch(`${window.MyAppGlobals.serverURL}api/video/updateRating.php`, {
      method: "POST",
      credentials: "include",
      body: data,
    })
    .then(res => res.json())
    .then(res => {
      let toast = document.querySelector("#toast");
      toast.close();

      if(res.status == "SUCCESS") {
        toast.show("Rating oppdatert");      
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

        .bottomContainer {
          width: 75%;
          display: grid;

          grid-template-columns: repeat(3, auto);
          grid-template-rows: repeat(3, auto);
          grid-template-areas: 
            "speed userRating totalRating"
            "time . ."
            "desc desc desc";
        }

        #speed {
          grid-area: speed;
        }

        #totalRating {
          grid-area: totalRating;
          text-align: right;
        }
        
        #userRating {
          grid-area: userRating;
          text-align: center;
        }

        #time {
          grid-area: time;
        }

        #desc {
          grid-area: desc;
        }

        #video {
          width: 75%;
          height: 350px;
        }

        #subtitles {
          width: 25%;
          height: 350px;
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

        paper-textarea { /* Same size as video */
          width: 75%;
        }

        p { /* So newlines creates new lines */
          white-space: pre-wrap;
        }
      </style>


      <div class="card">
        <h1>[[videoInfo.course]] - [[videoInfo.title]]</h1>
        <h3>[[videoInfo.topic]]</h3>
        <hr>

        <div style="display: flex;">
          <video id="video" crossorigin="true" controls class="video" src="[[fileURL]]&type=video" type="video/*">
            <track id="videoSubs" label="English" default kind="subtitles" srclang="en" src="[[fileURL]]&type=subtitle">
            Your browser does not support the video tag.
          </video>

          <div id="subtitles">
            <ul>
              <template is="dom-repeat" items="[[cues]]">
  
                <!-- Both the li and p elements have an on-click, so the user
                    can click on either the text or the entire box -->
                <li data-id$="[[item.id]]" class="active" on-click="skipTo" data-message$="{{item.id}}">
                  <p on-click="skipTo" data-message$="{{item.id}}">[[item.text]]</p>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <!-- Container under the video, holds speed and rating -->
        <div class="bottomContainer">
          <i id="time">[[videoInfo.time]]</i>
          <p id="desc">[[videoInfo.description]]</p>
          <div id="speed">
            <paper-dropdown-menu label="Hastighet" style="width: 80px;">
              <paper-listbox slot="dropdown-content" selected="{{speed}}">
                <template is="dom-repeat" items="[[speedValues]]">
                  <paper-item>[[item]]</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          
          <div id="userRating">
            <paper-dropdown-menu label="Rating" id="speedDropdown" style="width: 80px;">
              <paper-listbox slot="dropdown-content" selected="{{rating}}">
                <paper-item>0</paper-item>
                <paper-item>1</paper-item>
                <paper-item>2</paper-item>
                <paper-item>3</paper-item>
                <paper-item>4</paper-item>
                <paper-item>5</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          
          <div id="totalRating">
            <p>Total rating: [[videoInfo.rating]]</p>
          </div>
        </div>

        <hr>
        <br><br><br><br>

        <!-- If logged in add ability to comment -->
        <template is="dom-if" if="[[user.uid]]">
          <paper-textarea label="Legg til en kommentar" value="{{comment}}"></paper-textarea>
          <paper-button raised on-click="addComment">Kommenter</paper-button>
        </template>

        <template is="dom-repeat" items="[[comments]]">
          <div class="card">
            <h3>[[item.name]]</h3>
            <p>[[item.comment]]</p>
            
            <!-- The comment is posted by the current user, show delete button -->
            <template is="dom-if" if="{{postedByUser(item.userid)}}">
              <paper-button raised on-click="deleteComment" data-id$="[[item.id]]" style="font-size: 10px;">
                Slett kommentar
              </paper-button>
            </template>
          </div>
        </template>
      </div>
      `;
  }
}

customElements.define('video-view', VideoView);