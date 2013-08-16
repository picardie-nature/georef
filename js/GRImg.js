/** 
 * Image Source
 * args : id_canvas, img_src, id_b_plus, id_b_moins
 */
function GRImg(args) {
	this.imgref = args.img_src;

	// diagonale de l'image
	this.d = null;
	// diagonale / 2 de l'image
	this.d2 = null;

	// angle de la diagonale
	this.angle = 0;

	// création du canvas
	this.id_canvas = args.id_canvas;
	this.canvas = document.getElementById(this.id_canvas);

	// chargement de l'image (suite callback image_chargee)
	this.image = new Image();
	this.image.obj = this;
	this.image.addEventListener("load", this.image_chargee);
	this.image.src = args.img_src;

	// activation button + - angle
	var bplus = document.getElementById(args.id_b_plus);
	var bmoins = document.getElementById(args.id_b_moins);

	bplus.__GRImg = this;
	bmoins.__GRImg = this;

	bplus.addEventListener("click", function () {
		this.__GRImg.angle_plus(parseInt(document.getElementById(args.id_i_angle).value));
	});
	bmoins.addEventListener("click", function () {
		this.__GRImg.angle_plus(parseInt(document.getElementById(args.id_i_angle).value)*-1);
	});

	// activation + - au clavier
	window.__GRImg = this;
	window.addEventListener("keyup", function (evt) {
		switch (evt.keyCode) {
			case 107:
			case 61:
				this.__GRImg.angle_plus();
				return false;
			case 109:
			case 54:
				this.__GRImg.angle_moins();
				return false;
		}
	});

	// activation click canvas
	this.canvas.__GRImg = this;
	this.canvas.addEventListener("click", this.canvas_click);

}

GRImg.prototype.canvas_click = function (evt) {
	var ptCanvas = {
		x: evt.layerX - this.__GRImg.canvas.offsetLeft,
		y: evt.layerY - this.__GRImg.canvas.offsetTop
	};
	var ptImg = this.__GRImg.coordCanvas2Img(ptCanvas);
	var ptCanv = this.__GRImg.coordImg2Canvas(ptImg);
	this.__GRImg.marqueur(ptCanv,"red");
	window.opener.document.set_nouveau_point(this.__GRImg.imgref, ptImg);
}

GRImg.prototype.angle_plus = function (n) {
	this.angle = (this.angle+n)%360;
	this.dessine();
}

GRImg.prototype.image_chargee = function() {
	// this c'est l'image et obj l'instance
	var obj = this.obj;

	obj.d = Math.round(Math.sqrt(Math.pow(obj.image.height,2)+Math.pow(obj.image.width,2))+1);
	obj.d2 = obj.d/2;

	// création et ajout du canvas au document
	obj.canvas = document.getElementById(obj.id_canvas);
	obj.canvas.width = obj.d;
	obj.canvas.height = obj.d;
	obj.dessine();
}

GRImg.prototype.deg2rad = function (d) {
	return d * Math.PI/180;
}

GRImg.prototype.rad2deg = function (d) {
	return d * 180/Math.PI;
}

GRImg.prototype.dessine = function () {
	var ctx = this.canvas.getContext('2d');
	ctx.fillStyle = "rgb(200,200,200)";
	ctx.fillRect(0,0,this.d,this.d);
	ctx.save();

	var phi = Math.acos(this.image.width/this.d*-1);
	var ang = this.deg2rad(this.angle)+phi;
	var x0 = this.d/2+this.d/2*Math.cos(ang);
	var y0 = this.d-(this.d/2+this.d/2*Math.sin(ang));

	ctx.translate(this.d/2,this.d/2); //(x0,y0);
	ctx.rotate(this.deg2rad(this.angle));
	ctx.drawImage(this.image, -1*this.image.width/2, -1*this.image.height/2);
	ctx.translate(x0*-1,y0*-1);
	ctx.restore();
	points = window.opener.document.get_points();
	for (var i=0; i<points.length;i++) {
		var point_org = new GRPoint(points[i]);
		var point = this.coordImg2Canvas({
			x:point_org.pixelX,
			y:point_org.pixelY*-1
		});
		this.marqueur(point,"yellow");
	}
}

GRImg.prototype.marqueur = function (ptMark,couleur) {
	var ctx = this.canvas.getContext('2d');
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = couleur;
	ctx.moveTo(ptMark.x-5,ptMark.y-5);
	ctx.lineTo(ptMark.x+5,ptMark.y+5);
	ctx.stroke();
	ctx.moveTo(ptMark.x+5,ptMark.y-5);
	ctx.lineTo(ptMark.x-5,ptMark.y+5);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

GRImg.prototype.coordImg2Canvas = function (ptImg) {
	// recentrer
	var x = ptImg.x - this.image.width/2;
	var y = this.image.height/2 - ptImg.y;

	// param trigo
	var hyp = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	var phi = Math.acos(x/hyp);


	if (y < 0) phi *= -1;

	var ptCanv = {
		x: parseInt(Math.cos(phi-this.deg2rad(this.angle))*hyp + this.d2),
		y: parseInt(this.d2+Math.sin(phi-this.deg2rad(this.angle))*hyp*-1)
	};
	return ptCanv;
}

GRImg.prototype.coordCanvas2Img = function (ptCanv) {
	// recentrer
	var x = ptCanv.x - this.d2;
	var y = this.d2 - ptCanv.y;

	// param trigo
	var hyp = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	var phi = Math.acos(x/hyp);

	if (y < 0) phi *= -1;

	var ptImg = {
		x: parseInt(Math.cos(phi+this.deg2rad(this.angle))*hyp + this.image.width/2),
		y: parseInt(this.image.height/2 - Math.sin(phi+this.deg2rad(this.angle))*hyp)
	};

	if (ptImg.x > this.image.width || ptImg.x < 0) return false;
	if (ptImg.y > this.image.height || ptImg.y < 0) return false;

	return ptImg;
}
