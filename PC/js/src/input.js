
// milkcocoaリファレンス
// https://mlkcca.com/document/api-js.html

// var i=1; //idインクリメント

var initCanvasWidth = 1000;
var initCanvasHeight = 1000;
var init_pos_x = 50 + 'px';
var init_pos_y = 50 + 'px';
var pos_x = init_pos_x;
var pos_y = init_pos_y;

var dd = new Date();

// MilkCocoaオブジェクトのインスタンスを取得
var milkcocoa = new MilkCocoa('yieldijtvk6yv.mlkcca.com');

// データストアの作成
var ds = milkcocoa.dataStore('fusen/message');

// データストアにある付箋データを全て削除する
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

		ds.stream().size(20).sort('desc').next(function(err,datas){

		for(var i=0;i < datas.length;i++){
			ds.remove(datas[i].id);
		}

		});

	}
}
	
function createFusen(){

	// 連続入力がONのとき１，OFFのとき0を返す
	var checkCount = $(':checkbox[name="conInput"]:checked').length;

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

	pos_x = parseInt(pos_x) + 200 + 'px';

	// 次の列へ移動する
	if(parseInt(pos_x) >= 800){
		pos_x = init_pos_x;
		pos_y = parseInt(pos_y) + 150 + 'px';
	}

	// 連続入力がONの時に入力を繰り返す
	if(checkCount == 1){
		createFusen();
	}

}

function redrawFusen(id,input,pos_x,pos_y){

	// 連続入力がONのとき１，OFFのとき0を返す
	var checkCount = $(':radio[name="conInput"]:checked').length;

	// canvasの設定
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// 付箋のdiv要素の作成 
	var element = document.createElement('div');
	element.id = id +"_fusen";
	element.className = "fusen";
	element.innerHTML = input;
	element.style.top = pos_y ;
	element.style.left = pos_x ;

	// 削除ボタン(☓ボタン)のdiv要素の作成
	var cross_element = document.createElement('div');
	cross_element.id = id +"_cross";
	cross_element.className = 'cross';
	cross_element.innerHTML = '☓';

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

			idName = this.id; // ◯◯ + _fusen の文字列
			_id = idName.substring(0, idName.indexOf("_") ); //_fusenを取り除いた文字列

			// var text = $(_id + '_fusen').html();
			// データストアから削除する
			ds.remove(_id);
		}
	}
	
	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append($(element).append(cross_element));

	// 付箋をドラッグ可能にする
	// http://stacktrace.jp/jquery/ui/interaction/draggable.html
	$(".fusen").draggable({
        containment: "#canvas",
        // opacity: 0.3,
        revert: false,
        
        start: function(event, ui){
        	idName = ui.helper[0].id; // ◯◯ + _fusen の文字列
			_id = idName.substring(0, idName.indexOf("_") ); //_fusenを取り除いた文字列
            innerText = ui.helper[0].firstChild.data;


           	ds.send({
           		'content': innerText,
        		'idName': idName,
        		message:'moving'
        	});
        },


        stop: function(event, ui) {
            console.log("Dropped!!");

      	    idName = ui.helper[0].id; // ◯◯ + _fusen の文字列
			_id = idName.substring(0, idName.indexOf("_") ); //_fusenを取り除いた文字列
            zahyo = $(this).position();
            innerText = ui.helper[0].firstChild.data;
            moveFusen(_id, innerText, zahyo)
        }
    	
    });

}

function moveFusen(id,input,zahyo){
		
		ds.set(id, {
			'content' : input,
			'visibility':1,
			'x' : zahyo.left + 'px',
            'y' : zahyo.top + 'px'
		});

};

$(function(){

	// 読み込み時にデータストアに格納されているデータを描画する
	ds.stream().size(20).sort('desc').next(function(err,datas){
		 for(var i=0;i < datas.length;i++){
		redrawFusen(datas[i].id, datas[i].value.content,datas[i].value.x, datas[i].value.y);
		}
	});

	// データストアでpushイベントを検知したとき
	ds.on('push',function(pushed){
		redrawFusen(pushed.id, pushed.value.content, pushed.value.x,pushed.value.y)
	});

	// データストアでsetイベントを検知したとき
	ds.on('set', function(set){
		$('div#'+ set.id + '_fusen').css("left", set.value.x);
		$('div#'+ set.id + '_fusen').css("top" , set.value.y);
		$('div#'+ set.id + '_fusen').css("background-color", "#ffdd34");

		// イベントを有効な状態に戻す 
		$('div#'+ set.id + '_fusen').css("pointer-events", "auto");
		$('#backImage').remove();
	});

	ds.on('send', function(sent){
		// $('div#'+ sent.value.idName).css("background-color", "red");
		$('div#'+ sent.value.idName).css("background-color", "red");
		// イベントを無効化するcss(ロック)
		$('div#'+ sent.value.idName).css("pointer-events", "none");
	
		// 動かし中画像を表示
		var backImage = document.createElement('img');
		backImage.src = 'image/moving.png';
		backImage.id = 'backImage';
		$('div#'+ sent.value.idName).append($(backImage));

		
	});

	// 削除時に非表示にさせる
	ds.on('remove',function(removed){
		$('div#'+ removed.id + '_fusen').css("display","none"); 
		

	});

});

// キーボードショートカット
$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#createFusen').click();
			break;
		case 68: // Dのキーコード
			$('#removeFusen').click();
			break;
	}
});

$(function(){
	// ユーザーエージェントの設定
	if (navigator.userAgent.indexOf('iPhone') > 0){
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=0.5,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}else if(navigator.userAgent.indexOf('Android') > 0){
		
		$("head").append($('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.5,user-scalable=yes" />\n'));
	}
});

// スクリーンショット機能
$(document).on('click','#captureBtn', function(){

	var element = $('#canvas-wrap')[0];

    html2canvas(element, {onrendered:function(canvas) {

     	var imgData = canvas.toDataURL("image/png");

	// ダウンロードリンクの生成
      	var downloadLink = document.createElement("a");

      	getTime();

     	downloadLink.download = date + '_pbl2.png';
     	downloadLink.href = imgData;
     	downloadLink.click();

    }});

});


// 日付の取得
function getTime(){
  
	var toDoubleDigits = function(num) {
  	num += "";
  	if (num.length === 1) {
  	 	num = "0" + num;
  	}
 	return num;     
	};

	year = dd.getFullYear();
	month = toDoubleDigits(dd.getMonth() + 1);
	day = toDoubleDigits(dd.getDate());

	date = year + "" +  month + "" + day;

	return date;
}




