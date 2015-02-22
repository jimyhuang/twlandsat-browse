<?php
$base = './processed/';
$dirs = scandir('./processed/');
$nav = $list = array();
$location = array(
  '117043' => array('name' => '北部(117/43)', 'latlng' => '24.6245479696219,121.44287109374999'),
  '117044' => array('name' => '東部(117/44)', 'latlng' => '22.821757357861223,121.20666503906249'),
  '117045' => array('name' => '屏東(117/45)', 'latlng' => '22.187404991398775,120.6909942626953'),
  '118043' => array('name' => '桃竹苗(118/43)', 'latlng' => '23.835600986620936,120.48431396484375'),
  '118044' => array('name' => '西南沿海(118/44)', 'latlng' => '23.34477759760015,120.82763671875'),
);
foreach($dirs as $d){
  $file = 'processed/'.$d.'/tiles-rgb/openlayers.html';
  if($d[0] === 'L' && is_dir($base.$d) && is_file($file)){
    $rawpath = substr($d, 3, 6);
    $day = substr($d, 9, 7);
    $year = substr($day, 0, 4);
    $day = substr($day, 4);
    $date = strtotime($year.'-01-01') + 86400*($day-1);
    $date = date('Y-m-d', $date);
    if(empty($nav[$rawpath]['name'])){
      $nav[$rawpath]['name'] = $location[$rawpath]['name'];
      $nav[$rawpath]['latlng'] = $location[$rawpath]['latlng'];
    }
    $nav[$rawpath][$d] = $date;
    $list[$d] = array(
      'date' => $date,
      'location' => $location[$rawpath],
      'rawpath' => $rawpath,
    );
  }
}
$landsat = !empty($_GET['landsat']) && $_GET['landsat'][0] === 'L' ? $_GET['landsat'] : '';
list($before, $after) = explode('|', $landsat);
?>
<!DOCTYPE html>
<html>
<head>
  <title>賽豬公上太空計畫</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta property="og:image" content="https://farm3.staticflickr.com/2876/12199837206_100507b5d4_z.jpg" />
  <!-- Meta image from https://www.flickr.com/photos/t_zero/12199837206 cc by-nc-sa -->
  <link rel="stylesheet" href="//twlandsat.jimmyhub.net/css/style.css" />
  <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

  <script src="http://www.openlayers.org/api/2.12/OpenLayers.js"></script>
  <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

  <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="http://code.jquery.com/ui/1.11.0/jquery-ui.min.js"></script>
  <script type="text/javascript" src="//twlandsat.jimmyhub.net/vendor/js/jquery.ui.touch-punch.min.js"></script> 
  <script type="text/javascript" src="//twlandsat.jimmyhub.net/vendor/js/jquery.beforeafter-map-0.11.js"></script>
  <script type="text/javascript">
    var nav = <?php echo json_encode($nav); ?>;
  </script>
</head>
<body>
  <div id="page">
    <header id="header">
      <h1 id="site-name">賽豬公上太空</h1>
      <div id="share">
        <span class="fa fa-github-square"><a href="https://github.com/jimyhuang/twlandsat-browse" target="_blank">Code</a></span>
        <span class="fa fa-comment"><a href="https://www.facebook.com/groups/610479852418250/" target="_blank">社團</a></span>
        <span class="fa fa-globe"><a href="https://github.com/jimyhuang/twlandsat/blob/master/README.md" target="_blank">關於</a></span>
      </div>
      <nav id="nav">
      </nav>
    </header>
    <main>
      <div id="map-diff">
        <div id="before" class="map"></div>
        <div id="after" class="map"></div>
      </div>
    </main>
    <footer>
    </footer>
  </div> <!--/page-->
<script>
var landsat = '<?php echo $landsat; ?>';
</script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59775466-1', 'auto');
  ga('send', 'pageview');
</script>
<script type="text/javascript" src="/js/nav.js"></script>
</body>
</html>
