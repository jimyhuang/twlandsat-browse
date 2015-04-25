<?php
date_default_timezone_set('Asia/Taipei');
$sapi = php_sapi_name();
if($sapi != 'cli') {
  exit(1);
}

// with traling slash
global $base_path, $base_url;
$base_path = dirname(__FILE__) . '/../';
$base_url = 'http://nspo.g0v.tw';
