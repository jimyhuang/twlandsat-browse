<?php

/**
 * Generate navigation for diff tool
 */

require_once('init.inc');
global $base_path;

$base = $base_path.'processed/';
$dirs = scandir($base);
$nav = $list = array();
$location = array(
  '117043' => array('name' => '北部(117/43)', 'latlng' => '24.6245479696219,121.44287109374999'),
  '117044' => array('name' => '東部(117/44)', 'latlng' => '22.821757357861223,121.20666503906249'),
  '117045' => array('name' => '屏東(117/45)', 'latlng' => '22.187404991398775,120.6909942626953'),
  '118043' => array('name' => '新竹台中(118/43)', 'latlng' => '23.835600986620936,120.48431396484375'),
  '118044' => array('name' => '西南沿海澎湖(118/44)', 'latlng' => '23.34477759760015,120.82763671875'),
);
foreach($dirs as $d){
  $file = $base.$d.'/tiles-rgb/openlayers.html';
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

file_put_contents($base_path.'nav.json', json_encode($nav));
