var cool = require('cool-ascii-faces')
var express = require('express');
var app = express();
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var url = require('url');
var request = require('request');

var agenda;

app.use(express.static(__dirname + '/public'));



// ExpressでPOSTを処理するメモ
// http://qiita.com/K_ichi/items/c70bf4b08467717460d5
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// views is directory for all template files
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {

  response.render('pages/index');

});

app.get("/*", function(request, response) {

//  roomID = false;
  reqURL = request.url;
  urlInfo = url.parse(reqURL,true);
  getParam = (urlInfo.pathname).substr(1); // スラッシュを削除
  
  // faviconによってIDが書き変えられるのを回避   
  if(getParam != 'favicon.ico'){
    roomID = getParam; 
  }

  // トップページに飛んだときにもこの部分が呼ばれて毎回エラーになる
  // ∵ roomIDは変わったにも関わらずmakeroomはまだ呼ばれていない
  // でも，部屋がもしあったらトップページに飛んだあとにすぐroomに飛ばされちゃう？？
  // roomが毎回UNIQUEな値を生成すれば問題ないが...
  // 
  // 
  response.render('rooms/' + roomID, {ID:roomID,Agenda:agenda});

});


app.post('/agenda', function(request,response) {

  agenda = request.body.Agenda;

  roomID = Math.floor(Math.random() * 400);


  makeRoom(roomID,agenda);
  //response.render('rooms/' + roomID, {ID:roomID,Agenda:agenda});

  response.send({roomID:roomID});
//  response.redirect('/roomID');
  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// filemaker

var deploydir = './views/rooms/';
//var filename = '';
var str = '';
var maxcount = 10;

function makeRoom(roomID,agenda) {

  var roomFile = fs.readFileSync('./views/pages/room.ejs','utf8');

  template = ejs.render(roomFile,{ID:roomID,Agenda:agenda});
  filename = deploydir + roomID ;

//  fs.writeFileSync(filename+ '.ejs' , template);
  fs.writeFileSync(filename+ '.ejs' , template);

  console.log('Generated.');
}


