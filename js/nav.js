// global vars
var 
  area = '118044',
  b = 'LC81180442015023LGN00',
  a = 'LC81180442014292LGN00',
  z = 12,
  c = [23.42513365687343,120.34612655639648],
  l = ['rgb', 'rgb'];

var mapa, mapb;

jQuery(document).ready(function($){

  /**
   * Setup and initialize map from hashtag
   */
  var mapSetup = function(){
    // reset map using hash
    hashResolv();

    // initialize map height
    var map_height = $(window).height() - $("header").height() - $("footer").height();
    $(".map").height(map_height - 80);

    // create base params
    var attribution = 'Data &copy; <a href="http://landsat.gsfc.nasa.gov/">USGS/NASA Landsat</a> in <a href="http://landsat.gsfc.nasa.gov/?page_id=2339">Public Domain</a>. Images <a href="http://twlandsat.jimmyhub.net">TWLandsat</a>';
    var maxZoom = 13;

    // before and after layer
    if(b){
      var layer_b = 'rgb';
      var layer_b = l[0] ? l[0] : 'rgb';
      var serverb = Math.floor((Math.random() * 3) + 1);
      var before = L.tileLayer(
        'http://l'+serverb+'.jimmyhub.net/processed/'+b+'/tiles-'+layer_b+'/{z}/{x}/{y}.png',
        {
          tms: true,
          maxZoom: maxZoom,
        }
      );
      var osmb = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });
      mapb = new L.map('before', {
        center: c,
        zoom: z,
        maxZoom: 13,
        layers: [osmb, before]
      });
      mapb.on('zoomend', mapMove);
      mapb.on('dragend', mapMove);
    }
    if(a){
      var servera = Math.floor((Math.random() * 3) + 1);
      var layer_a = l[1] ? l[1] : 'rgb';
      var after = L.tileLayer(
        'http://l'+servera+'.jimmyhub.net/processed/'+a+'/tiles-'+layer_a+'/{z}/{x}/{y}.png',
        {
          tms: true,
          attribution: attribution,
          maxZoom: maxZoom,
        }
      );
      var osma = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });
      mapa = new L.map('after', {
        center: c,
        zoom: z,
        maxZoom: 13,
        layers: [osma, after]
      });
      mapa.on('dragend', mapMove);
    }
    if(a && b && mapa && mapb){
      jQuery('#map-diff').beforeAfter(mapb, mapa, {
        imagePath: './css/images/',
        animateIntro : true,
        introDelay : 800,
        introDuration : 2000,
        introPosition : .4,
				beforeLinkText: '僅顯示左側',
				afterLinkText: '僅顯示右側',
        showFullLinks : true
      });
    }
  }


  /**
   * Add navigation select box
   */
  var navSetup = function(){
    // form element
    var $area = $('<select id="select-area">');
    var $before = $('<select id="select-before" class="select-date">');
    var $check_before = $('<input type="checkbox" id="check-before" class="check-swirnir" title="False color" value="1">');
    var $after = $('<select id="select-after" class="select-date">');
    var $check_after = $('<input type="checkbox" id="check-after" class="check-swirnir" title="False color" value="1">');
    $("#nav")
      .append('<i class="fa fa-location-arrow"></i>')
      .append($area)
      .append('<i class="fa fa-calendar"></i>')
      .append($before)
      .append($check_before)
      .append('<i class="fa fa-random"></i>')
      .append($after)
      .append($check_after)
    var $copy = $('<input type="text" name="copy" id="copy" size="100" />');
    $("footer").append('<div id="permalink"><label for="copy" class="fa fa-clipboard"></label></div>');
    $("#permalink").append($copy);

    // setup options
    $.each(nav, function( key, value ) {
      $area.append('<option value="'+key+'">'+value.name+'</option>');
    });

    // chanage action
    $copy.click(function(){
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
        $(".select-date").animate( { color: '#FF0000' }, 800 );
        $(".select-date").animate( { color: '#000000' }, 800 );
        
      }
    });
    $("#select-before, #select-after").change(function(e, context){
      ga('send', 'event', 'nav', 'click', 'select-change');
      if(context != 'init'){
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
          ga('send', 'pageview', {'page': '/', 'title': document.title});
          mapReset();
        }
      }
    });
    $area.change(function(){
      var hash = [$area.val()];
      hashChange(hash);
    });
    $('.check-swirnir').change(function(e, context) {
      if(context == 'init'){
        console.log(l);
        if(l[0] != 'rgb'){
          $("#check-before").prop('checked', true);;
        }
        if(l[1] != 'rgb'){
          $("#check-after").prop('checked', true);;
        }
      }
      else{
        ga('send', 'event', 'nav', 'click', 'swir-switch');
        var vals = [];
        $(".check-swirnir").each(function(i){
          if($(this).is(':checked')){
            vals[i] = 'swirnir';
          }
          else{
            vals[i] = 'rgb';
          }
        });
        var hash = [];
        hash[6] = vals.join('-');
        hashChange(hash);
        mapReset();
      }
    });
  }

  /**
   * Help function to reset map
   */
  var mapReset = function(){
    $('#map-diff').remove();
    $('<div id="map-diff"><div id="before" /><div id="after" /></div>').appendTo('main');
    $("#before, #after").addClass('map');
    mapSetup(0);
  }

  /**
   * Help function for leaflet drag event
   */
  var mapMove = function(){
    ga('send', 'event', 'nav', 'click', 'map-move');
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
    var h = window.location.hash.split(',');
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
    window.location.hash = h.join(',');
    $("input#copy").val(window.location);
    hashResolv(); 
  }

  /**
   * Help function for get hashtag value
   */
  var hashResolv = function(i){
    var h = window.location.hash.split(',');
    area = h[0].replace('#','');
    b = h[1];
    a = h[2];
    z = h[3]*1;
    c = [h[4]*1,h[5]*1];
    l = h[6].split('-');
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

  // main
  var intro_start = true;
  if (window.location.hash){
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
    intro.start();
  }
});


