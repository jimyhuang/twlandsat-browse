// global vars
var
  area = '118044',
  b = 'LC81180442015023LGN00',
  a = 'LC81180442014292LGN00',
  z = 12,
  c = [23.42513365687343,120.34612655639648],
  features = [],
  l = ['rgb', 'rgb'];

var mapa, mapb;

var circleOptions = { color: '#f30', fillOpacity: 0.07 };

L.Marker.prototype.serialize = function(){
  return 'm=' + this.getLatLng().lat + ',' + this.getLatLng().lng;
}
L.Circle.prototype.serialize = function(){
  return 'c=' + this.getLatLng().lat + ',' + this.getLatLng().lng + ',' + this.getRadius()
}
L.FeatureGroup.prototype.serialize = function(){
  return this.getLayers().map(function(l) { return l.serialize(); });
}
L.FeatureGroup.prototype.resolve = function(f){
  var fgroup = this;
  f.forEach(function(s){
    if(s.substr(0,2) === 'm='){
      fgroup.addLayer(L.marker(s.substr(2).split(',')))
    }else if(s.substr(0,2) === 'c='){
      var r = s.substr(2).split(',')
      fgroup.addLayer(L.circle(r.slice(0,2), r[2], circleOptions))
    }
  })
  return this;
}

jQuery(document).ready(function($){

  /**
   * Make a object for osm
   */
  var mapObject = function(landsat, name){
    var obj;
    // create base params
    var attribution = '<a href="http://landsat.gsfc.nasa.gov/">USGS/NASA Landsat</a>. Imagery <a href="http://nspo.g0v.tw">賽豬公上太空計畫</a>';
    var maxZoom = 13;
    var layer = name == 'before' ? l[0] : l[1];

    // randomm server
    var server = Math.floor((Math.random() * 3) + 1);
    var rgbview = L.tileLayer('http://l'+server+'.jimmyhub.net/processed/'+landsat+'/tiles-rgb'+'/{z}/{x}/{y}.png', {
      tms: true,
      //attribution: attribution,
      maxZoom: maxZoom,
    });
    var swirnirview = L.tileLayer('http://l'+server+'.jimmyhub.net/processed/'+landsat+'/tiles-swirnir'+'/{z}/{x}/{y}.png', {
      tms: true,
      attribution: attribution,
      maxZoom: maxZoom,
    });
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://nspo.g0v.tw/developer.html">TWlandsat</a>, <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var defaultmap = (layer === 'rgb') ? [osm, rgbview] : [osm, swirnirview];
    obj = new L.map(name, {
      center: c,
      zoom: z,
      maxZoom: 13,
      layers: defaultmap
    });

    var baseLayers = {
      "Street view": osm
    };
    var overlayMaps = {
      "RGB view": rgbview,
      "SwirNir view": swirnirview
    };

    obj.on('dragend', mapMove);
    L.control.layers(baseLayers, overlayMaps).addTo(obj);
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
      return swirnirLegend();
    };
    obj.on('overlayadd', function(e) {
      if (e.name=='SwirNir view'){
        ga('send', 'event', 'nav', 'click', 'swir-switch');
        (name == 'before') ? l[0] = 'swir' : l[1] = 'swir';
        var hash = [];
        hash[6] = l.join('-');
        hashChange(hash);
        legend.addTo(obj);
      }
      if (e.name=='RGB view'){
        ga('send', 'event', 'nav', 'click', 'rgb-switch');
      }
    });
    obj.on('overlayremove', function(e) {
      if (e.name=='SwirNir view'){
        (name == 'before') ? l[0] = 'rgb' : l[1] = 'rgb';
        var hash = [];
        hash[6] = l.join('-');
        hashChange(hash);
        legend.removeFrom(obj);
      }
    });
    return obj;
  }

  /**
   * Draw control
   */
  function Draw(ma, mb){
    var
      mapa = ma,
      mapb = mb,
      draw = {},
      drawControl,
      fgroupa = L.featureGroup().resolve(features).addTo(mapa),
      fgroupb = L.featureGroup().resolve(features).addTo(mapb),
      on = false;

    /**
     * Add draw control to map
     */
    draw.add = function(){
      if (!drawControl) {
        drawControl = new L.Control.Draw({
          draw: {
            polyline: false,
            polygon: false,
            rectangle: false
          },
          edit: {
            featureGroup: fgroupa
          }
        });
      }
      drawControl.addTo(mapa);
      mapa.on('draw:created', function(event){
        var layer = event.layer;
        if (layer.getRadius) {
          ga('send', 'event', 'edit', 'click', 'draw-circle');
          layer.setStyle(circleOptions);
        }
        ga('send', 'event', 'edit', 'click', 'draw-marker');
        fgroupa.addLayer(layer);
        features = fgroupa.serialize();
        fgroupb.clearLayers().resolve(features);
      });

      mapa.on('draw:edited', function(event){
        features = fgroupa.serialize();
        fgroupb.clearLayers().resolve(features);
      });

      mapa.on('draw:deleted', function(event){
        features = fgroupa.serialize();
        fgroupb.clearLayers().resolve(features);
      });
      on = true;
    };

    /**
     * Remove draw control from map
     */
    draw.remove = function(){
      ga('send', 'event', 'edit', 'click', 'draw-save');
      drawControl.removeFrom(mapa);
      hashChange([]);
      on = false;
    }

    /**
     * Toggle draw control on map
     */
    draw.toggle = function(){
      ga('send', 'event', 'edit', 'click', 'edit-mode');
      return (on ? draw.remove : draw.add)()
    }

    return draw;
  }

  /**
   * Setup and initialize map from hashtag
   */
  var mapSetup = function(){
    // reset map using hash
    hashResolv();

    // initialize map height
    var map_height = $(window).height() - $("header").height() - $("footer").height() - $('.twlandsat').height();
    $(".map").height(map_height - 80);

    // before and after layer
    if(b) {
      mapb = mapObject(b, 'before');
    }
    if(a){
      mapa = mapObject(a, 'after');
    }
    if(a && b && mapa && mapb){
      jQuery('#map-diff').beforeAfter(mapb, mapa, {
        imagePath: '/css/images/',
        animateIntro : false,
        introDelay : 800,
        introDuration : 2000,
        introPosition : .5,
        showFullLinks : true
      });

      var draw = Draw(mapa, mapb);
      L.easyButton('fa fa-pencil-square-o', function(){
        $("#before").toggle();
        $("#map-diff > .ui-draggable").toggle();
        $("#map-diff > img").toggle();
        draw.toggle();
      }, '編輯', mapa);
    }
  }

  /**
   * Add navigation select box
   */
  var navSetup = function(){
    // form element
    var $area = $('<select id="select-area">');
    var $before = $('<select id="select-before" class="select-date">');
    var $after = $('<select id="select-after" class="select-date">');
    $("#nav")
      .append('<i class="fa fa-location-arrow"></i>')
      .append($area)
      .append('<i class="fa fa-calendar"></i>')
      .append($before)
      .append('<i class="fa fa-random"></i>')
      .append($after);
    var $copy = $('#copy');

    // setup options
    $.each(nav, function( key, value ) {
      $area.append('<option value="'+key+'">'+value.name+'</option>');
    });

    // chanage action
    $copy.click(function(){
      ga('send', 'event', 'share', 'select', 'copy');
      $(this).select();
    });
    $($area).change(function(e, context){
      ga('send', 'event', 'nav', 'click', 'select-change');
      $before.find('option[value!=0]').remove();
      $after.find('option[value!=0]').remove();
      if(nav[$(this).val()] !== 'undefined'){
        var maps = nav[$(this).val()];
        if(context != 'init'){
          var ll = maps.latlng.split(',');
          mapb.setView(ll, 9);
          mapa.setView(ll, 9);
        }
        $.each(maps, function(key, value) {
          if(key !== 'name' && key !== 'latlng'){
            $before.append('<option value="'+key+'">'+value+'</option>');
            $after.append('<option value="'+key+'">'+value+'</option>');
          }
        });
        $("#select-before").val(b).trigger('change', 'init');
        $("#select-after").val(a).trigger('change', 'init');
      }
    });
    $("#select-before, #select-after").change(function(e, context){
      if(context != 'init'){
        if($(this).attr('id') == 'select-before'){
          ga('send', 'event', 'area', 'change', $("#select-before option:selected").text().substr(0, 4));
        }
        else{
          ga('send', 'event', 'area', 'change', $("#select-after option:selected").text().substr(0, 4));
        }
        var latlng = mapa.getCenter()
        var hash = [
          $area.val(),
          $before.val(),
          $after.val(),
          mapa.getZoom(),
          latlng.lat,
          latlng.lng
        ];
        hashChange(hash);
        if($before.val() != '0' && $after.val() != '0'){
          ga('send', 'pageview', {'page': location.pathname + location.search  + location.hash, 'title': $("#area-select option:selected").text()+" - "+$("#select-before option:selected").text()+" vs "+$("#select-after option:selected").text()});
          mapReset();
        }
      }
    });
    $area.change(function(e, context){
      if(context != 'init'){
        ga('send', 'event', 'area', 'change', $("#area-select option:selected").val());
      }
      var hash = [$area.val()];
      hashChange(hash);
    });
  }

  /**
   * Help function to reset map
   */
  var mapReset = function(){
    $('#map-diff').remove();
    $('<div id="map-diff"><div id="before" /><div id="after" /></div>').insertAfter('#nav');
    $("#before, #after").addClass('map');
    mapSetup(0);
  }

  /**
   * Help function for leaflet drag event
   */
  var mapMove = function(){
    ga('send', 'event', 'nav', 'drag-drop', 'map-move');
    var latlng = mapa.getCenter()
    var hash = [];
    hash[3] = mapa.getZoom();
    hash[4] = latlng.lat;
    hash[5] = latlng.lng;
    hashChange(hash);
  }

  /**
   * Help function for update hashtag
   */
  var hashChange = function(hash){
    var h = window.location.hash.split(';', 1)[0].split(',');
    h[0] = h[0].replace('#','');
    $.each(hash, function(i, v){
      if(v){
        h[i] = v;
      }
    });
    document.title =
      '賽豬公上太空計畫'
      + '|'
      + nav[h[0]].name
      + ' '
      + nav[h[0]][h[1]]
      + '/'
      + nav[h[0]][h[2]];
    window.location.hash = [h.join(',')].concat(features).join(';');
    $("input#copy").val(window.location);
    hashResolv();
  }

  /**
   * Help function for get hashtag value
   */
  var hashResolv = function(i){
    var f = window.location.hash.split(';'),
        h = f[0].split(',');
    f.shift();
    area = h[0].replace('#','');
    b = h[1];
    a = h[2];
    z = h[3]*1;
    c = [h[4]*1,h[5]*1];
    l = h[6].split('-');
    features = f;
    if(i){
      return h[i];
    }
  }

  /**
   * Event trigger after end of map
   */
  intro.oncomplete(function() {
    window.setTimeout(mapReset, 600);
  });

  /**
   * Helper function for leaflet legend
   */
  var swirnirLegend = function(){
    var colors = ['pink', 'deep-blue', 'green', 'deep-green'];
    var labels = ['建築物/裸露地', '水稻田/河流', '植物', '植物'];
    var html = '';

    for (var i = 0; i < colors.length; i++) {
      html += '<div class="'+ colors[i] +'"><i class="fa fa-square"></i>'  + labels[i] + '</div>';
    }
    var $div = $('<div>').html(html);
    $div.addClass('legend');
    return $div[0];
  }


  /**
   * Main function for start map. callback after json loaded
   */
  var mapStart = function(){
    var intro_start = true;
    var visited = localStorage.getItem("twlandsat-diff-intro");
    if (window.location.hash && visited){
      hashResolv();
      intro_start = false;
    }

    var resizing = 0;
    $(window).resize(function(){
      if(!resizing){
        resizing = 1;
        window.setTimeout(function(){
          resizing = 0;
          mapReset();
        }, 600);
      }
    });

    // setup map
    var init = [area, b, a, z, c[0], c[1], l.join('-')];
    hashChange(init);
    navSetup();
    mapSetup(0);

    // this need to be trigger after mapSetup
    $("#select-area").val(area).trigger('change', 'init');
    $("#select-before").val(b).trigger('change', 'init');
    $("#select-after").val(a).trigger('change', 'init');
    $(".check-swirnir").trigger('change', 'init');

    if (intro_start){
      localStorage.setItem("twlandsat-diff-intro", 1);
      intro.start();
    }
  }

  // main
  var nav = {};
  jQuery.getJSON('http://static.jimmyhub.net/nav.json?callback=?', function(json){
    nav = json;
    mapStart();

    // google analytics tracking
    $(".ui-draggable").on('dragstart', function(){
      ga('send', 'event', 'nav', 'drag-drop', 'diff-slide');
    })
    $(".leaflet-control-zoom-out").click(function(){
      ga('send', 'event', 'nav', 'click', 'zoom-out');
    });
    $(".leaflet-control-zoom-in").click(function(){
      ga('send', 'event', 'nav', 'click', 'zoom-in');
    });
  });
});


