
// milkcocoaリファレンス
// https://mlkcca.com/document/api-js.html

// var i=1; //idインクリメント

var initCanvasWidth = 2000;
var initCanvasHeight = 2000;
var init_pos_x = 50 + 'px';
var init_pos_y = 50 + 'px';
var pos_x = init_pos_x;
var pos_y = init_pos_y;

// MilkCocoaオブジェクトのインスタンスを取得
var milkcocoa = new MilkCocoa('yieldijtvk6yv.mlkcca.com');

// データストアの作成
var ds = milkcocoa.dataStore('fusen/message');

// 付箋を全て削除する
function allRemove(){
	if(!confirm('削除してよろしいですか？')){
		// キャンセル時
		return false;
	}else{
		// OK時
		$('.fusen').remove();
		//　位置情報を初期化
		pos_x = init_pos_x;
		pos_y = init_pos_y;
		canvas.height = initCanvasHeight;
	}
}
	
function fusenDisplay(){

	// 連続入力がONのとき１，OFFのとき0を返す
	var checkCount = $(':checkbox[name="conInput"]:checked').length;

	// canvasの設定
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// ユーザがアイデアを入力する
	var input = window.prompt("アイデアを入力してください(30文字以内)");

	var n = input.length;
	// 入力が30文字以上or入力が空のときに警告
	while(n > 30 || n == 0){
		if(n > 30){
			alert("30文字以内で記述して下さい");
		}else if(n == 0){
			alert("入力が空です");
		}
		var input = window.prompt("アイデアを入力してください");
		var n = input.length;
	}

	// 入力した内容をデータストアに新しく追加
	// このときにidが自動で生成される（on()メソッド中でpushed.idとして取得可能）

	ds.push({
            'content' : input,
            'visibility' : 1,
            'x' : pos_x,
            'y' : pos_y
    });

	pos_x = pos_x + 200 + 'px';

	// 次の列へ移動する
	if(pos_x >= 2800){
		pos_x = init_pos_x;
		pos_y += 150 + 'px';
	}

	// 連続入力がONの時に入力を繰り返す
	if(checkCount == 1){
		fusenDisplay();
	}

}

function createFusen(id,input,pos_x,pos_y){

	// 連続入力がONのとき１，OFFのとき0を返す
	var checkCount = $(':radio[name="conInput"]:checked').length;

	// 付箋のdiv要素の作成 
	var element = document.createElement('div');
	element.id = id +"_fusen";
	element.className = 'fusen';
	element.innerHTML = input;
	element.style.top = pos_y ;
	element.style.left = pos_x ;

	// 削除ボタン(☓ボタン)のdiv要素の作成
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

			a = this.parentNode.style.left; // 付箋のx座標
			b = this.parentNode.style.top; // 付箋のy座標

			tmp = this.id;

			_id = tmp.substring(0, tmp.indexOf("_") );

			console.log(a,b);

			var text = $(_id + '_fusen').html();

			// クリックされたidのデータを更新⇒setイベントを発火させる
			ds.set(_id, {
				'content' : text,
				'visibility':0,
				'x' : a + 'px',
            	'y' : b + 'px'
			});
		}
	}
	
	// pos_x += 200;

	// // 次の列へ移動する
	// if(pos_x >= 2800){
	// 	pos_x = init_pos_x;
	// 	pos_y += 150;
	// }

	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append($(element).append(cross_element));

	// idを増やす
	// i = i + 1;

	// 付箋をドラッグ可能にする
	$('.fusen').draggable({
		containment: '#canvas', // canvas内でのみドラッグ可能
		opacity: 0.3, // 移動中の透過率
	 	revert: false,
	 	stop : function(event, ui){
	 		console.log('Dropped!!');

	 		// ドロップした付箋のposition(親要素からの座標)を取得
	 		zahyo = $(this).position();

			// uiにはhelperオブジェクトというものが渡され，dropした要素の情報が入っている
	 		// http://stacktrace.jp/jquery/ui/interaction/draggable.html
			
			// ドロップした付箋のidを取得 
			idName = ui.helper[0].id; // 付箋のid(◯◯_fusen)を取得
	 		innerText = ui.helper[0].firstChild.data; // 付箋のテキストを取得

			moveFusen(idName,innerText,zahyo);	 		

			
		 	} // ドラッグ終了時に元の場所に戻さない
	});

};

function moveFusen(idName,input,zahyo){

		_id = idName.substring(0, idName.indexOf("_") );

			ds.set(_id, {
				'content' : input,
				'visibility':1,
				'x' : zahyo.left + 'px',
            	'y' : zahyo.top + 'px'
		
		});

};

$(function(){

	// 読み込み時に
	ds.stream().size(20).sort('desc').next(function(err,datas){
		 for(var i=0;i < datas.length;i++){
		createFusen(datas[i].id, datas[i].value.content,datas[i].value.x, datas[i].value.y);
		console.log(datas[i].id, datas[i].value.content,datas[i].value.x, datas[i].value.y);
		}

	});

	// データストアでpushイベントを検知したとき
	ds.on('push',function(pushed){
		createFusen(pushed.id, pushed.value.content, pushed.value.x,pushed.value.y)
	});

	// データストアでsetイベントを検知したとき

	ds.on('set', function(set){
		
		vis = set.value.visibility;

		console.log(vis);
		switch(vis){
			
			case 0: //visible = 0
				console.log('見えなくするよ！');
				$('div#'+ set.id + '_fusen').css("display","none"); 			
				break;

			case 1: //visible = 1
				$('div#'+ set.id + '_fusen').css("left", set.value.x);
				$('div#'+ set.id + '_fusen').css("top" , set.value.y);
				break;

			default:
				break;
		}


	});

});


// キーボードショートカット
$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#makeFusen').click();
			break;
		case 68: // Dのキーコード
			$('#removeFusen').click();
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

$(function(){
	if (navigator.userAgent.indexOf('iPhone') > 0){
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=0.5,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}else if(navigator.userAgent.indexOf('Android') > 0){
		
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}
});



