/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';
import './user-status.js';
import store from './js/store/index';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }

        .user {
          float: right;
          width: 64px;
          height: 100%;
          border: 1px solid red;
        }

        .tab { 
          margin-left: 20px; 
        }

        hr {
          display: block;
          height: 1px;
          border: 0;
          border-top: 1px solid #ccc;
          margin: 1em 0;
          padding: 0;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="view1" href="[[rootPath]]view1">Hjem</a>
            <a name="view2" href="[[rootPath]]view2">Emner</a>
            <a name="view3" href="[[rootPath]]view3">Videoer</a>
            <a name="view4" href="[[rootPath]]view4">Spillelister</a>
            <hr>
            <template is="dom-if" if="{{user.isAdmin}}">
              <!-- Only admins will see this. -->
              <a>Admin</a>
              <a class="tab" name="admin" href="[[rootPath]]admin"><i>Endre Privilegier</i></a>
            </template>
            <template is="dom-if" if="{{user.isTeacher}}">
              <!-- Only teachers will see this. -->
              <a>Lærer</a>
              <a class="tab" name="upload" href="[[rootPath]]upload"><i>Last opp video</i></a>
              <a class="tab" name="myVideos" href="[[rootPath]]myVideos"><i>Mine videoer</i></a>
              <a class="tab" name="teachercplaylist" href="[[rootPath]]teachercplaylist"><i>Lag spilleliste</i></a>
              <a class="tab" name="editplaylist" href="[[rootPath]]editplaylist"><i>Endre spilleliste</i></a>
            </template>
            <template is="dom-if" if="{{user.isStudent}}">
              <!-- Only students will see this. -->
              <a>Student</a>
              <a class="tab" name="student" href="[[rootPath]]student"><i>Se abonnerte spillelister</i></a>
            </template>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">NTNUTube</div>
              <user-status></user-status>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <my-view1 name="view1" subroute="{{subroute}}"></my-view1>
            <my-view2 name="view2" subroute="{{subroute}}"></my-view2>
            <my-view3 name="view3"></my-view3>
            <my-view4 name="view4"></my-view4>
            <video-view name="video" subroute="{{subroute}}"></video-view>
            <playlist-view name="playlist" subroute="{{subroute}}"></playlist-view>
            <student-view1 name="student" subroute="{{subroute}}"></student-view1>
            <teacher-view1 name="teacher"></teacher-view1>
            <editplaylist-view name="editplaylist" subroute="{{subroute}}"></editplaylist-view>
            <upload-video-view name="upload"></upload-video-view>
            <teacher-cplaylist name="teachercplaylist"></teacher-cplaylist>
            <admin-view1 name="admin"></admin-view1>
            <my-videos-view name="myVideos"></my-videos-view>
            <edit-video-view name="editVideo" subroute="{{subroute}}"></edit-video-view>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,
      user: {
        type: Object,
        value: { student: false, teacher: false, admin: false }
      }
    };
  }

  constructor() {
    super();
    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    })
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.

    let supportedPages = [
      'view1', 
      'view2', 
      'view3', 
      'view4', 
      'teacher', 
      'playlist', 
      'teachercplaylist', 
      'editplaylist', 
      'upload', 
      'student', 
      'admin', 
      'video', 
      'myVideos', 
      'editVideo'
    ];

    if (!page) {
      this.page = 'view1';
    } else if (supportedPages.indexOf(page) !== -1) {
      this.page = page; 
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'view1':
        import('./my-view1.js');
        break;
      case 'view2':
        import('./my-view2.js');
        break;
      case 'view3':
        import('./my-view3.js');
        break;
      case 'view4':
        import('./my-view4.js');
        break;
      case 'playlist':
        import('./playlist-view.js');
        break;
      case 'teacher':
        import('./teacher-view1.js');
        break;
      case 'upload':
        import('./upload-video-view.js');
        break;
      case 'teachercplaylist':
        import('./teacher-cplaylist.js');
        break;
      case 'editplaylist':
        import('./editplaylist-view.js');
        break;
      case 'admin':
        import('./admin-view1.js');
        break;
      case 'student':
        import('./student-view1.js');
        break;
      case 'video':
        import('./video-view.js');
        break;
      case 'myVideos':
        import('./my-videos-view.js');
        break;
      case 'editVideo':
        import('./edit-video-view.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);
