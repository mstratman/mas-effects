const resizeThrottleTime = 250

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

window.addEventListener('load', function () {
  var app = new Vue({
    el: '#fuzz-builder',
    components: {
      Multiselect: window.VueMultiselect.default,
      VueFormWizard: window.VueFormWizard.default,
    },
    data: {
      urlParameters: {},
      formComplete: false,
      email: '',

      chosenSticker: {},
      chosenKnob: null,
      chosenKnobNumber: 2,
      chosenStomp: null,
      choseAddon: 0,
      extraSticker: null,
      footswitchUpgrade: null,
      jacksUpgrade: null,
      comments: "",
      led: "",

      basePrice: 75, // changing these won't save you any money :)
      ledPrice: 10,
      stickerPrice: 5,
      jackUpgradePrice: 9,
      footswitchUpgradePrice: 8,

      resizeThrottled: false,
      resizeDoneTimeout: undefined, // assumes 'sticker-${key}.png' and 'thumbs/thumb-${key}.png'

      stickers: [
        { key: 'monster', artist: 'Kailey Reid', title: 'Hiding Fear', url: 'https://www.instagram.com/kaileyreidillustration/', note: "Optional add-on: Eyes glow red. (step 3)", addon: "Glowing eyes", addonPrice: 10, addonPreviewUrl: '/img/illustrator-series/hiding-fear.jpg' },
        { key: 'spaceman', artist: 'David Slebodnick', title: 'Drunk Dead Spaceman', url: 'https://www.instagram.com/daviddrawsdrawings/', note: "Optional add-on: Eyes glow red. (step 3)", addon: "Glowing eyes", addonPrice: 10, addonPreviewUrl: '/img/illustrator-series/spaceman.jpg' },
        { key: 'comet', artist: 'Justin Estcourt', title: 'Until the End', url: 'https://www.instagram.com/jetsyart/', note: "Optional add-on: Glowing comet LED (step 3)", addon: "Glowing comet", addonPrice: 10, addonPreviewUrl: '/img/illustrator-series/comet-led.jpg' },
        { key: 'saturn', artist: 'Justin Estcourt', title: 'Saturn Rise', url: 'https://www.instagram.com/jetsyart/', },
        { key: 'isolation', artist: 'Justin Estcourt', title: 'Isolation', url: 'https://www.instagram.com/jetsyart/', note: "Staff glows blue. Optional Add-on (step 3)", addon: "Glowing staff", addonPrice: 10, addonPreviewUrl: '/img/illustrator-series/isolation.jpg', flipLED: true },
        { key: 'charging', artist: 'Matt Dixon', title: 'Charging', url: 'https://www.instagram.com/mattdixonart', },
        { key: 'fathom', artist: 'Matt Dixon', title: 'Full Fathom Five', url: 'https://www.instagram.com/mattdixonart', note: "Optional add-on: LED on antenna. (step 3)", addon: "Antenna glows", addonPrice: 10, addonPreviewUrl: '/img/illustrator-series/full-fathom-five-led-preview.jpg' },
        { key: 'divinity', artist: 'Matt Dixon', title: 'Divinity', url: 'https://www.instagram.com/mattdixonart', },
        { key: 'lost8', artist: 'Louis Picard', title: 'The Lost Ones 08', url: 'https://www.instagram.com/louispicard.art/', },
        { key: 'lost6', artist: 'Louis Picard', title: 'The Lost Ones 06', url: 'https://www.instagram.com/louispicard.art/', },
        { key: 'lost3', artist: 'Louis Picard', title: 'The Lost Ones 03', url: 'https://www.instagram.com/louispicard.art/', },
        { key: 'avocado', artist: 'MottsyMakes', title: 'Devil\'s Avocado', url: 'https://www.instagram.com/mottsymakes/', },
        { key: 'kiwi', artist: 'MottsyMakes', title: 'Kiwi', url: 'https://www.instagram.com/mottsymakes/', },
        { key: 'hourglass', artist: 'MottsyMakes', title: 'Hourglass', url: 'https://www.instagram.com/mottsymakes/', },
        { key: 'rocket', artist: 'Cam Ojeda', title: 'Rocket', url: 'https://www.instagram.com/camtronart/', },
        { key: 'spirits', artist: 'MilkyStout', title: 'Spirits', url: 'https://www.instagram.com/milkystout/', },
        { key: 'map', artist: 'Anna Geschwind', title: 'Middle Earth', url: 'https://www.instagram.com/annageschwind.art/', }
      ],
      knobs: [
        { key: 'white', title: 'White' },
        { key: 'black',  title: 'Black' },
        { key: 'blue',  title: 'Blue' },
        { key: 'brown',  title: 'Brown' },
        { key: 'cream',  title: 'Cream' },
        { key: 'green',  title: 'Green' },
        { key: 'orange',  title: 'Orange' },
        { key: 'purple',  title: 'Purple' },
        { key: 'red',  title: 'Red', },
        { key: 'al1',  title: 'Aluminum with dot', desc:'TEMPORARILY OUT OF STOCK [+$10] Special order', addonPrice: 10 },
        { key: 'al2', nopreview: true, title: 'Aluminum', desc: '[+$10] Various colors, Special order', addonPrice: 10 },
        { key: 'other', nopreview: true, nothumb: true, title: 'Other', desc: '[+$10] Leave comments, Special order', addonPrice: 10 },
      ],
      stomps: [
        { key: 'slim', title: 'Ultra-slim washer' },
        { key: 'white-plastic', title: 'White plastic' },
        { key: 'silver', title: 'Silver' },
        { key: 'black', title: 'Black' },
        { key: 'blue', title: 'Blue' },
        { key: 'green', title: 'Green' },
        { key: 'purple', title: 'Purple' },
        { key: 'red', title: 'Red' },
        { key: 'yellow', title: 'Yellow' },
      ],
      ledColors: ['blue', 'green', 'orange', 'red', 'white', 'yellow'],
    },
    mounted: function() {
      this.urlParameters = this.getURLParameters()
      if (this.urlParameters.sticker) {
        for (let i = 0; i < this.stickers.length; i++) {
          if (this.stickers[i].key == this.urlParameters.sticker) {
            this.chosenSticker = this.stickers[i]
            break
          }
        }
      }

      this.$refs.wizard.activateAll()
      if (this.urlParameters.pg) {
        if (this.urlParameters.pg == "2") {
          this.$refs.wizard.changeTab(0, 1)
        } else if (this.urlParameters.pg == "3") {
          this.$refs.wizard.changeTab(0, 2)
        }
      }

      this.chosenStomp = this.stomps[0]

      this.waitThenResizeImages()

      window.addEventListener('resize', () => {
        // resize one last time after resize stopped firing
        if (this.resizeDoneTimeout !== undefined) {
          clearTimeout(this.resizeDoneTimeout)
        }
        this.resizeDoneTimeout = setTimeout(() => {
          this.resizeImages()
        }, 250)

        if (! this.resizeThrottled) {
          this.resizeImages()
          this.resizeThrottled = true
          setTimeout(() => {
            this.resizeThrottled = false
          }, resizeThrottleTime)
        }
      })
    },

    methods: {
      knobColorChanged: function(value, id) {
        console.log(value)
      },
      waitThenResizeImages: function() {
        Vue.nextTick(() => {
          this.resizeImages()
        })
      },
      resizeImages: function() {
        let imgs = document.getElementsByClassName('preview-abs')
        imgs = Array.from(imgs)
        let enclosure = document.getElementById('preview-enclosure')
        let w = enclosure.clientWidth
        let h = enclosure.clientHeight
        for (let img of imgs) {
          img.style.width = w + 'px'
          img.style.height = h + 'px'
        }
      },
      chooseSticker: function(which) {
        this.chosenSticker = which
        this.waitThenResizeImages()
        //this.$refs.wizard.nextTab()
      },
      zoomIn: function() {
        // TODO
      },

      getURLParameters: function() {
        let url = window.location.search
        let query = url.substr(1)
        let rv = {}
        query.split("&").forEach(function(part) {
          let item = part.split("=")
          rv[item[0]] = decodeURIComponent(item[1])
        })
        return rv
      },
    },

    computed: {
      total: function() {
        let total = this.basePrice
        if (this.chosenKnob && this.chosenKnob.addonPrice) {
          total += this.chosenKnob.addonPrice
        }
        if (this.chosenSticker && this.chosenSticker.addonPrice && this.choseAddon) {
          total += this.chosenSticker.addonPrice
        }
        if (this.led) {
          total += this.ledPrice
        }
        if (this.extraSticker) {
          total += this.stickerPrice
        }
        if (this.jacksUpgrade) {
          total += this.jackUpgradePrice
        }
        if (this.footswitchUpgrade) {
          total += this.footswitchUpgradePrice
        }
        return total
      },
    }
  });
});
