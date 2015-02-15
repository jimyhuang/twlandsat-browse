<?php
$base = './processed/';
$dirs = scandir('./processed/');
$list = array();
foreach($dirs as $d){
  $file = 'processed/'.$d.'/tiles/openlayers.html';
  if($d[0] === 'L' && is_dir($base.$d) && is_file($file)){
    $day = substr($d, 9, 7);
    $year = substr($day, 0, 4);
    $day = substr($day, 4);
    $date = strtotime($year.'-01-01') + 86400*($day-1);
    $date = date('Y-m-d', $date);
    $list[$d] = '<a href="./?landsat='.$d.'">'.$date.'</a>';
  }
}
$map = $_GET['landsat'] ? $_GET['landsat'] : key($list);
$date = $list[$map];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml"
          <head>
            <title>賽豬公上太空計畫</title>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta http-equiv='imagetoolbar' content='no'/>
            <meta property="og:image" content="https://farm3.staticflickr.com/2876/12199837206_100507b5d4_z.jpg" />
            <!-- Meta image from https://www.flickr.com/photos/t_zero/12199837206 cc by-nc-sa -->
            <style type="text/css"> v\:* {behavior:url(#default#VML);}
                html, body { overflow: hidden; padding: 0; height: 100%; width: 100%; font-family: 'Lucida Grande',Geneva,Arial,Verdana,sans-serif; }
                body { margin: 10px; background: #fff; }
                h1 { margin: 0; padding: 6px; border:0; font-size: 20pt; }
            #header { height: 43px; padding: 0; background-color: #eee; border: 1px solid #888; }
            #subheader { height: 12px; text-align: right; font-size: 10px; color: #555;}
            #map { height: 95%; border: 1px solid #888; }
            .olImageLoadError { display: none; }
            .olControlLayerSwitcher .layersDiv { border-radius: 10px 0 0 10px; } 
        </style>
            <script src='http://maps.google.com/maps/api/js?sensor=false&v=3.7'></script>
            <script src="http://www.openlayers.org/api/2.12/OpenLayers.js"></script>
            <script>
              var map;
              var mapBounds = new OpenLayers.Bounds( 120.003939238, 21.4726486337, 121.798426886, 25.6162235854);
              var mapMinZoom = 2;
              var mapMaxZoom = 13;
              var emptyTileURL = "http://www.maptiler.org/img/none.png";
              OpenLayers.IMAGE_RELOAD_ATTEMPTS = 1;

              function init(){
                  var options = {
                      div: "map",
                      controls: [],
                      projection: "EPSG:900913",
                      displayProjection: new OpenLayers.Projection("EPSG:4326"),
                      numZoomLevels: 13
                  };
                  map = new OpenLayers.Map(options);

                  // Create Google Mercator layers
                  var gmap = new OpenLayers.Layer.Google("Google Streets",
                  {
                      type: google.maps.MapTypeId.ROADMAP,
                      sphericalMercator: true
                  });

                  // Create OSM layer
                  var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

                  // create TMS Overlay layer
                  var tmsoverlay = new OpenLayers.Layer.TMS("TMS Overlay", "",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: false,
                      getURL: getURL
                  });
                  if (OpenLayers.Util.alphaHack() == false) {
                      tmsoverlay.setOpacity(1.0);
                  }

                  map.addLayers([gmap, osm, tmsoverlay]);

                  var switcherControl = new OpenLayers.Control.LayerSwitcher();
                  map.addControl(switcherControl);
                  switcherControl.maximizeControl();

                  map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
          
                  map.addControls([new OpenLayers.Control.PanZoomBar(),
                                   new OpenLayers.Control.Navigation(),
                                   new OpenLayers.Control.MousePosition(),
                                   new OpenLayers.Control.ArgParser(),
                                   new OpenLayers.Control.Attribution()]);
              }
          
              function getURL(bounds) {
                  bounds = this.adjustBounds(bounds);
                  var res = this.getServerResolution();
                  var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
                  var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
                  var z = this.getServerZoom();
                  var path = "./processed/<?php echo $map; ?>/tiles/" + z + "/" + x + "/" + y + "." + this.type; 
                  var url = this.url;
                  if (OpenLayers.Util.isArray(url)) {
                      url = this.selectUrl(path, url);
                  }
                  if (mapBounds.intersectsBounds(bounds) && (z >= mapMinZoom) && (z <= mapMaxZoom)) {
                      return url + path;
                  } else {
                      return emptyTileURL;
                  }
              } 
          
           function getWindowHeight() {
                if (self.innerHeight) return self.innerHeight;
                    if (document.documentElement && document.documentElement.clientHeight)
                        return document.documentElement.clientHeight;
                    if (document.body) return document.body.clientHeight;
                        return 0;
                }

                function getWindowWidth() {
                    if (self.innerWidth) return self.innerWidth;
                    if (document.documentElement && document.documentElement.clientWidth)
                        return document.documentElement.clientWidth;
                    if (document.body) return document.body.clientWidth;
                        return 0;
                }

                function resize() {  
                    var map = document.getElementById("map");  
                    var header = document.getElementById("header");  
                    var subheader = document.getElementById("subheader");  
                    map.style.height = (getWindowHeight()-80) + "px";
                    map.style.width = (getWindowWidth()-20) + "px";
                    header.style.width = (getWindowWidth()-20) + "px";
                    subheader.style.width = (getWindowWidth()-20) + "px";
                    if (map.updateSize) { map.updateSize(); };
                }

                onresize=function(){ resize(); };

                </script>
              </head>
              <body onload="init()">
                <h1>賽豬公上太空 <sup style="font-size: 13px;"><a href="https://github.com/jimyhuang/twlandsat">計畫說明</a></sup></h1>
                <?php echo implode(' | ', $list); ?>
                <h3>現正瀏覽：<?php echo $date ?> 衛星空照圖</h3>
                <div id="map"></div>
                <script type="text/javascript" >resize()</script>
              </body>
            </html>
