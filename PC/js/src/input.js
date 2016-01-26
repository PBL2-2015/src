
// milkcocoaリファレンス
// https://mlkcca.com/document/api-js.html

var i=1; //idインクリメント

var init_canvas_width = 3000;
var init_canvas_height = 3000;
var init_pos_x = 50;
var init_pos_y = 50;
var pos_x = init_pos_x;
var pos_y = init_pos_y;

var milkcocoa = new MilkCocoa('yieldijtvk6yv.mlkcca.com');



// データストアの作成
var ds = milkcocoa.dataStore('fusen/message');

// 付箋を全て削除する
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
	

function fusen_display(){

	// 連続入力がONのとき１，OFFのとき0を返す
	var check_count = $(':checkbox[name="conInput"]:checked').length;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var input = window.prompt("アイデアを入力してください");

	var n = input.length;

	// 30文字以上or入力が空のときに警告
	while(n > 30 || n == 0){
		if(n > 30){
			alert("30文字以内じゃないと表示しないんだからね！！");
		}else if(n == 0){
			alert("入力が空です");
		}
		var input = window.prompt("アイデアを入力してください");
		var n = input.length;
	}

	// 入力結果をデータストアに新しく追加
	ds.push({
            'content' : input,
            'visibility' : 'visible'
    });


	// 連続入力がONの時に入力を繰り返す
	if(check_count == 1){
		fusen_display();
	}

}

function createFusen(id,input){

	// 連続入力がONのとき１，OFFのとき0を返す
	var check_count = $(':radio[name="conInput"]:checked').length;

	var element = document.createElement('div');
	
	// div要素にidやclassを付加する
	element.id = id +"_fusen";
	element.className = 'fusen';
	element.innerHTML = input;
	element.style.top = pos_y + 'px'; 
	element.style.left = pos_x + 'px';

	var cross_element = document.createElement('div');
	cross_element.id = id +"_cross";
	cross_element.className = 'cross';
	cross_element.innerHTML = '☓';
	cross_element.style.top = 5 + 'px'; 
	cross_element.style.left = 130 + 'px';


	// ☓ボタンをクリックした場合の操作
	cross_element.onclick = function(){
		if(!confirm('削除してよろしいですか？')){
			// キャンセル時
			return false;
		}else{
			// OK時
		
			// var num = this.id.match(/\d/g).join("");
			// document.getElementById(num+"_fusen").style.visibility="hidden"; //visibilityを使う方法
			//document.getElementById(num+"_fusen").style.display="none"; //displayを使う方法
			
			//$(this).parent().remove(); //remove使う方法

			// pushされたときに付加されたid（_crossより前の文字列）を切り取る
			tmp = this.id;
			_id = tmp.substring(0, tmp.indexOf("_") );

			var text = $(_id + '_fusen').html();

			// クリックされたidのデータを更新⇒setイベントを発火させる
			ds.set(_id, {
				'content' : text,
				'visibility':'hidden'
			});

		}
	}
	
	pos_x += 200;

	// 次の列へ移動する
	if(pos_x >= 2800){
		pos_x = init_pos_x;
		pos_y += 150;
	}

	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append($(element).append(cross_element));

	// idを増やす
	// i = i + 1;

	// 付箋をドラッグ可能にする
	$('.fusen').draggable({
		containment: '#canvas', // canvas内でのみドラッグ可能
		opacity: 0.3, // 移動中の透過率
	 	revert: false // ドラッグ終了時に元の場所に戻さない
	});


};



$(function(){

	// データストアでpushイベントを検知したとき
	ds.on('push',function(pushed){
		createFusen(pushed.id, pushed.value.content)
	});

	// データストアでsetイベントを検知したとき
	ds.on('set', function(set){
		document.getElementById(set.id+"_fusen").style.visibility="hidden"; 
	});

});


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

$(document).on('click','#capture_btn', function(){

	var element = $('#canvas-wrap')[0];

    html2canvas(element, {onrendered:function(canvas) {

     	var imgData = canvas.toDataURL("image/png");

	// ダウンロードリンクの生成
      	var downloadLink = document.createElement("a");
     	downloadLink.download = 'sample.png';
     	downloadLink.href = imgData;

     	downloadLink.click();

    }});

});



		// $(window).bind('resize load', function(){
		// 	$("html").css("zoom" , $(window).width()/640 );
		// });


$(function(){
	if (navigator.userAgent.indexOf('iPhone') > 0){
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=0.5,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}else if(navigator.userAgent.indexOf('Android') > 0){
		
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}
});



