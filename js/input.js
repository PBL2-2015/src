

// e=document.createElement('div');
// e.setAttribute('id', 'HORIKITA_MAKI_TXT'); /* あとで除去するのに利用する"目印" */
// e.style.position='absolute';
// e.style.top='120px';
// e.style.left='60px';
// e.style.width='200px';
// e.style.height='20px';
// e.style.background='transparent';
// e.style.color='#fff';
// e.style.textAlign='center';
// e.style.font='normal normal 20px/32px sans-serif';
// parentOfTheCanvas.appendChild(e);
// e.innerHTML='堀北真希ちゃん';

// ------

var i=1; //idインクリメント

function fusen_display(){

	var input = window.prompt("アイデアを入力してください");

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	// ctx.save();  // おまじない

	// ctx.font = "40px meiryo";
	// ctx.fillText(input, 50, 30);

	$('#canvas-wrap').append('<div id='+ i + ' class="fusen" draggable="true">'+ input + '</div>');

	// var element = document.createElement('div');
	// element.id = i;
	// element.className = 'fusen';
	// element.innerHTML = input;

	// parent_of_the_canvas.appendChild(element);

	i = i + 1;

   // ctx.restore();  // おまじない

}