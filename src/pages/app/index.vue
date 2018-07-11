<template>
  <div class="row items-center justify-center"
       style="min-height: calc(100vh - 50px)">
    <div class="searchForm"
         v-show="!playerOptions.sources[0].src">
      <q-field>
        <q-input v-model="videoUrl" float-label="Enter the video's URL"/>
      </q-field>
      <q-btn class="float-right" round icon="search" @click="getStarted"
             :disable="!videoUrl"/>
    </div>
    <div v-show="playerOptions.sources[0].src && !done" class="videoWrapper">
      <q-modal v-model="beforePlay"
               :content-css="{width: '50vw', borderRadius: '10px', padding: '20px', fontSize: '0,6em'}">
        <p>You are about to watch a short video. Every now and then, the video
          will
          pause and you will be asked to think about the last few moments of the
          video. Please think about whether you remember the previous content or
          not, or whether it is like watching it for the first time. The first
          question is about the strength of your memory: 100% is a very strong,
          clear memory, and 0% is no memory at all. The second question is about
          how it feels: whether for the last part of the video you saw you feel
          you can remember vivid details from before, whether it just feels
          familiar, or whether it feels like you’ve never seen it before in your
          life. There are no right answers and we just want you to think about
          your memory. If you strongly remember something, you should be able to
          predict what comes next in the video, remember what you thought or
          felt
          the first time you saw the video, or the situation you were in when
          you
          watched it before. If you can’t recall this information, the film is
          merely familiar. Sometimes, though, even though you know you’ve seen a
          film before it will feel like you are watching it for the first time,
          as
          if you remember nothing from the first time.</p>
      </q-modal>
      <div class="videoPlayer">
        <div class="layer-over"/>
        <video-player class="video-player-box shadow-10"
                      :options="playerOptions" style="width: 100%"
                      ref="videoPlayer" @ended="videoEnded"/>
      </div>
      <div class="center-all" style="height: 40px;margin-top: 30px">
        {{timing}}
      </div>
      <div style="position: relative; min-height: 62px">
        <q-btn :icon="playing ? 'pause': 'play_arrow'" class="play-pause"
               round @click="playPause"/>
      </div>
    </div>
    <div v-show="done && this.questions.length"
         style="min-height: calc(100vh - 50px)" class="row">
      <div style="font-size: 2.5em; margin: 20px 0"
           class="col-md-12 text-center">Last step
      </div>
      <q-list no-border class="col-md-12 text-center">
        <q-item v-for="(question, i) in questions" :key="i">
          <q-item-main>
            <div
              style="font-size: 1.3em; margin-bottom: 20px;text-align: center"
              class="text-weight-light"><b>-</b>
              {{question.text}} ?
            </div>
            <div style="padding-left: 20px;text-align: center">
              <q-radio v-for="(choice, i) in question.choices" :key="i"
                       v-model="questionsModel[question.id]"
                       :val="choice"
                       :label="choice" style="margin: 0 10px 0 5px"/>
            </div>
          </q-item-main>
        </q-item>
      </q-list>
      <q-checkbox v-model="checked"
                  label="By ticking this box I agree to share my data with the
                  researchers to use in their work. I understand that the data
                  will not be shared with a third party and that all responses
                   will remain anonymous." class="col-md-4 offset-md-4"/>
      <div class="center-all col-md-12">
        <q-btn label="Finish" color="positive" @click="finish"
               :disable="!checked"/>
      </div>
      <br>
    </div>
    <q-modal no-esc-dismiss no-backdrop-dismiss v-model="popup"
             :content-css="{minWidth: '48vw', minHeight: '45vh'}">
      <q-modal-layout>
        <q-toolbar slot="footer">
          <q-toolbar-title/>
          <q-btn label="Continuer" color="white" text-color="primary"
                 :disable="!mood" @click="keepGoing"/>
        </q-toolbar>

        <div style="padding: 40px">
          <div style="font-size: 20px;margin-bottom: 10px">Mood</div>
          <div style="margin-left: 20px">
            <q-radio v-for="(x ,i) in moods" :key="i" v-model="mood"
                     :val="x"
                     :label="x" style="font-size: 12px; margin-left: 5px"/>
          </div>
          <div style="margin:10px 0 10px 0">Memory</div>
          <div class="center-all">
            <q-slider
              v-model="memory"
              :min="0"
              :max="100"
              :step="25"
              label-always
              :label-value="`${memory}%`"
              snap
              style="width: 80%"
            />
          </div>

        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
require('videojs-youtube')
import Timer from 'easytimer.js'

let timer = new Timer()
export default {
  data () {
    return {
      checked: false,
      beforePlay: false,
      questionsModel: [],
      popup: false,
      mood: '',
      memory: 0,
      answers: [],
      moods: [],
      delay: null,
      currentSeconds: 0,
      done: false,
      timing: '00:00:00',
      selectOptions: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        }
      ],
      videoUrl: '',
      playerOptions: {
        techOrder: ['youtube'],
        youtube: {
          ytControls: 0,
          fs: 0,
          rel: 0,
          autohide: 1,
          showinfo: 0,
          disablekb: 1,
          modestbranding: 1,
          iv_load_policy: 3,
          hq: 1
        },
        height: '360',
        language: 'fr',
        controls: false,
        sources: [{
          type: 'video/youtube',
          src: ''
        }]
      },
      playing: false
    }
  },
  methods: {
    getStarted () {
      this.playerOptions.sources[0].src = this.videoUrl
      this.beforePlay = true
    },
    pause () {
      this.player.pause()
      timer.pause()
      this.playing = false
    },
    start () {
      this.player.play()
      timer.start()
      this.playing = true
    },
    playPause () {
      if (this.playing) {
        this.pause()
      } else {
        this.start()
      }
    },
    keepGoing () {
      this.answers.push({
        time: this.timing,
        mood: this.mood,
        memory: this.memory
      })
      this.mood = ''
      this.memory = 0
      this.popup = false
      this.start()
    },
    videoEnded () {
      timer.stop()
      if (!this.questions.length) this.finish()
      this.done = true
    },
    finish () {
      let answers = []
      this.questions.forEach(question => {
        answers.push({
          question: question.text,
          answer: this.questionsModel[question.id]
        })
      })
      let experiment = {
        url: this.playerOptions.sources[0].src,
        time: this.timing,
        popups: this.answers,
        answers,
        user_id: this.user.id
      }
      this.$axios.post('experiments', experiment)
        .then(res => {
          this.$router.push(`/experiment/${res.data.id}`)
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Well done! your results are ready !!'
          })
        })
    }
  },
  created () {
    this.$store.dispatch('fetchQuestions')
    this.$axios.get(`delay`)
      .then(res => {
        this.delay = parseInt(res.data.delay)
      })
    this.$axios.get('moods')
      .then(res => {
        this.moods = res.data.moods
      })
    timer.addEventListener('secondsUpdated', () => {
      this.timing = timer.getTimeValues().toString()
      this.currentSeconds += 1
    })
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    questions () {
      return this.$store.getters.questions
    },
    user () {
      return this.$store.getters.getMe
    }
  },
  watch: {
    currentSeconds (val) {
      if (val === this.delay) {
        this.popup = true
        this.currentSeconds = 0
        this.pause()
      }
    }
  }
}
</script>
