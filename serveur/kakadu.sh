#!/bin/bash
LD_LIBRARY_PATH=`pwd`/kakadu/
OUT=`mktemp "/tmp/kduXXXX.tif"`
JPG=`echo $1|sed "s/\.jp2/\.jpg/"`

if [[ -d "./kakadu" ]]; then 
	echo -n "Extraction kdu $1 => $OUT"
	if [[ -f $1 ]]; then
		./kakadu/kdu_expand -i $1 -o $OUT
		echo "r: $?";
		ls -l $OUT;
	else
		echo "$1 existe pas";
		exit 1;
	fi
	echo ""
	
	if [[ -f $OUT ]]; then
		echo -n "Convertion jpg $OUT => $JPG"
		convert $OUT $JPG
		rm $OUT
	else 
		echo "$OUT existe pas"
		exit 1
	fi
else
	echo "les binaires doivent être dans le dossier kakadu du même répertoire"
fi
