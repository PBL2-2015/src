
// var init_pos_x = 20 + 'px';
// var init_pos_y = 20 + 'px';
var pos_x,pos_y,init_pos_x,init_pos_y;

var dd = new Date();
var flag = 1;	//スクロールのためのフラグ
var intervalID;	//同上


var milkcocoa = new MilkCocoa('yieldijtvk6yv.mlkcca.com');	// MilkCocoaオブジェクトのインスタンスを取得
var ds = milkcocoa.dataStore('fusen/message');	// データストアの作成
var ds_canvas = milkcocoa.dataStore('canvas');
// ページ描画時に実行

$(function(){

	var canvasWidth = 1200;
	var canvasHeight = 1200;

	// 初期位置を決める乱数生成
	makeRand();

	pos_x = init_pos_x;
	pos_y = init_pos_y;

	// 読み込み時にデータストアに格納されているデータを描画する
	ds.stream().size(999).sort('desc').next(function(err,datas){
		for(var i=0;i < datas.length;i++){

			if(datas[i].value.roomID === roomID){
				redrawFusen(datas[i].id, datas[i].value.content,datas[i].value.x, datas[i].value.y); 
			}
		}
	});

	// データストアでpushイベント(データの新規作成)を検知したとき
	ds.on('push',function(pushed){
		
		if(pushed.value.roomID === roomID){
			redrawFusen(pushed.id, pushed.value.content, pushed.value.x,pushed.value.y)
		}

	});

	// データストアでsetイベント(データの書き換え)を検知したとき
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


	// シングルタップ，ダブルタップ，スクロールの判別
	// touchend時にtouchかmoveかを判定することでtouchとmoveの競合を解消
	// http://pro-tyablog.blogspot.jp/2013/09/javascript.html
	canvas.addEventListener('touchstart,touchmove, touchend',function (event) {
		if (event.type == 'touchstart'){
			$(this).attr('data-touchstarted', '');
			return;
		}

		if(event.type == 'touchmove'){
			scroll_sc(event); // touchmove時の関数
			$(this).removeAttr('data-touchstarted'); //moveと判断したら，touchフラグを削除
			return;
		}

		// touchend時にフラグがあれば，タップと判定
		if('undefined' != typeof $(this).attr('data-touchstarted')) {
			canvasTap(event); //touchstartの関数
			$(this).removeAttr('data-touchstarted'); //フラグの削除
		}
	});

	// クリック時の関数
	canvas.addEventListener('click', canvasClick, false);

	
});

function groupFusen(){

	canvas.removeEventListener('click', canvasClick,false);

	var fusenClass = document.getElementsByClassName('fusen')	;



lockScreen("lock");
selecting();

	function selecting(){
		for (var i = 0; i < fusenClass.length; i++) {
			fusenClass[i].addEventListener('click', function() {

				var classes = $(this).attr('class');
			// 半角で区切られた複数のclassを分離し配列にする
			var classArray = classes.split(' '); 

			if(classArray[0] == 'fusen'){
				$(this).removeClass('fusen');
				$(this).addClass('fusen-selected');
			}else if(classArray[2] == 'fusen-selected'){
				$(this).removeClass('fusen-selected');
				$(this).addClass('fusen');
			}

		},false);
		}

	}

	




	function lockScreen(id) {
 
        // 現在画面を覆い隠すためのDIVタグを作成する
        // attr: 属性値の取得，変更に仕様
        // 引数1つで属性値の取得．引数2つで属性値の変更
        var divTag = $('<div />').attr("id", id);
        
        //スタイルを設定

        divTag.css({
        	'z-index': '200',
        	'position': 'absolute',
        	'top': '0px',
        	'left': '0px',
        	'right': '0px',
        	'bottom': '0px',
        	'background-color': 'gray',
        	'text-align': 'center',
        	'line-height': '100px',
        	'opacity': '0.9'
        });

        // BODYタグに作成したDIVタグを追加
        $('header').append(divTag);

 				var divElement = document.getElementById(id);
 				divElement.innerHTML = '<span style="background-color:#ffffff; font-size:18pt;">グループ化する付箋を選んで下さい</span>';

        $('#canvas').css('z-index', '300');
        $('.fusen').css('z-index', '400');
        $('.cross').css('z-index', '500');
        $('#test_group').css('z-index', '600');

  }	



}

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

		ds.stream().size(999).sort('desc').next(function(err,datas){

		for(var i=0;i < datas.length;i++){
			ds.remove(datas[i].id);
		}

		});

	}
}



// 付箋の新規作成
function createFusen(roomID,pos_x,pos_y){

	canvasWidth = $('#canvas').innerWidth();
	canvasHeight = $('#canvas').innerWidth();

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
            'x' : pos_x + 'px',
            'y' : pos_y+ 'px',
            'roomID' : roomID
  });

//	pos_x = parseInt(pos_x) + 80 + 'px';

		console.log('pos_x = ' + pos_x);
		console.log('pos_y = ' + pos_y);

		// canvasサイズを超える位置に付箋を置いた場合にcanvasを拡張する
		if(pos_x >= canvasWidth * 0.85) { //現状の付箋幅がcanvas幅の約13%
			console.log('over!!');
			$('#canvas-wrap').width(canvasWidth*1.1);
			$('#canvas').width(canvasWidth*1.1);
		}

		if(pos_y >= canvasHeight * 0.87) { //現状の付箋幅がcanvas幅の約13%
			console.log('over!!');
			$('#canvas-wrap').width(canvasHeight*1.1);
			$('#canvas').width(canvasHeight*1.1);
		}

		ds_canvas.push({
			canvasWidth: canvasWidth,  	
			canvasHeight: canvasHeight
  	});




	// 次の列へ移動する
	if(parseInt(pos_x) >= 800){
		pos_x = init_pos_x;
		pos_y = parseInt(pos_y) + 20 + 'px';
	}

	// 連続入力がONの時に入力を繰り返す
	if(checkCount == 1){
		pos_x = pos_x + 20;
		createFusen(roomID,pos_x,pos_y);
//		pos_y = pos_y + 20;
	}

}

// 読み込み時の再描画関数
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

	// 付箋のドラッグに関する設定部分
	// http://stacktrace.jp/jquery/ui/interaction/draggable.html

	$('.group').draggable();

	$(".fusen").draggable({

  	containment: "#canvas",
    // opacity: 0.3,
    revert: false,
        
    // ドラッグ開始時
    start: function(event, ui){
      idName = ui.helper[0].id; // ◯◯ + _fusen の文字列
			_id = idName.substring(0, idName.indexOf("_") ); //_fusenを取り除いた文字列
      innerText = ui.helper[0].firstChild.data;
      ds.send({
      	'content': innerText,
      	'idName': idName,
      	'message':'moving'
      });
    },
    drag : function(event){
		 	if(flag==1){
		 		flag=0;
		 		intervalID=setInterval(scroll_sc(event),7000);
		 	}
	 	},
    stop: function(event, ui) {
    	idName = ui.helper[0].id; // ◯◯ + _fusen の文字列
			_id = idName.substring(0, idName.indexOf("_") ); //_fusenを取り除いた文字列
      zahyo = $(this).position();
      innerText = ui.helper[0].firstChild.data;
      moveFusen(_id, innerText, zahyo);
    
    }
    	
  });

}


function scroll_sc(event){
	
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
		
		document.getElementById('touchState').textContent = 'moving';

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
// https://syncer.jp/javascript-reverse-reference/get-touch-position
function canvasTap(event){

	document.getElementById('touchState').textContent = 'Tap';


	var touchObj = event.changedTouches[0];
	var touchX = touchObj.pageX;
	var touchY = touchObj.pageY;

	var rect = document.getElementById('canvas-wrap').getBoundingClientRect();

	var positionX = rect.left + window.pageXOffset;
	var positionY = rect.left + window.pageYOffset;

	var offsetX = (touchX - positionX) ;
	var offsetY = touchY - positionY;

	createFusen(roomID,offsetX,offsetY);

	// var pos_x = pos_y = 0;
 //    pos_x = event.pageX;
 //    pos_y = event.pageY;
 
 	// console.log(touchX,touchY);

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

function canvasClick(event){

	var mouseX = event.pageX;
	var mouseY = event.pageY;

	// canvas-wrap要素の位置を取得
	var rect = document.getElementById('canvas-wrap').getBoundingClientRect();

	// 要素の位置座標を計算（スクロール時に値が変化する分を相殺している）
	var positionX = rect.left + window.pageXOffset ;	// 要素のX座標
	var positionY = rect.top + window.pageYOffset ;	// 要素のY座標


	// 要素の左上からの距離を計算
	var offsetX = mouseX - positionX ; //これをpos_xにする
	var offsetY = mouseY - positionY ; //これをpos_yにする

	// pタグ内にテキストの追加
	document.getElementById('touchData').textContent = 'X: ' + offsetX + ', Y: ' + offsetY;

	createFusen(roomID,offsetX,offsetY);


	// var pos_x = pos_y = 0;

	$('canvas').data("dblTap",false).click(function(){
		if($(this).data("dblTap")){
		//ダブルタップ時の命令

		$(this).data("dblTap",false);
	}else{
		$(this).data("dblTap",true);
	}

	setTimeout(function(){
		$('canvas').data("dblTap",false);
	},300);
	
	});


};

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




// milkcocoaリファレンス
// https://mlkcca.com/document/api-js.html


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


function makeRand() {

	// 乱数生成
	// https://syncer.jp/javascript-reverse-reference/create-random-number
	
	// 1から4の乱数を生成
	var rand = Math.floor( Math.random() * 4) + 1;
	// 0から490の乱数を作成
	var rand2 = Math.floor(Math.random() * 400);
	// 491から700の乱数を作成
	var rand3 = Math.floor(Math.random() * 210) + 500;

	var areaImage = document.createElement('img');
	areaImage.width = 180;
	areaImage.height = 100;
	var areaCaption = document.createElement('figcaption');
	areaCaption.innerHTML = "付箋の作成位置";

	switch(rand){
		case 1:
			console.log("エリア1");
			init_pos_x = rand2 + 'px';
			init_pos_y = rand2 + 'px';
	    areaImage.src = 'image/createArea/create1.png';
	    areaImage.id = 'areaImage';
	    $('figure#createArea').append($(areaImage));
	    $('figure#createArea').append($(areaCaption));
			break;
		case 2:
			console.log("エリア2");
			init_pos_x = rand2 + "px";
			init_pos_y = rand3 + "px";
   		areaImage.src = 'image/createArea/create2.png';
   		areaImage.id = 'areaImage';
   		$('figure#createArea').append($(areaImage));
   		$('figure#createArea').append($(areaCaption));
			break;
		case 3:
			console.log("エリア3");
			init_pos_x = rand3 + "px";
			init_pos_y = rand2 + "px";
	    areaImage.src = 'image/createArea/create3.png';
	    areaImage.id = 'areaImage';
	    $('figure#createArea').append($(areaImage));
	    $('figure#createArea').append($(areaCaption));
			break;
		case 4:
			console.log("エリア4");
			init_pos_x = rand3 + "px";
			init_pos_y = rand3 + "px";
  	  areaImage.src = 'image/createArea/create4.png';
  	  areaImage.id = 'areaImage';
  	  $('figure#createArea').append($(areaImage));
  	  $('figure#createArea').append($(areaCaption));
			break;
	}




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

	