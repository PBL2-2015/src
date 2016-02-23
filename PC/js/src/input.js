


// ユーザーエージェントの設定
// レイアウト https://blogs.adobe.com/creativestation/web-design-with-css-flexbox-menu

var ua = navigator.userAgent;

if (ua.indexOf('iPhone') > 0){		
	$("head").append($('<meta name="viewport" content="width=980px,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.2,user-scalable=yes" />\n'));		
}else if(ua.indexOf('Android') > 0){
	$("head").append($('<meta name="viewport" content="width=980px,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.2,user-scalable=yes" />\n'));
}

if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) || ua.indexOf('Windows Phone') > 0) {
	document.write('<link rel="stylesheet" type="text/css" href="css/mobile.css">');
}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
	document.write('<link rel="stylesheet" type="text/css" href="css/tab.css">');
	}else{
	document.write('<link rel="stylesheet" type="text/css" href="css/pc.css">');
}

// milkcocoaリファレンス
// https://mlkcca.com/document/api-js.html

// 乱数生成
// https://syncer.jp/javascript-reverse-reference/create-random-number

// 1から4の乱数を生成
var rand = Math.floor( Math.random() * 4) + 1;
// 0から490の乱数を作成
var rand2 = Math.floor(Math.random() * 400);
// 491から700の乱数を作成
var rand3 = Math.floor(Math.random() * 210) + 500;


switch(rand){
	case 1:
		console.log("エリア1");
		init_pos_x = rand2 + 'px';
		init_pos_y = rand2 + 'px';
		break;
	case 2:
		console.log("エリア2");
		init_pos_x = rand2 + "px";
		init_pos_y = rand3 + "px";
		break;
	case 3:
		console.log("エリア3");
		init_pos_x = rand3 + "px";
		init_pos_y = rand2 + "px";
		break;
	case 4:
		console.log("エリア4");
		init_pos_x = rand3 + "px";
		init_pos_y = rand3 + "px";
		break;
}


// var init_pos_x = 20 + 'px';
// var init_pos_y = 20 + 'px';

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

	pos_x = parseInt(pos_x) + 80 + 'px';

	// 次の列へ移動する
	if(parseInt(pos_x) >= 800){
		pos_x = init_pos_x;
		pos_y = parseInt(pos_y) + 20 + 'px';
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

// iPhone/iPadでダブルタップをJavaScriptで実装する
// http://blog.webcreativepark.net/2010/08/16-110311.html
// 座標について
// http://d.hatena.ne.jp/sandai/20100518/p1
// http://qiita.com/i47_rozary/items/6134b66921299a2e5806

function canvasTap(e){

	var pos_x = pos_y = 0;
    pos_x = e.pageX;
    pos_y = e.pageY;
 
 	console.log(pos_x,pos_y);

	// $('canvas').data("dblTap",false).click(function(){
	if($(this).data("dblTap")){
		//ダブルタップ時の命令

		$(this).data("dblTap",false);
	}else{
		$(this).data("dblTap",true);
	}

	setTimeout(function(){
		$('canvas').data("dblTap",false);
	},300);
	// });
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
		$('div#'+ set.id + '_fusen').css({
			'text-indent':'',
			'white-space':'',
			'overflow':'',
			'pointer-events':'auto',// イベントを無効化するcss(ロック)
			'background-color':''
		});


		// $('#backImage').remove();
	
	});

	ds.on('send', function(sent){
	
		// 文字を非表示にする
		// http://ss-complex.com/2013/12/css-cleartext/

		$('div#'+ sent.value.idName).css({
			// 'text-indent':'100%',
			// 'white-space':'nowrap',
			// 'overflow':'hidden',
			'pointer-events':'none',// イベントを無効化するcss(ロック)
			'background-color':'red',
		});

		// 動かし中画像を表示

		// var backImage = document.createElement('img');
		// backImage.src = 'image/moving.png';
		// backImage.id = 'backImage';
		// $('div#'+ sent.value.idName).append($(backImage));



	});

	// 削除時に非表示にさせる
	ds.on('remove',function(removed){
		$('div#'+ removed.id + '_fusen').css("display","none");
		console.log('非表示にしたよ!');
	});



	// canvasをタッチ(スマホ)orクリック(PC)されたときに，canvasTap関数を呼び出す

	// canvas.addEventListener('touchstart', canvasTap, false);
	// canvas.addEventListener('click', canvasTap, false);

	
});

// キーボードショートカット
$(document).keydown(function(e){
	switch(e.keyCode){
		case 65: // Aのキーコード
			$('#createFusen').click();
			break;
		// case 68: // Dのキーコード
		// 	$('#removeFusen').click();
		// 	break;
	}
});

// スクリーンショット機能
$(document).on('click','#captureBtn, #captureBtnSp', function(){

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

// PBL2ではリサイズは対象外

// $(window).load(function(){
//   container = $('#canvas-wrap');
//   canvas = $('canvas');

//   test = window.innerWidth;

//   console.log(test);

//   function resizeCanvas(e){
  	
//     canvas.outerWidth(container.width());
//     canvas.outerHeight(container.width() * 1.2);  //1.0は適宜変更
  
//   }

//   resizeCanvas();

//   $(window).on('resize', resizeCanvas());

// });

// $(window).load(function(){
//   container = $('#canvas-wrap');
//   canvas = $('canvas');

//   test = window.innerWidth;

//   console.log(test);

// //   function resizeCanvas(e){
  	
// //     canvas.outerWidth(container.width());
// //     canvas.outerHeight(container.width() * 1.2);  //1.0は適宜変更
  
//   // }

// //   resizeCanvas();

// //   $(window).on('resize', resizeCanvas());

// });

	

