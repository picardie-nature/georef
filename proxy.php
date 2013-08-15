<?php
require_once('config.php');
echo file_get_contents(BASE_URL.$_SERVER['QUERY_STRING']);
?>
