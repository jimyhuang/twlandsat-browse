<?php
require_once('init.inc');
global $base_path, $base_url;
$base = $base_path.'animate/';
$files = scandir($base);
$tpl = file_get_contents('animate.tpl');

$i = 0;
$rows = $row = array();
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
        '{json}' => json_encode($json),
      );
      $html = str_replace(array_keys($replace), $replace, $tpl);
      file_put_contents($base.$name.'.html', $html);
    }

    // for animate/index.html
    $row[] = '<div class="col-md-6">
      <img src="'.$json->image.'" class="img-responsive">
      <h4>'.$json->subject.'</h4>
    </div>';
    if($i%2){
      $rows[] = $row;
      $row = array();
    }
    $i++;
  }
}

$index = file_get_contents('animate-index.tpl');
$rows = '<div class="row">'.implode('</div><div class="row">', $rows).'</div>';
$index = str_replace('{animate-rows}', $rows, $index);
file_put_contents($base_path.'animate/index.html', $index);
