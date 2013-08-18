<?php
foreach (glob("*") as $d) {
	if (!is_dir($d))
		continue;
	
	foreach (glob("$d/*.points") as $img_points_f) {
		$src_file = str_replace(".jp2.points", ".jp2", $img_points_f);
		$tif_file = str_replace(".jp2.points", "_georef.tif", $img_points_f);

		$a_faire = false;
		if (!file_exists($tif_file)) {
			$a_faire = true;
		} else {
			$stat_tif = stat($tif_file);
			$stat_points = stat($img_points_f);
			$a_faire = $stat_points['mtime'] >= $stat_tif['mtime'];
			if ($a_faire) unlink($tif_file);
		}
		if ($a_faire) {
			$f = fopen($img_points_f,"r");
			$gcps = '';
			while ($l = fgets($f, 4096)) {
				$t = explode(",", trim($l));

				if ($t[0] == 'mapX') continue;
				if ((int)$t[4] != 1) continue;
				for ($x=0;$x<4;$x++) $t[$x] = abs($t[$x]);	
				$gcps .= "-gcp {$t[2]} {$t[3]} {$t[0]} {$t[1]} ";
			}
			fclose($f);
			$tmp_file = tempnam($d, "translate");
			unlink($tmp_file);
			$cmd = "gdal_translate -of GTiff $gcps $src_file $tmp_file";
			echo "$cmd\n";
			system($cmd);
			$cmd = "gdalwarp -r cubic -tps -co COMPRESS=LZW $tmp_file $tif_file";
			echo "$cmd\n";
			system($cmd);
			unlink($tmp_file);
			echo "\n";
		}
	}
	if (file_exists($d)) {
		$layers_txt = "";
		foreach (glob("./{$d}/*_georef.tif") as $f) {
			$nom = str_replace("_georef.tif","",basename($f));
			$path = getcwd();
			$layers_txt .= "
        LAYER
                TYPE raster
                NAME \"$nom\"
                DATA \"$path/$f\"
        END
				";
				
		}
		$mapfile = file_get_contents("tpl_mapfile.txt");
		$mapfile = str_replace("__GR_LAYERS", $layers_txt,$mapfile);
		$mf = fopen("./$d/images.map","w");
		fwrite($mf, $mapfile);
		fclose($mf);
	}

}
?>
