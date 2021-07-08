Vue.createApp({
  data() {
    return {
      markdown: {},
      hash: {},
      post: {},
      reload: true
    }
  },
  mounted() {
    let $this = this;

    $this.initMarkdown();
    $this.processYmal($this.markdown.ymal);
    $this.processContent($this.markdown.content);
    $this.toc();
    $this.highlight();
    $this.initHeader();

  },
  methods: {

    initMarkdown() {
      let text = document.getElementById('editor').value;
      // let text = document.getElementById('code').innerText;
      // console.log(text);
      document.getElementById('code').append(text);

      this.markdown = this.parseMarkdown(text);
    },

    parseMarkdown(data) {
      let ymalStart = data.indexOf("---");
      let ymalEnd = data.indexOf("---", ymalStart + 3);
      let index = data.indexOf('#')
      console.log(`start=${ymalStart},end=${ymalEnd},index=${index}`);

      let ymal = data.substring(ymalStart + 3, ymalEnd);
      let content = data.substring(ymalEnd + 3);

      return {
        ymal: ymal,
        content: content
      }

    },

    onhashchange() {

      let hash = location.hash;

      if (hash && hash.startsWith("#/")) {
        if (this.reload) {
          this.reload = true;
          location.reload();
        }
      } else {
        location.hash = this.hash.raw;
        this.reload = false;
      }

    },
    getFileRaw() {
      let raw = `https://raw.githubusercontent.com/${this.hash.user}/Blog/main${this.hash.path}`;
      if (!raw.endsWith(".md")) {
        raw = raw + '.md';
      }
      return raw;
    },
    parseHash() {

      let $this = this;

      let hash = location.hash;
      console.log(hash);
      if (!hash || !hash.substring(1).startsWith('/')) {
        alert("未找到")
        return false;
      }

      let queryIndex = hash.indexOf('?');

      if (queryIndex > 0) {
        hash = hash.substring(0, queryIndex);
      }

      console.log(hash);

      let hashs = hash.substring(2).split('/');

      let index = hash.indexOf('/', 2);
      let path = hash.substring(index);

      $this.hash = {
        raw: location.hash,
        user: hashs[0],
        collection: hashs[1],
        path: path
      };

      console.log($this.hash);

    },
    getQueryString(name, search) {
      search = search || window.location.search.substr(1)
          || window.location.hash.split("?")[1];
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = search.match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    loadRaw(raw, listener) {
      $.ajax({
        url: raw,
        type: 'GET',
        success: function (data) {

          let ymalStart = data.indexOf("---");
          let ymalEnd = data.indexOf("---", ymalStart + 3);
          let index = data.indexOf('#')
          console.log(`start=${ymalStart},end=${ymalEnd},index=${index}`);

          let ymal = data.substring(ymalStart + 3, ymalEnd);
          let content = data.substring(ymalEnd + 3);

          listener(ymal, content);

        }

      });
    },
    processYmal(ymal) {

      let $this = this;

      var SexyYamlType = new jsYaml.Type('!sexy', {
        kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
        construct: function (data) {
          return data.map(function (string) {
            return 'sexy ' + string;
          });
        }
      });

      var SEXY_SCHEMA = jsYaml.DEFAULT_SCHEMA.extend([SexyYamlType]);

      try {
        let post = jsYaml.load(ymal, {schema: SEXY_SCHEMA});
        $this.post = post;

        console.log(post);
      } catch (e) {
        console.log(e);
      }
    },
    processContent(content) {
      var converter = new showdown.Converter();
      converter.setFlavor('github');
      let html = converter.makeHtml(content);
      document.getElementById('markdown').innerHTML = html;
      anchors.add();
    },
    toc() {
      $('#toc').toc({
        headers: 'article h2,article h3, article h4, article h5, article h6',
        classes: {
          item: "nav-item fs--1",
          list: "nav"
        }
      });
    },
    highlight() {
      // document.querySelectorAll('pre code').forEach((block) => {
      //   hljs.highlightBlock(block);
      // });
      hljs.highlightAll();
    },
    initHeader() {
      console.log("初始化Header");
      $(".markdown h2").each(function () {
        console.log($(this).text());
      })
    },
    gitlak() {
      var gitalk = new Gitalk({
        clientID: 'd5980c0f53133a01c696',
        clientSecret: 'e2bc6849c786e2d037ceb624ed3789237560d206',
        repo: 'blog.ifinal.io',
        owner: 'final-gitalk',
        admin: ['ilikly'],
        id: location.pathname,      // Ensure uniqueness and length less than 50
        distractionFreeMode: false  // Facebook-like distraction free mode
      })
      //
      gitalk.render('gitalk-container', function (data) {
        console.log(data);
      });
    },
    mermaid() {
      mermaid.initialize({
        theme: 'forest',
        sequence: {
          showSequenceNumbers: true
        },
        er: {
          fontSize: 18
        }
      });
      mermaid.init({}, ".language-mermaid, .language-sequence");
    }
  }
})
.mount('#app')