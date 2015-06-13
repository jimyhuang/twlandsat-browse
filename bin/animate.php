<?php

/**
 * Generate static html file for animation
 */
require_once('init.inc');
global $base_path, $base_url;
$base = $base_path.'animate/';

$log = '/tmp/twlandsat.preview.log';
if(file_exists($log)){
  $l = file_get_contents($log);
  $urls = explode("\n", $l);
  foreach($urls as $k => $v){
    $name = substr(md5($v), 0, 8);
    $parsed = array();
    if(!file_exists($base_path."animate/$name.json")){
      $query = parse_url($v, PHP_URL_QUERY);
      parse_str($query, $parsed);
      if(!empty($parsed['l'])){
        $json_str = $parsed['l'];
        $decoded = json_decode($json_str);
        if(!empty($decoded)){
          // generte static image
          $img_url = 'http://i.jimmyhub.net/shot/'.$v;
          $gen_img = is_file($img_url);
          $decoded->image = $img_url;
          $success = file_put_contents($base."$name.json", json_encode($decoded));
          if($success){
            `echo "" > $log`;
          }
        }
      }
    }
  }
}

$files = scandir($base);
$tpl = file_get_contents('animate.tpl');

$i = 0;
$rows = $row = array();
$change = FALSE;
foreach($files as $f){
  if(preg_match('/\.json$/', $f)){
    $name = str_replace('.json', '', $f);
    $str = file_get_contents($base.$f);
    $json = json_decode($str);
    $url = $base_url.'/animate/'.$name.'.html';
    if(!is_file('../animate/'.$name.'.html')){
      $change = TRUE;
      if(!empty($json)){
        $replace = array(
          '{title}' => $json->subject,
          '{image}' => $json->image,
          '{url}' => $url,
          '{json}' => json_encode($json),
        );
        $html = str_replace(array_keys($replace), $replace, $tpl);
        file_put_contents($base.$name.'.html', $html);
      }
    }

    // for animate/index.html
    if(!empty($json->author)){
      $row[] = '<div class="col-md-6 placeholder">
      <a href="'.$url.'"><img src="'.$json->image.'" class="img-responsive"></a>
      <h4><a href="'.$url.'">'.$json->subject.'</a></h4><h4>'.$json->author.'</h4>
      </div>';  
    }
    else{
      $row[] = '<div class="col-md-6 placeholder">
      <a href="'.$url.'"><img src="'.$json->image.'" class="img-responsive"></a>
      <h4><a href="'.$url.'">'.$json->subject.'</a></h4>
      </div>';
    }
    if($i%2){
      $rows[] = implode('', $row);
      $row = array();
    }
    $i++;
  }
}

if($change){
  if(!empty($row)){
    $rows[] = implode('', $row);
  }

  $index = file_get_contents('animate-index.tpl');
  $output = '<div class="row">'.implode('</div><div class="row">', $rows).'</div>';
  $index = str_replace('{animate-rows}', $output, $index);
  file_put_contents($base_path.'animate/index.html', $index);
}
