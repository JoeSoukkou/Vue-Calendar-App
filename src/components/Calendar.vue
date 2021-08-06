<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="primary"
            dark
            ref="form"
            @click="dialog = true"
          >
            <v-icon dark>
              mdi-plus
            </v-icon>
             Add Event
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
            class="mr-3"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <!-- Add event dialog  -->
      <v-dialog v-model="dialog"  max-width="600px" transition="dialog-top-transition">
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a New Event in Your Calendar.</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form
                    ref="form"
                    v-model="valid"
                    
                  >
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="name"
                      prepend-inner-icon="mdi-calendar"
                      :rules="[rules.required]"
                      label="Your Event"
                      required
                      placeholder="Event Name"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="details"
                      placeholder="Additional Details"
                      clearable
                      clear-icon="mdi-close"
                      auto-grow
                      dense
                      no-resize
                    >
                      <template v-slot:label>
                        <div>
                          Event Details <small>(optional)</small>
                        </div>
                      </template>
                    </v-textarea>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                     <v-dialog
                      ref="dialog1"
                      v-model="modal"
                      :return-value.sync="startDateSelected"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startDateSelected"
                          label="Pick a start date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDateSelected"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modal = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog1.save(startDateSelected)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                   <v-col
                    cols="6"
                  >
                     <v-dialog
                      ref="dialog2"
                      v-model="modal2"
                      :return-value.sync="endDateSelected"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endDateSelected"
                          label="Pick an end date."
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDateSelected"
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="modal2 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog2.save(endDateSelected)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                  
                </v-row>
                </v-form>
              </v-container>
              
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid || loadingAddEvent"
                color="blue darken-1"
                text
                @click="addEvent()"
                :loading="loadingAddEvent"
                
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
                Add Event
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
              
                Close
              </v-btn>
              
            </v-card-actions>
          </v-card>

      </v-dialog>
      <!-- snackbar for add event -->
          <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
          >
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn
                
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
      <!-- snackbar for add event -->
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon @click="deleteEvent(selectedEvent.id)">
                <v-icon dense>mdi-delete</v-icon>
              </v-btn>
              
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              
            </v-toolbar>
            <v-card-text>
              <!-- <span v-html="selectedEvent.details"></span> -->
              <form v-if="currentlyEditing !== selectedEvent.id">
                  {{ selectedEvent.details }}
              </form>
              <form v-else>
                <v-textarea
                solo 
                auto-grow
                clearable
                dense
                v-model="selectedEvent.details"
                type="text"
                style="width: 100%"
                placeholder="Add Note"
                
                ></v-textarea>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn depressed v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">
                <v-icon left>mdi-file-document-edit-outline</v-icon> Edit
              </v-btn>
              <!-- a cool animated loading icon when updating an event -->
              <v-btn 
              depressed 
              v-else @click.prevent="updateEvent(selectedEvent)"
              :loading="loading4"
              :disabled="loading4"
              >
                <v-icon left>mdi-check-bold</v-icon> Save
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn depressed @click="selectedOpen = false" class="mr-1">
                <v-icon left>mdi-window-close</v-icon> Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script>
import { db } from '@/main';
export default {
  data: () => ({
    //Validation
    valid : true,
    //snackbar stuff
      snackbar: false,
      text: 'Your event has been added.',
      timeout: 1500,
    //snackbar stuff
     rules: {
          required: value => !!value || 'You need to name your event.'
     },
     colorsArray: [
      "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
      "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
      "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
      "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
      "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
      "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
      "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
      "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
      "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
      "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
      "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
      "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
      "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
      "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
      "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
      "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
      "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
      "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
      "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
      "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
      "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
      "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
      "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
      "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
      "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
      "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
      "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
      "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
      "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
      "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
      "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
      "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
      "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
      "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
      "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
      "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
      "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
      "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
      "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
      "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"], 
    startDateSelected: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDateSelected : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    modal: false,
    modal2 : false,
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    }, 
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#2C4E51",
    currentlyEditing : null,
    selectedEvent : {}, 
    selectedElement : null,
    selectedOpen : false,
    events: [], 
    dialog : false,
    loader : null, 
    loading4: false, 
    loadingAddEvent : false,
  }), 
  mounted() {
    this.getEvents();
  }, 
  methods : {
    async getEvents()
    {
      let snapshot = await db.collection('calEvent').get();
      let events = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });
      this.events = events;
    },
    viewDay ({ date }) 
    {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) 
    {
      return event.color
    },
    setToday () 
    {
      this.focus = this.today;
    },
    prev () 
    {
      this.$refs.calendar.prev()
    },
    next () 
    {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) 
    {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
    },
    
    editEvent(event) {
      this.currentlyEditing = event.id;
    },
    async updateEvent(event){
      this.loader = 'loading4';
      const l = this.loader;
      this[l] = !this[l];

      await db.collection("calEvent").doc(this.currentlyEditing).update({
        details : event.details
      });
      this.selectedOpen = false;
      this.currentlyEditing = null;
      this[l] = false;
      this.loader = null;
     
      
    },
    async deleteEvent(eventID) {
      await db.collection("calEvent").doc(eventID).delete();
      this.selectedOpen = false;
      this.getEvents();
    }, 
    async addEvent(){
      this.loader = 'loadingAddEvent';
      const l = this.loader;
      this[l] = !this[l];
      
      // + Gets event random color
      this.color =  this.colorsArray[Math.floor(Math.random() * this.colorsArray.length)];

      //Gets event start date
      this.start = this.startDateSelected;
      //Gets event end date
      this.end = this.endDateSelected;


      await db.collection('calEvent').add({
        name : this.name,
        details: this.details, 
        color: this.color,
        start: this.start,
        end: this.end
      });

      
      //resets things after adding the event
      
      this.details= null;
      this.start= null;
      this.end= null;
      this.color= "#2C4E51";
      this.dialog = false;
      this.snackbar = true;
      this.getEvents();
      this[l] = false;
      this.loader = null;
      

    },
    

    
  }, 
  


  
}
</script>