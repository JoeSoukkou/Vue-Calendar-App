<template>
  <v-app>
      <v-app-bar app class="overflow-hidden"
        color="primary accent-4"
        dark
        fixed
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Calendrier - Manage your time.</v-toolbar-title>

      </v-app-bar>
    
    <v-main>
      <Calendar/>
    </v-main>
    <v-footer
    dark
    padless
  >
      <v-card
        flat
        tile
        class="primary white--text text-center"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon.icon"
            @click="surf(icon.link)"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">
              {{ icon.icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Calendrier is a calendar web application that was created using VueJS + Vuetify for the front end, while the backend is driven by Firebase.
          You can contact me through the different social media platform listed above. Thank you !
        </v-card-text>
 
        <v-divider></v-divider>

        <v-card-text class="white--text">
          © {{ new Date().getFullYear() }} — <strong> Built by Y. Soukkou — </strong>
        </v-card-text>
      </v-card>
    </v-footer>


  </v-app>
</template>

<script>
import Calendar from './components/Calendar';

export default {
  name: 'App',

  components: {
    Calendar,
  },

  data: () => ({
    drawer: false,
    group: null,
    icons: [
    {
      icon: 'mdi-facebook',
      link: 'https://www.facebook.com/Youcef1927/'
    },
    {
      icon: 'mdi-twitter',
      link: 'https://twitter.com/JSoukkou'
    },
    {
      icon: 'mdi-instagram',
      link: 'https://instagram.com/Yussef_soukkou42'
    },
    {
      icon: 'mdi-email',
      link: 'mailto:youcefsoukkou@gmail.com'
    }
      ],
    //
  }),
  methods: {
    surf(link){
      window.open(link);
    }
  }
};
</script>
