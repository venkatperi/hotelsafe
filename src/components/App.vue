<template>
  <div class="fullpanel">
    <div class="panel black">
      <div class="display">
        <div class="state"
          v-html="state"></div>
        <textarea rows="1"
          v-model="message"
          :class="['input decimal', blink?'blink':'']">
        </textarea>
      </div>
      <ul>
        <li><a href="#" v-on:click="button(1)">1</a></li>
        <li><a href="#" v-on:click="button(2)">2</a></li>
        <li><a href="#" v-on:click="button(3)">3</a></li>
      </ul>
      <ul>
        <li><a href="#" v-on:click="button(4)">4</a></li>
        <li><a href="#" v-on:click="button(5)">5</a></li>
        <li><a href="#" v-on:click="button(6)">6</a></li>
      </ul>
      <ul>
        <li><a href="#" v-on:click="button(7)">7</a></li>
        <li><a href="#" v-on:click="button(8)">8</a></li>
        <li><a href="#" v-on:click="button(9)">9</a></li>
      </ul>
      <ul>
        <li><a href="#" v-on:click="reset()">R</a></li>
        <li><a href="#" v-on:click="button(0)">0</a></li>
        <li><a href="#" v-on:click="lock()">L</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  const objectInspect = require( 'object-inspect' )
  import HotelSafe from '../HotelSafe'

  process.env.LOG_LEVEL = 'info'

  export default {
    name: 'app',

    components: {},

    data: function () {
      return {
        safe: new HotelSafe( 5000 ),
        message: '',
        state: '',
        data: '',
      }
    },

    created() {
      this.safe.on( 'state', ( s, old, data ) => {
        s = Array.isArray( s ) ? s.join( '/' ) : s
        this.state = s
        console.log( `STATE: ${s}, ${objectInspect( data )}` )
        if ( data && data.message )
          this.message = data.message
      } )
      this.safe.startSM()
    },

    computed: {
      blink() {
        for ( let x of ['success', 'error'] )
          if ( this.state.endsWith( x ) )
            return true
        return false
      },

      locked() {
        return this.state.startsWith( 'closed' )
      },
    },

    methods: {
      button( digit ) {
        this.safe.button( digit )
      },

      reset() {
        this.safe.reset()
      },

      lock() {
        this.safe.lock()
      },
    },
  }
</script>

<style lang="scss">

  .display {
    width: 180px;
    position: relative;
    margin: 0 auto;
    color: #000;
    font-family: 'News Cycle', sans-serif;
  }

  .state {
    position: absolute;
    left: 10px;
    top: 0;
    font-size: 15px;
  }

  textarea.input {
    resize: none;

    color: rgba(0, 0, 0, 0.7);
    width: 100%;
    display: block;
    text-align: center;
    padding: 15px 5px;
    min-height: 60px;

    font-family: 'News Cycle', sans-serif;
    font-size: 2rem;
    text-overflow: clip;
    overflow-wrap: break-word;
    position: relative;
    border-radius: 0;
    background: rgba(125, 140, 115, 0.5);
    /*text-shadow: 0 0 7px rgba(255, 255, 255, 0.25);*/
    box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.25);
    &::placeholder {
      text-align: center;
      vertical-align: middle;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.25em;
    }
  }

  .decimal textarea {
    font-family: 'Share Tech Mono', monospace;
  }

  .blink {
    animation: blinker 1s step-start infinite;
  }

  @keyframes blinker {
    50% {
      color: rgba(0, 0, 0, 0);
    }
  }
</style>
