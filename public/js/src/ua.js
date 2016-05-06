  // ユーザーエージェントを判定してCSSを適用
// レイアウト https://blogs.adobe.com/creativestation/web-design-with-css-flexbox-menu
  var ua = navigator.userAgent;
  var device;
  
  if (ua.indexOf('iPhone') > 0){    
    $("head").append($('<meta name="viewport" content="width=980px,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.2,user-scalable=yes" />\n'));    
  }else if(ua.indexOf('Android') > 0){
    $("head").append($('<meta name="viewport" content="width=980px,initial-scale=1.0,minimum-scale=0.2,maximum-scale=1.2,user-scalable=yes" />\n'));
  }
  
  if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0) && (ua.indexOf('Mobile') > 0) || ua.indexOf('Windows Phone') > 0) {
    device = 'mobile';
    document.write('<link rel="stylesheet" type="text/css" href="/css/mobile.css">');
  }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
    device = 'tablet';
    document.write('<link rel="stylesheet" type="text/css" href="/css/tab.css">');
    }else{
    device = 'pc';  
    document.write('<link rel="stylesheet" type="text/css" href="/css/pc.css">');
  }

