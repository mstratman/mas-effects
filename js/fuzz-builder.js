var app = new Vue({
  el: '#fuzz-builder',
  data: {
    chosenSticker: {},
    knobs: 'black-1',
    stomp: '',
    // assumes 'sticker-${key}.png' and 'thumbs/thumb-${key}.png'
    stickers: [
      { key: 'monster', artist: 'Kailey Reid', title: 'Hiding Fear', url: 'https://www.instagram.com/kaileyreidillustration/', },
      { key: 'spaceman', artist: 'David Slebodnick', title: 'Hiding Fear', url: 'https://www.instagram.com/daviddrawsdrawings/', },
      { key: 'comet', artist: 'Justin Estcourt', title: 'Until the End', url: 'https://www.instagram.com/jetsyart/', },
      { key: 'saturn', artist: 'Justin Estcourt', title: 'Saturn Rise', url: 'https://www.instagram.com/jetsyart/', },
      { key: 'isolation', artist: 'Justin Estcourt', title: 'Isolation', url: 'https://www.instagram.com/jetsyart/', },
      { key: 'charging', artist: 'Matt Dixon', title: 'Charging', url: 'https://www.instagram.com/mattdixonart', },
      { key: 'fathom', artist: 'Matt Dixon', title: 'Full Fathom Five', url: 'https://www.instagram.com/mattdixonart', },
      { key: 'divinity', artist: 'Matt Dixon', title: 'Divinity', url: 'https://www.instagram.com/mattdixonart', },
      { key: 'lost8', artist: 'Louis Picard', title: 'The Lost Ones 08', url: 'https://www.instagram.com/louispicard.art/', },
      { key: 'lost6', artist: 'Louis Picard', title: 'The Lost Ones 06', url: 'https://www.instagram.com/louispicard.art/', },
      { key: 'lost3', artist: 'Louis Picard', title: 'The Lost Ones 03', url: 'https://www.instagram.com/louispicard.art/', },
      { key: 'avocado', artist: 'MottsyMakes', title: 'Devil\'s Avocado', url: 'https://www.instagram.com/mottsymakes/', },
      { key: 'kiwi', artist: 'MottsyMakes', title: 'Kiwi', url: 'https://www.instagram.com/mottsymakes/', },
      { key: 'hourglass', artist: 'MottsyMakes', title: 'Hourglass', url: 'https://www.instagram.com/mottsymakes/', },
      { key: 'rocket', artist: 'Cam Ojeda', title: 'Rocket', url: 'https://www.instagram.com/camtronart/', },
      { key: 'spirits', artist: 'MilkyStout', title: 'Spirits', url: 'https://www.instagram.com/milkystout/', },
      { key: 'map', artist: 'Anna Geschwind', title: 'Middle Earth', url: 'https://www.instagram.com/annageschwind.art/', },
    ],
  },
  mounted: function() {
    console.log("Mounted")
  },
  methods: {
    chooseSticker: function(which) {
      this.chosenSticker = which
    },
    zoomIn: function() {
      // TODO
    },
  },
  computed: {
  }
});

