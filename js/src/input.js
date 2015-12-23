
var i=1; //idインクリメント
var pos_x = 50;
var pos_y = 50;

function fusen_display(){

	var input = window.prompt("アイデアを入力してください");

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	// ctx.save();  // おまじない

	// div要素を作成する
	var element = document.createElement('div');
	// div要素にidやclassを付加する
	element.id = i;
	element.className = 'fusen';
	element.innerHTML = input;
	element.style.top = pos_y + 'px'; 
	element.style.left = pos_x + 'px';

	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append(element);

	// pos_x += 50;
	pos_y += 50;

	i = i + 1;

   // ctx.restore();  // おまじない

}


$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#make_fusen').click();
			break;
	}
});
