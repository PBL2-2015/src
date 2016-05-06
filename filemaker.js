var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var app = express();


var deploydir = './views/rooms/';
//var filename = '';
var str = '';
var maxcount = 10;
var roomID = 1;

(function make() {
  fs.readFile('./views/pages/index.ejs', 'utf8',function(err,data){

//    console.log(data);
    template = ejs.render(data,{ID:roomID});
  
    filename = deploydir + 'testRoom' + roomID ;

    fs.writeFile(filename+ '.html' , template);
//    roomID++;
    // if (count <= maxcount) make();
  });
})();


// 元サンプル
// ---------------------------------------------------------------------------------
// var fs  = require('fs');
// var ejs = require('ejs');

// var deploydir = './htdocs/';
// var filename  = '';
// var str       = '';
// var maxcount  = 500;
// var count     = 1;

// (function make(){
//   fs.readFile('./templates/template.ejs', 'utf8', function(err, data){
//     str_Y = ejs.render(data, {id:count, name:'Yahoo!' + count});
//     str_L = ejs.render(data, {id:count, name:'Line' + count});
//     filename = deploydir + count;
//     fs.writeFile(filename + '_Y.html', str_Y);
//     fs.writeFile(filename + '_L.html', str_L);
//     count++;
//     if (count <= maxcount) make();
//   });
// })();

// ---------------------------------------------------------------------------------