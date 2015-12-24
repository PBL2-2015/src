
var i=1; //idインクリメント

var init_canvas_width = 600;
var init_canvas_height = 600;
var init_pos_x = 50;
var init_pos_y = 50;
var pos_x = init_pos_x;
var pos_y = init_pos_y;

function fusen_remove(){
	if(!confirm('削除してよろしいですか？')){
		// キャンセル時
		return false;
	}else{
		// OK時
		$('.fusen').remove();
		//　位置情報を初期化
		pos_x = init_pos_x;
		pos_y = init_pos_y;
		canvas.height = init_canvas_height;
	}
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

	// 付箋がcanvasのheightを超える場合に，canvasのheightを高くする
	// if(pos_y + 100 > canvas.height){
	// 	canvas.height = pos_y + 200;
	// 	pos_y += 100;
	// }else{
	// 	pos_y += 100;
	// }

	if(pos_x + 150 >= canvas.width){
		canvas.width = pos_x + 200;
	}

	// 付箋を6個以上貼った場合に2列目に移動
	if(pos_y >= 550){
		pos_x += 200;
		pos_y = init_pos_y;
	} else{
		pos_y += 100;
	}

	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append(element);

	i = i + 1;

   // ctx.restore();  // おまじない

}


$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#make_fusen').click();
			break;
		case 68: // Dのキーコード
			$('#remove_fusen').click();
			break;
	}
});
