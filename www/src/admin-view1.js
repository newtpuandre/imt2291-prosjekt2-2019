import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
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
    fetch (`${window.MyAppGlobals.serverURL}api/admin/getUsers.php`)
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

        paper-button {
          padding:0;
        }

        paper-button::shadow .button-content {
          padding:0;
        }

        paper-button button {
          padding:1em;
          background-color: transparent;
          border-color: transparent;
        }

        paper-button button::-moz-focus-inner {
          border: 0;
        }
      </style>

      <div class="card">
      <template is="dom-if" if="{{user.isAdmin}}">
        <h1>Endre bruker privilegier</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="[[students]]">
            <div class="grid-item">
            <form class="updatePriv" name="updatePriv" id="updatePriv" onsubmit="javascript: return false;">
            <input type="hidden" name="id" id="id" value="[[item.id]]" />
            <p>Navn: [[item.name]]</p>
            <p>E-post: [[item.email]]</p>
            <p>
            <paper-dropdown-menu label="Privilegier:" id="privilege" style="width: 120px;">
              <paper-listbox slot="dropdown-content" selected="{{item.privileges}}">
                <paper-item value="0" >Student</paper-item>
                <paper-item value="1">Lærer</paper-item>
                <paper-item value="2">Admin</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            </p>
            <input is="iron-input" name="privilege" type="hidden" value$="[[item.privileges]]">
            <p>Er lærer?: <input type="checkbox" name="isTeacher" value="1" checked=[[item.isTeacher]] disabled></p>
            <paper-button raised><button on-click="updateUser">Oppdater bruker</button></paper-button>
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
    fetch (`${window.MyAppGlobals.serverURL}api/admin/updatePrivilege.php`, {
        method: 'POST',
        credentials: "include",
        body: data
      }
    ).then(res=>res.json())         // When a reply has arrived
    .then(res=>{
      let toast = document.querySelector("#toast");
      toast.close();
      if(res.status == 'SUCCESS') {
          toast.show("Bruker er nå oppdatert");
      } else {
        toast.show("En feil oppstod");
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
