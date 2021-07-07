

Vue.createApp({
  data() {
    return {
      posts: {},

    }
  },
  mounted() {

    let self = this;

    $.getJSON('/api/articles.api.json', function (data) {

      self.posts = data;

      setTimeout(function () {
        lazyload(document.querySelectorAll(".lazyload"));

      }, 1000);

    });

  },
  methods: {
    changeTheme(theme) {
      console.log(theme);
      document.documentElement.classList.remove(this.settings.theme);
      document.documentElement.classList.add(theme);
      this.settings.theme = theme;
    }
  }
})
.mount('#app')
