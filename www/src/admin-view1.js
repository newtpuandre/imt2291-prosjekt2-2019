import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class AdminView1 extends PolymerElement {

  constructor () {
    super();
    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    })

    this.students = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getUsers.php`)
    .then(res=>res.json())
    .then(data=>{
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
      <template is="dom-if" if="{{user.isAdmin}}">
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
            <p><button on-click="updateUser">Oppdater bruker</button></p>
            </form>
            </div>
          </template>
        </div>
        </template>
        <template is="dom-if" if="{{!user.isAdmin}}">
          <h1>Du må være lærer for å se denne siden.</h1>
        </template>
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

      if (res.status=='SUCCESS') {  //Hamdle error

      } else {

      }   

    })
  }

  static get properties () {
    return {
      students: {
        type: Array
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      }
    }
  }

}

customElements.define('admin-view1', AdminView1);
