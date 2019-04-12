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
            <p>Navn: [[item.name]]</p>
            <p>E-post: [[item.email]]</p>
            <p>Privilegier: <select value=[[item.privileges]]>
            <option value="0">Student</option>
            <option value="1">Lærer</option>
            <option value="2">Admin</option>
          </select>
          </p>
            <p>Er lærer?: <input type="checkbox" name="isTeacher" value="1" checked=[[item.isTeacher]] disabled></p>
            <p><button>Oppdater bruker</button></p>
            </div>
          </template>
        </div>
      </div>





    `;
  }


  static get properties () {
    return {
      students: {
        type: Array
      }
    }
  }
}

customElements.define('admin-view1', AdminView1);
