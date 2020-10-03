(function ($) {
  "use strict";

  $("#search-bar").hide()
  $("#table-head").hide()

  var base = location.protocol + '//' + location.host + location.pathname;
  let list = Papa.parse(base + "/list.csv", {
  	delimiter: "",
  	newline: "",
  	quoteChar: '"',
  	escapeChar: '"',
  	header: true,
  	encoding: "UTF-8",
  	worker: true,
    error: function(error, file) {
        location.reload();
    },
  	complete: function(books) {
        if (books) {
          window.books = books.data;
          window.fuse = new Fuse(books.data, {
              keys: [
                "Título",
                "Autor",
                "Géneros",
                "Idioma",
                "EPL Id"
            ],
            findAllMatches: true
          });
          window.search = function(pattern) {
              $("#search-bar").fadeOut()
              document.getElementById('books').innerHTML = "";
              window.results = window.fuse.search(pattern).reverse();
              window.refreshResults();
              setTimeout(function(){$("#search-bar").fadeIn()}, 100);
          }
          $("#table-head").fadeIn()
          window.search(" ");
          document.getElementById('search').disabled = false;
          document.getElementById('button').disabled = false;
      }
    },
  	download: true,
    transform: false,
  	transformHeader: false,
  });

  window.refreshResults = function() {
      if (window.results) {
       var height = $(document).height();
       var pages = 3;
       while($(document).height() < height + pages * $(window).height()){
           var item = window.results.pop();
           if (item) {
                document.getElementById('books').innerHTML +=
                    '<tr class="tr-shadow"><td>'
                    + item["item"]["Autor"]
                    + '</td><td>'
                    + item["item"]["Título"]
                    + '</td><td class="desc">'
                    + item["item"]["Géneros"]
                    + '</td><td>'
                    + item["item"]["Idioma"]
                    + '</td><td>'
                    + (item["item"]["Valoración"] ? ('<span class="status--process">' + item["item"]["Valoración"] + '</span>') : "N/A")
                    + '</td><td><div class="table-data-feature"><a class="item" href="magnet:?xt=urn:btih:'
                    + (item["item"]["Enlace(s)"] ?  item["item"]["Enlace(s)"].split(/[ ,]+/).filter(Boolean).pop() : "").replace('"', '\\"')
                    + '&dn='
                    + (item["item"]["EPL Id"] + '_' + item["item"]["Autor"] + '_' + item["item"]["Título"]).replace(/[\W_]+/g, "_")
                    + '&tr=http://tracker.tfile.me/announce&tr=udp://tracker.opentrackr.org:1337/announce"><i class="far fa-arrow-alt-circle-down"></i></a></div></td></tr><tr class="spacer"></tr>'
           }
       }
   }
  }

  $(window).on("scroll", function() {
      var scrollHeight = $(document).height();
      var scrollPos = $(window).height() + $(window).scrollTop();
      if(((scrollHeight - 300) >= scrollPos) / scrollHeight == 0){
          window.refreshResults();
      }
  });
})(jQuery);
