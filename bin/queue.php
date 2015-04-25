<?php
$base = '/home/twlandsat/queue';
$tmp = '/tmp';
$type = $_POST['type'];
$name = $_POST['name'];
$landsat = $_POST['landsat'];
if(!empty($_POST['action']) && !empty($name) && !empty($type)){
  switch ($_POST['action']){
    case 'pending':
      `cat $base/completed | awk '{print $1}' > $tmp/ctmp`;
      if($type == 'LT5'){
        $file = 'pending';
        $c = `grep -v -x -f $tmp/ctmp $base/$file | grep LT5`;
      }
      if($type == 'LC8'){
        $file = 'pending8';
        $c = `grep -v -x -f $tmp/ctmp $base/$file | grep LC8`;
      }
      if(!empty($c)){
        $lines = explode("\n", $c);
        $line_num = array_rand($lines);
        $processing = $lines[$line_num];
        if($processing){
          unset($lines[$line_num]);
          $c = implode("\n", $lines);
          $result = file_put_contents("$base/$file", $c, LOCK_EX);
          if(!empty($result)){
            echo $processing;
            $processing = "$processing $name\n";
            file_put_contents("$base/processing", $processing, FILE_APPEND);
          }
          else{
            echo '0';
          }
        }
      }
      break;
    case 'completed':
      if(!empty($landsat)){
        $completed = "$landsat $name\n";
        file_put_contents("$base/completed", $completed, FILE_APPEND);
        echo "Completed\n";

        ## trigger hof
        `php /home/twlandsat/bin/hof.php`;
      }
      break;
  }
}
