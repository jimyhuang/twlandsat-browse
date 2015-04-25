<?php

/**
 * parse earth explorer rss to pending LC8
 */

require_once('init.inc');

$file = '/tmp/l8.rss';
$pending = '/home/twlandsat/queue/pending8';
if(file_exists($pending)){
  if(time() - filemtime($file) > 3600){
    $c = file_get_contents('http://dds.cr.usgs.gov/ee-data/rss/collections/LANDSAT_8_recent.rss');
    file_put_contents($file, $c);
  }

  $area = array(
    '117043',
    '117044',
    '117045',
    '118043',
    '118044',
  );

  $result = array();
  exec("echo '' > /tmp/pending8");
  foreach($area as $a){
    $r = trim(exec("cat $file | grep '<title>LC8$a' | sed -e 's/<[^>]*>//g'"));
    if($r){
      file_put_contents('/tmp/pending8', $r."\n", FILE_APPEND);
    }
  }
  `grep -v -x -f $pending /tmp/pending8 > $pending`;
}
echo 'done'."\n";
