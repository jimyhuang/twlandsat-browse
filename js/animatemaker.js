// global vars
var 
  area = '118044',
  b = 'LC81180442015023LGN00',
  a = 'LC81180442014292LGN00',
  z = 12,
  c = [23.42513365687343,120.34612655639648],
  l = ['rgb', 'rgb'];

var mapa, mapb;
var animationInfo={};

function generate_animation(){  
  /*
  {
      subject:'石門水庫缺水實況衛星圖',
      rows: [
        {title:'LC81170432014237LGN00', date:'2014-08-25', data:'88.83'},
        {title:'LC81170432014333LGN00', date:'2014-11-29', data:'62.11'},
        {title:'LC81170432014365LGN00', date:'2014-12-31', data:'59.81'},
        {title:'LC81170432015016LGN00', date:'2015-01-16', data:'49.58'},
        {title:'LC81170432015032LGN00', date:'2015-02-01', data:'42.2'},
        {title:'LC81170432015048LGN00', date:'2015-02-17', data:'34'}
      ]
  }
  */

  var animationRows = [];
  $("#sortable li input[type=text]").each(function() {
    var date=$(this).attr("id"); 
    date=date.substr(5);
    var title=animationInfo[date];
    var data=$(this).val();
    console.log("generate animation ",date, title, data);
    var info={};
    info['title']=title;
    info['date']=date;
    info['data']=data;
    animationRows.push(info);
  });

  var result={};
  result['subject']=$("#animation_title").val();
  result['rows']=animationRows;
  console.log(JSON.stringify(result));
  /*$.ajax({
    type: 'POST',
    url: "http://nspo.g0v.tw/bin/animate_submit.php",
    data: JSON.stringify(result)
  });*/

  //call server to generate output file
}

function remove_animation(){
  $("#sortable li input").each(function() {
      var select=$(this).prop("checked"); 
      var date=$(this).attr("id");  
      console.log(date, select)
      if(select){
          var date=$(this).attr("id");
          $(this).parent().remove();
      }
  });    

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
      attribution: attribution,
      maxZoom: maxZoom,
    });
    var swirnirview = L.tileLayer('http://l'+server+'.jimmyhub.net/processed/'+landsat+'/tiles-swirnir'+'/{z}/{x}/{y}.png', {
      tms: true,
      attribution: attribution,
      maxZoom: maxZoom,
    });
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
    
    /*
    var ButtonOptions = {
      'text': 'Add',  // string
      'iconUrl': '/css/images/handle.png',  // string
      'onClick': add_button_onClick,  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
    }   
    
    var addButton = new L.Control.Button(ButtonOptions).addTo(obj);
    */
    return obj;
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
    }
  }

  /**
   * Add navigation select box
   */

   function genAnimationItem(date){
      var $input=$('<li class="ui-state-default"></li>');
      $input.attr("id","li_"+date);
      var $checkbox=$('<input type="checkbox" class="ui-icon ui-icon-arrowthick-2-n-s"/>');
      $checkbox.attr("id", "checkbox_"+date);
      var $checklabel=$('<label></label>');
      $checklabel.attr("for", date);
      var $inputdata=$('<input type="text">');
      $inputdata.attr("id", "text_"+date);
      $checklabel.text(date);
      $input.append($checkbox);
      $input.append($checklabel);
      $input.append($inputdata);
      console.log('genAnimationItem', date);
      $("#sortable").append($input);
   }

   function add_beforebutton(){
      var imgname=$("#select-before").val();
      var before_date=$("#select-before option:selected").text();
      console.log("someone clicked my before ", imgname, before_date);
      animationInfo[before_date]=imgname;
      genAnimationItem(before_date);
   }

   function add_afterbutton(){
      var imgname=$("#select-after").val();
      var after_date=$("#select-after option:selected").text();
      console.log("someone clicked my after ", imgname, after_date);
      animationInfo[after_date]=imgname;
      genAnimationItem(after_date);
  }

  var navSetup = function(){
    // form element
    var $area = $('<select id="select-area">');
    var $before = $('<select id="select-before" class="select-date">');
    var $before_add =$('<a class="btn btn-info btn-xs" role="button">add</a>')
    var $after = $('<select id="select-after" class="select-date">');
    var $after_add =$('<a class="btn btn-info btn-xs" role="button"><span>add</span></button>')
    $("#nav")
      .append('<i class="fa fa-location-arrow"></i>')
      .append($area)
      .append('<i class="fa fa-calendar"></i>')
      .append($before)
      .append($before_add)
      .append('<i class="fa fa-random"></i>')
      .append($after)
      .append($after_add);
    var $copy = $('#copy');
    $after_add.click(function(){
      add_afterbutton();
    });
    $before_add.click(function(){
      add_beforebutton();
    });

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

    $( "#sortable" ).sortable();  
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
  }

  // main
  var nav = {}; 
  jQuery.getJSON('http://static.jimmyhub.net/nav.json', function(json){
    nav = json;
    mapStart();
  });
});


