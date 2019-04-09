import { LitElement, html, css } from 'lit-element';

class MyView1 extends LitElement {
  static get properties () {
    return {
      students: {
        type: Array
      }
    }
  }

  static get styles() {
    return css`
    :host {
      display: block;
    }

    ul {
      list-style-type: none;
    }

    ul li span:first-of-type {
      display: inline-block;
      width: 23em;
    }

    ul li span:nth-of-type(2) {
      display: inline-block;
      width: 14em;
    }


    `;
  }

  constructor () {
    super();
    this.students = [];
    fetch (`${window.MyAppGlobals.serverURL}api/students.php`)
    .then(res=>res.json())
    .then(data=>{
      this.students = data;
    });
  }

  render() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <h1>Studenter</h1>
        <ul>
          ${this.students.map(student=>{
            return html`<li><span>${student.givenName} ${student.lastName}</span><span>${student.email}</span><span>${student.studyProgram}</span></li>`;
          })}
        </ul>
      </div>
    `;
  }
}

customElements.define('my-view1', MyView1);
