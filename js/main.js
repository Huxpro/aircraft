/* ===========================================================
 * main.js
 * ===========================================================
 * Copyright 2014 Hux.
 * Aircraft Game.
 *
 * ========================================================== */

var stage = document.querySelector('#stage')
var start = document.querySelector('#start')
var start_btn = document.querySelector('#start button')
var gameUI = document.querySelector('#gameUI')
var score_txt = document.querySelector('#score')
var end = document.querySelector('#end')
var endScore = document.querySelector('#end .panel')
var restart_btn = document.querySelector('#end button')
var hero,bullets,enemys,frame;
var score = 0;
var intervalID;

start_btn.addEventListener('click', onStart)
restart_btn.addEventListener('click', onRestart)


function onStart(){
	start.style.display = 'none';
	gameUI.style.display = 'block';
	gameInit();
}
function onRestart(){
	// Clear Stage and Interval
	var imgs = document.querySelectorAll('#stage img');
	for (var i = imgs.length - 1; i >= 0; i--) {
		stage.removeChild(imgs[i]);
	};
	end.style.display = 'none';
	score = 0;
	gameInit();
}
function gameInit(){
	hero = new Hero(128,425,66,82,'img/hero.png');
	bullets = [];
	enemys = [];
	frame = 0;
	addChild(hero);
	stage.addEventListener('mousemove', onMousemove);
	intervalID = setInterval(enterFrame, 17);
}
function gameOver(){
	clearInterval(intervalID);
	stage.removeEventListener('mousemove', onMousemove);
	end.style.display = 'block';
	endScore.innerText = 'Final Score:'+score;
}
function addChild(obj){
	var ele = document.createElement('img');
	ele.src = obj.imgURL;
	ele.style.position = 'absolute'
	ele.style.left = obj.x + 'px';
	ele.style.top = obj.y + 'px';
	stage.appendChild(ele);
	obj.imgNode = ele;	//Encapsulate Element(Node)
}
function extend(Parent) {
	var Child = function(){
		return Parent.apply(this, arguments);
	};
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.__super__ = Parent.prototype;
	return Child;
}
//精灵类 
function Sprite(x,y,sizeX,sizeY,imgURL){
	this.imgNode = null; //把HTML节点封装进来
	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.imgURL = imgURL;
}
//主角类
var Hero = extend(Sprite);
Hero.prototype = {
	move : function(e){
		this.imgNode.style.left = (e.pageX - stage.offsetLeft - hero.sizeX/2)+'px';
		this.imgNode.style.top = (e.pageY - hero.sizeY/2)+'px';
	},
	hp : 1
} 
function onMousemove(e){
	hero.move(e);
}
//炮弹类
var Bullet = extend(Sprite);
Bullet.prototype = {
	speed : 10,
	move : function(){
		this.imgNode.style.top = (this.imgNode.offsetTop-this.speed)+"px";
	}
}
//敌机类
var Enemy = extend(Sprite);
Enemy.prototype = {
	hp : 4,
	speed : -1,
	move : function(){
		this.imgNode.style.top = (this.imgNode.offsetTop-this.speed)+"px";
	}
}
//逐帧刷
function enterFrame(){
	//update frame and scores
	frame++;
	score_txt.innerText = score;

	//create bullets
	if (frame%6 == 0) {
		var bullet = new Bullet(hero.imgNode.offsetLeft+31,hero.imgNode.offsetTop-10,6,14,'img/bullet.png');
		addChild(bullet);
		bullets.push(bullet)
	};
	//traverse bullets
	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].move();
		//delete out-bullets
		if (bullets[i].imgNode.offsetTop<0) {
			stage.removeChild(bullets[i].imgNode);
       		bullets.splice(i,1);
		};
	};
	//create enemys
	if (frame%40 == 0) {
		//random Xposition
		var enemyX = Math.random()*300;
		var enemy = new Enemy(enemyX,-100,34,24,'img/enemy1.png');
		addChild(enemy);
		enemys.push(enemy)
	};
	//traverse enemys
	for (var i = enemys.length - 1; i >= 0; i--) {
		enemys[i].move();
		//delete out-enemys
		if (enemys[i].imgNode.offsetTop>568) {
			stage.removeChild(enemys[i].imgNode);
       		enemys.splice(i,1);
		};
		//碰撞检测
		//判断主角
		if ( hitTest.call(enemys[i], hero)){
			hero.hp -= 1;
			//if Game Over
			if (hero.hp == 0) {
				gameOver();
			};
		}
		//遍历子弹
		for (var k = bullets.length - 1; k >= 0; k--) {
			if (hitTest.call(bullets[k], enemys[i])) {
				//delete bullet and hurt enemy 
				stage.removeChild(bullets[k].imgNode);
				bullets.splice(k,1);
				enemys[i].hp -= 1;
				if (enemys[i].hp<=0) {
					score += 300;
					stage.removeChild(enemys[i].imgNode);
					enemys.splice(i,1);
				};
			};
		};
	};
}

//碰撞检测
function hitTest(target){
	if (this.imgNode.offsetTop-target.imgNode.offsetTop<target.sizeY && 
		this.imgNode.offsetTop-target.imgNode.offsetTop>-this.sizeY &&
		this.imgNode.offsetLeft-target.imgNode.offsetLeft>-this.sizeX &&
		this.imgNode.offsetLeft-target.imgNode.offsetLeft<target.sizeX) {
		return true;
	}else{
		return false;
	}
	
}

// learning Java
// Sprite(int x,int y)

// class Hero extends Sprite {
// 	int _speed;
// 	Hero(int x, int y,int speed){
// 		super(x,y);
// 		_speed = speed;
// 	}
// }