<?php
$sapi = php_sapi_name();
if($sapi != 'cli') {
  return;
}

$base = __DIR__.'/processed/';
$dirs = scandir($base);

$limit = 3;
$i = 0;
foreach($dirs as $d){
  if($i >= $limit) break;
  `mkdir -p /mnt/s3/processed/$d`;
  $dir = $base.$d;
  if(file_exists($dir.'/final-rgb-pan.TIF.bz2')){
    `cp -f $dir/*.TIF.bz2 /mnt/s3/processed/$d/`;
    `rm -f $dir/*.TIF.bz2`;
    $i++;
  }
}
