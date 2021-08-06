import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(VueTextareaAutosize);

Vue.config.productionTip = false


firebase.initializeApp({
  apiKey: "AIzaSyD8efywg-YpBEJK9zY8YG6_hlbYZkgZHw8",
  authDomain: "vuetify-calendar-app.firebaseapp.com",
  projectId: "vuetify-calendar-app",
  storageBucket: "vuetify-calendar-app.appspot.com",
  messagingSenderId: "27672690166",
  appId: "1:27672690166:web:36580508063eee7c53dbd7",
  measurementId: "G-NKHKWDR1EL"
});
export const db = firebase.firestore();
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
