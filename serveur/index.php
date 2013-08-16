<?php
// Attention : absolument pas sécurisé, pas fait pour être sur Internet
require_once('config.php');
if (array_search($_SERVER['REMOTE_ADDR'], explode(',',ADRS_IP_OK)) === false) {
	die("Acces denied {$_SERVER['REMOTE_ADDR']}");
}
switch ($_GET['action']) {
	case 'dossiers':
		$t = array();
		foreach (glob("./*") as $f) {
			if (is_dir($f)) {
				if ($f == "./mercator") continue;
				$t[] = basename($f); 
			}
		}
		echo json_encode($t);
		break;
	case 'images':
		$t = array();
		foreach (glob("./".basename($_GET['dossier'])."/*.jp2") as $f) {
			$t[] = $f;
		}
		echo json_encode($t);
		break;
	case 'image':
		if (file_exists($_GET["img"])) {
			$new = str_replace(".jp2",".jpg",$_GET["img"]);
			if (!file_exists($new))
				exec("convert {$_GET['img']} $new");
			if (file_exists($new))
				header("location: $new");
			echo "echec convert {$_GET['img']} $new";
		}
		break;
	case 'points':
		$points = array();
		if (file_exists($_GET["img"])) {
			$f_points = "{$_GET["img"]}.points";
			if (!file_exists($f_points)) {
				$points["erreur"] = "pas de fichier de points";
			} else {
				$f = fopen($f_points, "r");
				while ($l = fgets($f,4096)) {
					$d = explode(",",trim($l));
					if ($d[0] == "mapX") continue;
					$points[] = $d;
				}
			}
		} else {
			$points["erreur"] = "pas d'image";
		}
		echo json_encode($points);
		break;
	case 'point_enregistre':
		if (file_exists($_GET["img"])) {
			$f_points = "{$_GET['img']}.points";
			if (file_exists($f_points)) {
				$date = strftime("%Y-%m-%d_%Hh%m.%s");
				copy($f_points, "$f_points-$date.backup");
				$f = fopen($f_points, 'a');
			} else {
				$f = fopen($f_points, 'w');
				fwrite($f, "mapX,mapY,pixelX,pixelY,enable\n");
			}

			fwrite($f, sprintf("%F,%F,%d,%d,%d\n",$_GET['mapX'],$_GET['mapY'],$_GET['pixelX'],($_GET['pixelY']*-1),$_GET['enable']));
			fclose($f);
			break;
		}
		break;
}
?>
