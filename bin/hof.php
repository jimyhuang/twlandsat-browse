<?php

require_once('init.inc');

$c = file_get_contents('../queue/completed');
$line = explode("\n", $c);
$wall = array();
foreach($line as $l){
  list($landsat, $name) = explode(' ', $l);
  $name = !empty($name) ? $name : 'anonymous';
  $wall[$name][$landsat] = $landsat;
}

foreach($wall as $name => $l){
  foreach($l as $k => $landsat){
    $dir = "../processed/$landsat/tiles-rgb/12";
    $img = FALSE;
    if(is_dir($dir)){
      $subdir = scandir($dir);
      unset($subdir[0]);
      unset($subdir[1]);
      $rand_key = array_rand($subdir);
      $dir .= "/".$subdir[$rand_key];
      if(is_dir($dir)){
        $imgs = scandir($dir);
        unset($imgs[0]);
        unset($imgs[1]);
        $rand_key = array_rand($imgs);
        $dir .= "/".$imgs[$rand_key];
        $img = ltrim($dir, '.');
      }
    }
    if($img){
      $wall[$name][$k] = $img;
    }
  }
}

uasort($wall, function ($a, $b) {
  $a = count($a);
  $b = count($b);
  return ($a == $b) ? 0 : (($a > $b) ? -1 : 1);
});

file_put_contents('../hof.json', json_encode($wall));
