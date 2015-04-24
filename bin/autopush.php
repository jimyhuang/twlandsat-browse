<?php

$c = file_get_contents('../queue/pending');
$c = trim($c);
if(!empty($c)){
`cd /home/twlandsat && git commit queue -m "auto update queue"`;
`cd /home/twlandsat && git push`;
}
