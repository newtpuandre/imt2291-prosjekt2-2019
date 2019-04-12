import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class AdminView1 extends PolymerElement {

  constructor () {
    super();
    this.students = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getUsers.php`)
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      this.students = data;
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
          grid-template-columns: auto auto auto;
          padding: 10px;
        }
    
        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.8);
          padding: 20px;
          text-align: left;
        }
      </style>

      <div class="card">
        <h1>Endre bruker privilegier</h1>
        <div class="grid-container">
          <template is="dom-repeat" items="[[students]]">
            <div class="grid-item">
            <form class="updatePriv" name="updatePriv" id="updatePriv" onsubmit="javascript: return false;">
            <input type="hidden" name="id" id="id" value="[[item.id]]" />
            <p><label for="name">Navn: [[item.name]]</label></p>
            <p>E-post: [[item.email]]</p>
            <p>Privilegier: <select id="privilege" name="privilege" value=[[item.privileges]]>
            <option value="0">Student</option>
            <option value="1">Lærer</option>
            <option value="2">Admin</option>
          </select>
          </p>
            <p>Er lærer?: <input type="checkbox" name="isTeacher" value="1" checked=[[item.isTeacher]] disabled></p>
            <p><button on-click="updateUser" id="[[item.id]]">Oppdater bruker</button></p>
            </form>
            </div>
          </template>
        </div>
      </div>

    `;
  }

  updateUser(e) {
    const data = new FormData(e.target.form); // Wrap the form in a FormData object
    fetch (`${window.MyAppGlobals.serverURL}api/updatePrivilege.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      console.log(res);
      /*if (res.status=='SUCCESS') {  // Successfully logged in
        this.updateStatus(res);
        if(res.hasAvatar==1) {
          this.hasAvatar = true;
        }
        store.dispatch(logIn({uid: res.uid, uname: res.uname, isStudent: this.student, isTeacher: this.teacher, isAdmin: this.admin, hasAvatar: this.hasAvatar}));
      }   */                          // Needs to alert the user as to the error!!!!
    })
  }

  static get properties () {
    return {
      students: {
        type: Array
      },
      selectPriv:{
        type: Number
      }
    }
  }
}

customElements.define('admin-view1', AdminView1);
