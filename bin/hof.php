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

$token = 'http://nspo.g0v.tw/diff/#{area},{name},{name},7,23.276673210348186,122.684326171875,rgb-rgb';
foreach($wall as $name => $l){
  foreach($l as $k => $landsat){
    $rawpath = substr($landsat, 3, 6);
    $day = substr($landsat, 9, 7);
    $year = substr($day, 0, 4);
    $day = substr($day, 4);
    $date = strtotime($year.'-01-01') + 86400*($day-1);
    $date = date('Y-m-d', $date);
    
    $link = str_replace(array(
      '{area}',
      '{name}',
    ), array(
      $rawpath,
      $landsat,
    ), $token);
    $wall[$name][$k] = $link;
  /*
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
  */
  }
}

uasort($wall, function ($a, $b) {
  $a = count($a);
  $b = count($b);
  return ($a == $b) ? 0 : (($a > $b) ? -1 : 1);
});

file_put_contents('../hof.json', json_encode($wall));
