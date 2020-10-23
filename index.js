var container = document.getElementById('container');

function initUI(){
    var keys = Object.keys(MIDISound);
    // 白键的宽度 = 页面总宽度/白键数
    var whiteWidth = container.clientWidth/52;
    // 黑键的宽度 = 白键宽度的3/5
    var blackWidth = (whiteWidth*3)/5;

    var beforeWhiteNumber = 0;
    for(var i = 0; i < keys.length; i++){
        var key = keys[i];
        var div = document.createElement('div');
        div.classList.add('item');//添加样式
        if(key.length === 2){
            // 白键
            div.classList.add('white');
            div.style.width = whiteWidth + 'px';
            //白键的坐标 = 白键之前的数量*白键的宽度
            var left = beforeWhiteNumber*whiteWidth;
            div.style.left = left + 'px';
            beforeWhiteNumber++;
            // 黑键
        }else{
            div.classList.add('black');
            div.style.width = blackWidth + 'px';
            // 黑键的坐标 = 前面白键的数量*白键的宽度 - 黑键的宽度的一半
            var left = beforeWhiteNumber*whiteWidth - blackWidth/2;
            div.style.left = left + 'px';
        }
        div.setAttribute("key",key);
        div.innerHTML = "<span>"+ key + "</span>";
        container.appendChild(div);
        //调用绑定函数
        bindEvent(div);

    }
}

initUI();

function createAudio(key){
    var aud = new Audio(MIDISound[key]);
    var timer = null;//停止时，音量逐渐减少的计时器
    var div = document.querySelector('div[key='+key+"]");//选中自定义属性key等于某个值的div
    return{
        play:function(){
            clearInterval(timer);//停止之前的音量
            aud.currentTime = 0;//把播放进度归零
            aud.volume = 1;//音量最大
            aud.play();
            div.classList.add('active');

        },
        stop:function(){
            timer = setInterval(function(){
                var v = aud.volume - 0.02;//获取当前音量
                if(v <= 0){
                    aud.pause();//停止播放
                    clearInterval(timer);//停止计时了
                }
            },15);
            div.classList.remove('active');
        }
    }
}

var aud = {};

//初始化所有的音频
function initAudio(){
    for(var key in MIDISound){
        aud[key] = createAudio(key);
    }
}

initAudio();

// 给div绑定事件
function bindEvent(div) {
    div.onmousedown = function () {
      var key = div.getAttribute("key"); // 拿到自定义属性key
      aud[key].play();
    };
    div.onmouseup = function () {
      var key = div.getAttribute("key"); // 拿到自定义属性key
      aud[key].stop();
    };
    div.onmouseenter = function () {
      if (isDown) {
        // 只有鼠标按下时，才会播放
        var key = div.getAttribute("key"); // 拿到自定义属性key
        aud[key].play();
      }
    };
    div.onmouseleave = function () {
      var key = div.getAttribute("key"); // 拿到自定义属性key
      aud[key].stop();
    };
  }
  

document.documentElement.onselectstart = function(){
    return false;
}


// 选择网页文字
document.documentElement.onselectstart = function () {
    return false;
  };
  var isDown = false; // 鼠标是否按下
  window.onmousedown = function () {
    isDown = true;
  };
  window.onmouseup = function () {
    isDown = false;
  };