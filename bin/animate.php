<?php
require_once('init.inc');
global $base_path, $base_url;
$base = $base_path.'animate/';
$files = scandir($base);
$tpl = file_get_contents('animate.tpl');

foreach($files as $f){
  if(preg_match('/\.js$/', $f)){
    $name = str_replace('.js', '', $f);
    $str = file_get_contents($base.$f);
    $json = json_decode($str);
    if(!empty($json)){
      $replace = array(
        '{title}' => $json->subject,
        '{image}' => $json->image,
        '{url}' => $base_url.'/animate/'.$name.'.html',
        '{json}' => $str,
      );
      $html = str_replace(array_keys($replace), $replace, $tpl);
      file_put_contents($base.$name.'.html', $html);
    }
  }
}

file_put_contents($base_path.'animate.js', json_encode($nav));
