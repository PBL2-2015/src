
var i=1; //idインクリメント

var init_pos_x = 50;
var init_pos_y = 50;
var pos_x = init_pos_x;
var pos_y = init_pos_y;

function fusen_remove(){
	$('.fusen').remove();
}

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
	pos_y += 60;

	i = i + 1;

   // ctx.restore();  // おまじない

}


$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#make_fusen').click();
			break;
		case 68: // Dのキーコード
			if(!confirm('削除してよろしいですか？')){
				// キャンセル時
				return false;
			}else{
				// OK時
				$('#remove_fusen').click();
				pos_x = init_pos_x;
				pos_y = init_pos_y;
			}
			break;

	}
});
