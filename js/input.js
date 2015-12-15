
var i=1; //idインクリメント

function fusen_display(){

	var input = window.prompt("アイデアを入力してください");

	var canvas = document.getElementById("canvas")
	var ctx = canvas.getContext("2d");
	
	ctx.save();  // おまじない

	ctx.font = "40px meiryo";
	ctx.fillText(input, 50, 30);

	// $('canvas').append('<div id='+ i + ' class="fusen">'+ input + '</div>');

	// i = i + 1;

   ctx.restore();  // おまじない

}