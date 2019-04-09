import { LitElement, html, css } from 'lit-element';
import '@polymer/iron-icon/iron-icon.js';

import store from './js/store/index';
import { logIn, logOut } from './js/actions/index';
/**
 * Shows user symbol to access log in/log out/change user details pane.
 * Works best if put in the upper right corner as a drop down is used to show
 * login/user details screen. If user has an avatar this avatar is shown Instead
 * of the dummy user icon when logged in.
 *
 * @extends LitElement
 */
class UserStatus extends LitElement {
  static get properties () {
    return {
      showLogin: {
        type: Boolean,
        value: false
      },
      showStatus: {
        type: Boolean,
        value: false
      },
      loggedIn: {
        type: Boolean,
        value: false
      },
      admin: {
        type: Boolean,
        value: false
      },
      teacher: {
        type: Boolean,
        value: false
      },
      student: {
        type: Boolean,
        value: false
      },
      uname: {
        type: String
      },
      hasAvatar: {
        type: Boolean,
        value: false
      }
    }
  }

  /**
   * Get styles for this component.
   *
   * @type {CSS}
   */
  static get styles() {
    return css`
    :host {
      display: block;
      height: 100%;
    }

    .user {
      position: relative;
      float: right;
      width: 64px;
      height: 100%;
    }

    iron-icon {
      height: 60px;
      width: 50px;
      margin: 0 5px;
    }

    .status {
      position: absolute;
      top: 60px;
      right: 0px;
      height: 300px;
      width: 20em;
      padding: 5px 10px;
      background-color: #4285f4;
    }

    form.login {
      display: inline-block;
      margin-top: 20px;
    }

    label {
      display: inline-block;
      width: 6em;
      font-size: 1em;
    }

    input {
      display: inline-block;
      font-size: 1em;
      width: 12em;
    }

    button {
      margin-left: 10em;
    }

    .status>div:first-of-type {
      margin-top: 20px;
    }

    b.avatar {
      margin-top: 20px;
      display: inline-block;
    }
    `;
  }

  /**
   * Called when the component has been added to the DOM. Adds an event listener
   * to remove the drop down when the user clicks outside the scope of the
   * drop down.
   * Fetches current logged in status from the server and if the user is logged
   * in (active session, probably means the user has reloaded the page) we restore
   * the logged in user details.
   *
   * @param  {Object} changedProperties not used
   */
  firstUpdated(changedProperties) {
    document.addEventListener('click', e=>{
      if(e.path.filter(i=>i.tagName=='USER-STATUS').length!=1) {  // Clicked outside the user icon/status display
        this.showLogin = false;
        this.showStatus = false;
      }
    })
    // Get user logged in status from server
    fetch (`${window.MyAppGlobals.serverURL}api/loginStatus.php`, {
      credentials: 'include'
    })
    .then(res=>res.json())
    .then(res=>{
      if (res.loggedIn) {         // User is logged in
        this.updateStatus(res);   // Sets user name, user id and such
        this.showStatus = false;  // We do not want to open the status pane
        if (res.hasAvatar==1) {   // If user has avatar (is returned as 0 or 1, not true or false)
          this.hasAvatar = true;
        }
        store.dispatch(logIn({uid: res.uid, uname: res.uname, isStudent: this.student, isTeacher: this.teacher, isAdmin: this.admin, hasAvatar: this.hasAvatar}));
      }
    })
  }

  /**
   * Returns the html to render
   *
   * @return {Object} an lit-html object to be rendered.
   */
  render() {
    return html`
      <style>
        div.avatar {
          background-image: url("${window.MyAppGlobals.serverURL}api/avatar.php");
          background-size: contain;
          border-radius: 35px;
          background-repeat: no-repeat;
          background-position: center;
        }
      </style>
      <div class="user${this.hasAvatar?
        " avatar":""}" @click="${this.openStatus}">
        ${this.hasAvatar?"":html`<iron-icon icon="my-icons:person"></iron-icon>`}
        ${this.showLogin?
          html`
          <div class="status">
          <form class="login" onsubmit="javascript: return false;">
          <label for="uname">Brukernavn</label><input type="text" id="uname" name="uname"><br/>
          <label for="pwd">Passord</label><input type="password" id="pwd" name="pwd"><br/>
          <button @click="${this.login}">Logg inn</button>
          </form>
          </div>`:
          html``
        }
        ${this.showStatus?
          html`<div class="status">
            <div>${this.uname} logget på. <button @click="${this.logout}">Logg av</button></div>
            <b class="avatar">Oppdater avatar</b><br>
            <form onsubmit="javascript: return false;" enctype="multipart/form-data">
            <label for="file">Velg bilde</label><input type="file" name="file" id="file"><br>
            <button @click="${this.avatar}">Last opp nytt bilde</button>
          </div>`:
          html``
        }
      </div>
    `;
  }

  /**
   * Called when the user clicks the user icon/avatar image.
   *
   * @param  {Object} e event object from the click event
   */
  openStatus(e) {
    if (e.path.filter(i=>i.className=='status').length<1) { // clicked on the user icon
      if (!this.loggedIn) {
        this.showLogin = !this.showLogin;   // Show log in screen
      } else {
        this.showStatus = !this.showStatus; // Show status screen
      }
    }
  }

  /**
   * Called when the user clicks the log in button
   *
   * @param  {Object} e event object from the click on the button. Contains
   * information about the form.
   */
  login(e) {
    const data = new FormData(e.target.form); // Wrap the form in a FormData object
    fetch (`${window.MyAppGlobals.serverURL}api/login.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      if (res.status=='SUCCESS') {  // Successfully logged in
        this.updateStatus(res);
        if(res.hasAvatar==1) {
          this.hasAvatar = true;
        }
        store.dispatch(logIn({uid: res.uid, uname: res.uname, isStudent: this.student, isTeacher: this.teacher, isAdmin: this.admin, hasAvatar: this.hasAvatar}));
      }                             // Needs to alert the user as to the error!!!!
    })
  }

  /**
   * Called when the user clicks the log out button
   */
  logout() {
    fetch (`${window.MyAppGlobals.serverURL}api/logout.php`, {
        credentials: "include"
      }
    ).then(res=>res.json())
    .then(res=>{
      if (res.status=='SUCCESS') {  // Successfully logget out
        this.updateStatus(res);
        this.hasAvatar = false;
        this.showLogin = true;
        this.showStatus = false;
        store.dispatch(logOut());
      }                              // Need to alert the user as to the error!!!!!
    })
  }

  /**
   * Called when the user clicks the button to upload a new avatar image.
   *
   * @param  {Object} e event object that contains information about the form
   */
  avatar(e) {
    const data = new FormData(e.target.form);
    fetch (`${window.MyAppGlobals.serverURL}api/uploadAvatar.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())
    .then(res=>{
      if (res.status=='SUCCESS') {  // Successfully uploaded new avatar image
        this.hasAvatar = true;
      }                             // Need to alert the user as to the error!!!!!
    })
  }

  /**
   * Called from login, logout and get initial log in status methods, updates
   * information about the user.
   *
   * @param  {Object} res Contains information about uid, uname, utype
   */
  updateStatus(res) {
    this.showLogin = false;
    this.showStatus = true;
    this.uid = res.uid;
    this.uname = res.uname;
    this.loggedIn = res.uid!=null;
    this.student = false;
    this.teacher = false;
    this.admin = false;
    switch(res.utype) {
      case 'student': this.student = true;
        break;
      case 'teacher': this.teacher = true;
        break;
      case 'admin': this.admin = true;
        break;
    }
  }
}

customElements.define('user-status', UserStatus);
