
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

var flag = 1;
var intervalID;

// MilkCocoaオブジェクトのインスタンスを取得
var milkcocoa = new MilkCocoa('vueik3ipe4m.mlkcca.com');


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
	
function fusenDisplay(){

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
		fusenDisplay();
	}

}

function createFusen(id,input,pos_x,pos_y){

	// 連続入力がONのとき１，OFFのとき0を返す
	var checkCount = $(':radio[name="conInput"]:checked').length;

	// canvasの設定
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

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
	cross_element.style.top = 4 + 'px'; 
	cross_element.style.left = 125 + 'px';

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
				'x' : a ,
            	'y' : b 
			});
		}
	}
	
	// canvas-wrapの子要素（canvasの下の位置）にdivを挿入する
	$('#canvas-wrap').append($(element).append(cross_element));

	// 付箋をドラッグ可能にする
	$('.fusen').draggable({
		containment: '#canvas', // canvas内でのみドラッグ可能
		opacity: 0.3, // 移動中の透過率
	 	revert: false,// ドラッグ終了時に元の場所に戻さない
	 	scroll: false,
	 	drag : function(event){
		 		if(flag==1){
		 			flag=0;
		 			intervalID=setInterval(scroll_sc(event),7000);
		 		}
	 		},
	 	stop : function(event, ui){
	 		console.log('Dropped!!');
	 		flag=1;
	 		clearInterval(intervalID);
	 		//window.alert(window.innerWidth);

	 		// ドロップした付箋のposition(親要素からの座標)を取得
	 		zahyo = $(this).position();

			// uiにはhelperオブジェクトというものが渡され，dropした要素の情報が入っている
	 		// http://stacktrace.jp/jquery/ui/interaction/draggable.html
			
			// ドロップした付箋のidを取得 
			idName = ui.helper[0].id; // 付箋のid(◯◯_fusen)を取得
	 		innerText = ui.helper[0].firstChild.data; // 付箋のテキストを取得

			moveFusen(idName,innerText,zahyo);	
			
		 	} 
	});

};

function scroll_sc(event){
	
	document.addEventListener("touchmove",function(event){
		var touches = event.touches;
		var touch = touches[0];
		c_zahyoX=touch.clientX;
		c_zahyoY=touch.clientY;
		
		
		var dBody = document.body ;
		var nX = dBody.scrollLeft ;	// 現在位置のX座標
		var nY = dBody.scrollTop ;		// 現在位置のY座標

		
		if(c_zahyoX>window.innerWidth*0.9){
		window.scrollTo(nX+window.innerWidth*0.03,nY);
		}
		else if(c_zahyoX<window.innerWidth*0.05){
		window.scrollTo(nX-window.innerWidth*0.03,nY);
		}
		else if(c_zahyoY>window.window.innerHeight*0.9){
		window.scrollTo(nX,nY+window.window.innerHeight*0.03);
		}
		else if(c_zahyoY<window.innerHeight*0.05){
		window.scrollTo(nX,nY-window.window.innerHeight*0.03);
		}
		
	},false)
}

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
		}
	});

	// データストアでpushイベントを検知したとき
	ds.on('push',function(pushed){
		createFusen(pushed.id, pushed.value.content, pushed.value.x,pushed.value.y)
	});

	// データストアでsetイベントを検知したとき

	ds.on('set', function(set){
		
		vis = set.value.visibility;

		// visibleが変更されていたら削除，visibleが変わっていなかったら付箋移動
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