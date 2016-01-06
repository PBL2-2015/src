
var i=1; //idインクリメント

var init_canvas_width = 3000;
var init_canvas_height = 3000;
var init_pos_x = 50;
var init_pos_y = 50;
var pos_x = init_pos_x;
var pos_y = init_pos_y;


function all_remove(){
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

function fusen_remove(){
	if(!confirm('削除してよろしいですか？')){
		// キャンセル時
		return false;
	}else{
		// OK時
		parent = element.parentNode;
		console.log(parent);
		$(parent).remove();
		//　位置情報を初期化
	}
}
	

function fusen_display(){

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var input = window.prompt("アイデアを入力してください");

	var n = input.length;

	console.log(n);
	while(n > 30 || n == 0){
		if(n > 30){
			alert("30文字以内じゃないと表示しないんだからね！！");
		}else if(n == 0){
			alert("入力が空です");
		}
		var input = window.prompt("アイデアを入力してください");
		var n = input.length;
	}


	// ctx.save();  // おまじない

	// div要素を作成する
	var element = document.createElement('div');
	// div要素にidやclassを付加する
	element.id = i;
	element.className = 'fusen';
	element.innerHTML = input;
	element.style.top = pos_y + 'px'; 
	element.style.left = pos_x + 'px';

	var cross_element = document.createElement('div');
	cross_element.className = 'cross';
	cross_element.innerHTML = '☓';
	cross_element.style.top = (pos_y - 40) + 'px'; 
	cross_element.style.left = (pos_x + 83) + 'px';
	cross_element.onclick = function(){
	fusen_remove();
	}

	// canvasの高さの修正
	if(pos_y > canvas.height){
		canvas.height = pos_y + 200;
		pos_y += 150;
	}else{
		pos_y += 150;
	}

	// canvas幅の修正
	if(pos_x + 100 > canvas.width){
		canvas.width = pos_x + 150;
	}

	// 次の列の移動する
	if(pos_y >= 3000){
		pos_y = init_pos_y;
		pos_x += 150;
	}

	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append($(element).append(cross_element));

	// idを増やす
	i = i + 1;
	
	// 付箋をドラッグ可能にする
	$('.fusen').draggable({
		containment: '#canvas', // canvas内でのみドラッグ可能
		opacity: 0.3, // 移動中の透過率
	 	revert: false // ドラッグ終了時に元の場所に戻さない
	});

   // ctx.restore();  // おまじない
		
}

// キーボードショートカット
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

// スクリーンショット機能
function screenshot(selector) {
    var element = $(selector)[0];
    html2canvas(element, {onrendered:function(canvas) {
        var imgData = canvas.toDataURL();
        // $('#screen_image')[0].src = imgData;
        $('#download')[0].href = imgData;
        $('#download')[0].innerHTML = "ダウンロード";
    }});
}

// function erase_screenshot() {
//     $('#screen_image')[0].src = "";
//     $('#download')[0].href = "#";
//     $('#download')[0].innerHTML = "";
// }

