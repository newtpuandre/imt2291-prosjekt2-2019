import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import store from './js/store/index';

class MyView1 extends PolymerElement {
  static get properties () {
    return {
      videos: {
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
    })

    this.videos = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getNewVideos.php`)
    .then(res=>res.json())
    .then(data=>{
      this.videos = data;
      console.log(data);
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
          padding: 5px;
        }
    
        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          margin: 2px;
          padding: 10px;
          text-align: left;
        }
      </style>

      <div class="card">
      <h1>Søk</h1>
      <input type="text">
      <button>Søk</button>
      <h1>Nye Opplastninger</h1>
      <div class="grid-container">
          <template is="dom-repeat" items="[[videos]]">
            <div class="grid-item">
            <b>[[item.title]]</b>
            <p><img src="[[item.thumbnail]]"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            </div>
          </template>
      </div>
      <template is="dom-if" if="{{user.isStudent}}">
      <h1>Abonnerte spillelister</h1>
      <p>spillelister</p>
      </template>

      <!--<template is="dom-if" if="{{user.isAdmin}}">
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
        </template>-->
        
        </div>

    `;
  }

}

customElements.define('my-view1', MyView1);
