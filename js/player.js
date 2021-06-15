+(function () {
  class Musice {
    constructor(data) {
      let self = this;
      this._musice_data = (data && data.list) || [];
      this._audio = $('<audio height="0" width="0" src=""></audio> ');
      this._musice_name_box = $("#song_name");
      this._musice_singer_box = $("#goSinger span");
      this._musice_bg = $(".bg");
      this._musice_pic = $("#album_pic");

      this._musice_list = $("#musice_list");
      this._play = $("#play");
      this._play_prev_btn = $("#play_prev_btn");
      this._play_next_btn = $("#play_next_btn");
      this._speed_box = $("#progress");
      this._speed_bar = $("#play_on");
      this._speed_btn = $("#btn_pro");
      this._index = 0;
      this.startX = 0;
      this.startY = 0;

      this._in_play = false;

      $(".diyige").css("margin-left", $(window).width() / 2 - 10 + "px");

      this.add_html();
      this.add_event();
      this.musice_switch();
      this._speed_time = setInterval(function () {
        self.timing();
      }, 1);
    }
    timing() {
      let zs = this._js_audio.duration, //音频总时长
        present = $("#currentTime"), //当前时长位置
        jpProgress = $("#play_loading"), //缓冲条
        dq = this._js_audio.currentTime, //当前播放时间
        always = $("#totalTime"), //总时长位置
        m,
        s,
        dm,
        ds,
        jd,
        hc,
        buffer;
      m = parseInt(zs / 60);
      s = Math.floor(zs % 60);
      always.html(m + ":" + s);

      dm = parseInt(dq / 60);
      ds = Math.floor(dq % 60);
      present.html(dm + ":" + ds); //但前播放时间显示

      jd = (dq / zs) * 100;
      this._speed_bar.css("WebkitTransform", "translateX(" + jd + "%)"); //进度条

      buffer = this._js_audio.buffered; //缓冲帧
      hc = (buffer / zs) * 100;
      jpProgress.css("WebkitTransform", "translateX(" + hc + "%)"); //缓冲条
    }
    add_html() {
      $("body").append(this._audio);
      this._js_audio = this._audio[0];
      this._musice_list.html("");
      for (var i = 0; i < this._musice_data.length; i++) {
        let item = this._musice_data[i];
        this._musice_list.append(
          '<a href="javascript:void(0);"><li>' +
            item.name +
            " - <span>" +
            item.singer +
            "</span></li></a>"
        );
      }
    }
    // _add_event_listener(obj) {
    //   let self = this;
    //   obj.on("touchstart", function (evt) {
    //     self.touchSatrtFunc(evt);
    //   });
    //   obj.on("touchmove", function (evt) {
    //     self.touchMoveFunc(evt);
    //   });
    // }
    _speed_btn_add_touch() {
      let self = this;

      this._speed_btn.on("touchstart", function (evt) {
        try {
          self._speed_box_left = self._speed_box[0].offsetLeft + 4;
          clearInterval(self._speed_time);
        } catch (e) {
          //alert('touchSatrtFunc：' + e.message);
        }
      });
      this._speed_btn.on("touchmove", function (evt) {
        try {
          let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
            x = Number(touch.pageX), //页面触点X坐标
            y = Number(touch.pageY); //页面触点Y坐标

          self._modify_speed_length(x - self._speed_box_left);
        } catch (e) {
          // alert('touchMoveFunc：' + e.message);
        }
      });
      this._speed_btn.on("touchend", function (evt) {
        try {
          let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
            x = Number(touch.pageX), //页面触点X坐标
            y = Number(touch.pageY); //页面触点Y坐标

          self._modify_audio_length(x - self._speed_box_left); //修改音乐播放长度
          self._speed_time = setInterval(function () {
            self.timing();
          }, 1);
        } catch (e) {
          // alert('touchMoveFunc：' + e.message);
        }
      });
    }
    _modify_speed_length(startX) {
      let sw = this._speed_box.width(), //获取滚动条的宽度
        djwz = (startX / sw) * 100;

      this._speed_bar.css("-webkit-transform", "translateX(" + djwz + "%)"); //改变滚动条的宽度
    }
    _modify_audio_length(startX) {
      let sw = this._speed_box.width(), //获取滚动条的宽度
        djwz = startX / sw,
        audio_totle_time = this._js_audio.duration,
        djdsj = djwz * audio_totle_time;
      this._js_audio.currentTime = djdsj; //设置点击播放后跳转的位置
      if (this._in_play) {
        //正在播放的进行播放
        this._js_audio.play();
      }
    }
    add_event() {
      let self = this;
      $(".diyige a").click(function () {
        self.tag_switch($(this).index());
      });

      this._play.click(function () {
        if (!self._in_play) {
          self._set_play();
        } else {
          self._set_pause();
        }
      });

      this._play_prev_btn.click(function () {
        self._index =
          self._index == 0 ? self._musice_data.length - 1 : self._index - 1;
        self.musice_switch();
        self._set_play();
      });

      this._play_next_btn.click(function () {
        self._index =
          self._index == self._musice_data.length - 1 ? 0 : self._index + 1;
        self.musice_switch();
        self._set_play();
      });

      this._js_audio.addEventListener("ended", function () {
        //播放完自定下一首
        self._play_next_btn.click();
      });

      //点击列表
      this._musice_list.find("a").click(function () {
        self._index = $(this).index();
        self.musice_switch();
        self._set_play();
      });

      //进度条滑动
      this._speed_btn_add_touch();
    }
    _set_play() {
      this._in_play = true;
      this._play.removeClass("btn_play").addClass("btn_pause");
      this._musice_pic.css("-webkit-animation-play-state", "initial");
      this._js_audio.play(); //执行播放
    }
    _set_pause() {
      this._in_play = false;
      this._play.removeClass("btn_pause").addClass("btn_play");
      this._musice_pic.css("-webkit-animation-play-state", "paused");
      this._js_audio.pause(); //执行播放
    }
    
    tag_switch(index) {
      if (index == 0) {
        $(".zuobian").css({
          "-webkit-transform": "translate3d(0, 0px, 0px)",
          "z-index": "1",
        }); //移动
        $(".youbian").css({
          "-webkit-transform": "translate3d(100%, 0px, 0px)",
          "z-index": "0",
        }); //移动
      } else {
        $(".zuobian").css({
          "-webkit-transform": "translate3d(-100%, 0px, 0px)",
          "z-index": "0",
        }); //移动
        $(".youbian").css({
          "-webkit-transform": "translate3d(0, 0px, 0px)",
          "z-index": "1",
        }); //移动
      }
      $(".diyige a")
        .removeClass("kongzhi_2")
        .end()
        .eq(index)
        .addClass("kongzhi_2");
    }
    musice_switch() {
      let this_data = this._musice_data[this._index];
      if (this_data) {
        this._audio.attr("src", this_data["mp3"]);
        this._musice_name_box.html(this_data.name);
        this._musice_singer_box.html(this_data.singer);

        this._musice_bg.css("backgroundImage", "url(" + this_data["img"] + ")");
        this._musice_pic.attr("src", this_data["img"]);

        this._musice_list.find("a").removeClass("danqian");
        this._musice_list.find("a").eq(this._index).addClass("danqian");
      }
    }

    show_musice_lrc(lrc) {
      let self = this;
      //歌词同步
      if (!localStorage.time) {
        localStorage.time = 0;
      }

      this.shijianshuzu = []; //歌词时间
      let show_lrc_interval = null,
        gecishuzu = [], //歌词内容
        str = [];

      str = lrc.split("[");
      //因为str[0]="",所以跳过它
      for (var i = 1; i < str.length; i++) {
        //str[i]格式是00:11.22]我
        //shijian格式是00:11.22
        var shijian = str[i].split("]")[0];
        //geci格式是"我"
        var geci = str[i].split("]")[1];
        var fen = shijian.split(":")[0];
        var miao = shijian.split(":")[1];
        //xx:xx.xx 时间转换成总的秒数
        var sec = parseInt(fen) * 60 + parseInt(miao);
        //存时间
        this.shijianshuzu[i - 1] = sec - localStorage.time;
        //存歌词
        gecishuzu[i - 1] = geci;
      }
      //这段代码本来是用来显示所有歌词的，这里注释掉了，可以掠过不看
      var quanbugeci = document.getElementById("lyricDiv");
      quanbugeci.innerHTML = "";
      for (var i = 0; i < this.shijianshuzu.length; i++) {
        let gcp = document.createElement("p"), //创建p
          idname = "line_" + i;
        gcp.innerHTML = gecishuzu[i]; //加歌词
        gcp.setAttribute("id", idname); //加id名
        quanbugeci.appendChild(gcp); //插入到后面
      }
      //上面是用来显示所有歌词的，不用看
      //定时器，隔1s更新下歌词的显示
      if (show_lrc_interval) clearInterval(show_lrc_interval);
      show_lrc_interval = setInterval(function () {
        self.updategeci();
      }, 1000);
    }
    getcurrent() {
      //将歌曲实际播放的时间，和我们自己的歌词的时间，进行比较，算出现在应该显示的歌词
      let i = 0;
      //152,154存歌词和时间的时候
      //时间是由小到大的
      //当然实际的歌词不一定都是由小到大，还可能是两个时间重复的歌词就合并到一起，其他的情况都没做处理
      for (i = 0; i < this.shijianshuzu.length; i++) {
        //数和undefined比较，undefined要大些。
        if (this.shijianshuzu[i] >= this._js_audio.currentTime) {
          return i;
        }
      }
      return i - 1;
    }
    updategeci() {
      let quanbugeci = document.getElementById("lyricDiv"),
        allp = quanbugeci.getElementsByTagName("p"), //所有的歌词p
        i = this.getcurrent(), //从get函数中传过来的
        lyricDiv = $("#lyricDiv"),
        shijia = 0;

      if (allp.length < 2) {
        //不存在歌词
        lyricDiv.css("-webkit-transform", "translate3d(0px ,0px,0px)");
        return;
      }
      shijia = -(i - 1) * 24;
      for (let qt = 0; qt < allp.length; qt++) {
        allp[qt].className = "";
      }
      allp[i - 1].className = "current";

      lyricDiv.css(
        "-webkit-transform",
        "translate3d(0px ," + shijia + "px,0px)"
      );
      //-webkit-transform: translate3d(0px, 24px, 0px);
    }
  }

  window.Musice = Musice;
})();

// +(function () {
//   class Musice {
//     constructor(data) {
//       let self = this;
//       this._musice_data = (data && data.list) || [];
//       this._audio = $('<audio height="0" width="0" src=""></audio> ');
//       this._musice_name_box = $("#song_name");
//       this._musice_singer_box = $("#goSinger span");
//       this._musice_bg = $(".bg");
//       this._musice_pic = $("#album_pic");

//       // this._musice_list = $('#musice_list');
//       this._play = $("#play");
//       this._play_prev_btn = $("#play_prev_btn");
//       this._play_next_btn = $("#play_next_btn");
//       this._speed_box = $("#progress");
//       this._speed_bar = $("#play_on");
//       this._speed_btn = $("#btn_pro");
//       this._index = 0;
//       this.startX = 0;
//       this.startY = 0;

//       this._in_play = false;

//       $(".diyige").css("margin-left", $(window).width() / 2 - 10 + "px");

//       this.add_html();
//       this.add_event();
//       this.musice_switch();
//       this._speed_time = setInterval(function () {
//         self.timing();
//       }, 1);
//     }
//     timing() {
//       let zs = this._js_audio.duration, //音频总时长
//         present = $("#currentTime"), //当前时长位置
//         jpProgress = $("#play_loading"), //缓冲条
//         dq = this._js_audio.currentTime, //当前播放时间
//         always = $("#totalTime"), //总时长位置
//         m,
//         s,
//         dm,
//         ds,
//         jd,
//         hc,
//         buffer;
//       m = parseInt(zs / 60);
//       s = Math.floor(zs % 60);
//       always.html(m + ":" + s);

//       dm = parseInt(dq / 60);
//       ds = Math.floor(dq % 60);
//       present.html(dm + ":" + ds); //但前播放时间显示

//       jd = (dq / zs) * 100;
//       this._speed_bar.css("WebkitTransform", "translateX(" + jd + "%)"); //进度条

//       buffer = this._js_audio.buffered; //缓冲帧
//       hc = (buffer / zs) * 100;
//       jpProgress.css("WebkitTransform", "translateX(" + hc + "%)"); //缓冲条
//     }
//     add_html() {
//       this._js_audio = this._audio[0];
//     }
//     _add_event_listener(obj) {
//       let self = this;
//       obj.on("touchstart", function (evt) {
//         self.touchSatrtFunc(evt);
//       });
//       obj.on("touchmove", function (evt) {
//         self.touchMoveFunc(evt);
//       });
//     }
//     _speed_btn_add_touch() {
//       let self = this;

//       this._speed_btn.on("touchstart", function (evt) {
//         try {
//           self._speed_box_left = self._speed_box[0].offsetLeft + 4;
//           clearInterval(self._speed_time);
//         } catch (e) {
//           //alert('touchSatrtFunc：' + e.message);
//         }
//       });
//       this._speed_btn.on("touchmove", function (evt) {
//         try {
//           let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
//             x = Number(touch.pageX), //页面触点X坐标
//             y = Number(touch.pageY); //页面触点Y坐标

//           self._modify_speed_length(x - self._speed_box_left);
//         } catch (e) {
//           // alert('touchMoveFunc：' + e.message);
//         }
//       });
//       this._speed_btn.on("touchend", function (evt) {
//         try {
//           let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
//             x = Number(touch.pageX), //页面触点X坐标
//             y = Number(touch.pageY); //页面触点Y坐标

//           self._modify_audio_length(x - self._speed_box_left); //修改音乐播放长度
//           self._speed_time = setInterval(function () {
//             self.timing();
//           }, 1);
//         } catch (e) {
//           // alert('touchMoveFunc：' + e.message);
//         }
//       });
//     }
//     _modify_speed_length(startX) {
//       let sw = this._speed_box.width(), //获取滚动条的宽度
//         djwz = (startX / sw) * 100;

//       this._speed_bar.css("-webkit-transform", "translateX(" + djwz + "%)"); //改变滚动条的宽度
//     }
//     _modify_audio_length(startX) {
//       let sw = this._speed_box.width(), //获取滚动条的宽度
//         djwz = startX / sw,
//         audio_totle_time = this._js_audio.duration,
//         djdsj = djwz * audio_totle_time;
//       this._js_audio.currentTime = djdsj; //设置点击播放后跳转的位置
//       if (this._in_play) {
//         //正在播放的进行播放
//         this._js_audio.play();
//       }
//     }
//     add_event() {
//       let self = this;
//       $(".diyige a").click(function () {
//         self.tag_switch($(this).index());
//       });
//       //绑定事件 手势切换页面
//       this._add_event_listener($(".flex_box"));
//       this._add_event_listener($(".zuobian"));

//       this._play.click(function () {
//         if (!self._in_play) {
//           self._set_play();
//         } else {
//           self._set_pause();
//         }
//       });

//       this._play_prev_btn.click(function () {
//         self._index =
//           self._index == 0 ? self._musice_data.length - 1 : self._index - 1;
//           console.log(self._index)
//           window.localStorage.setItem("audioIndex",self._index);
//         self.musice_switch();
//         self._set_play();

//       });

//       this._play_next_btn.click(function () {
//         self._index =
//           self._index == self._musice_data.length - 1 ? 0 : self._index + 1;
//           console.log(self._index)
//           window.localStorage.setItem("audioIndex",self._index);
//         self.musice_switch();
//         self._set_play();

//       });

//       this._js_audio.addEventListener("ended", function () {
//         //播放完自定下一首
//         self._play_next_btn.click();
//       });

//       // y update
//       var _param = getUrlParam("id");
//       var _curIndex = parseInt(_param) - 1;
//       self._index = _curIndex;
//       self.musice_switch();

//       // 点击列表
//       // this._musice_list.find('a').click(function(){
//       //     self._index = $(this).index();
//       //     self.musice_switch();
//       //     self._set_play();
//       // });

//       //进度条滑动
//       this._speed_btn_add_touch();
//     }
//     _set_play() {
//       this._in_play = true;
//       this._play.removeClass("btn_play").addClass("btn_pause");
//       this._musice_pic.css("-webkit-animation-play-state", "initial");
//       this._js_audio.play(); //执行播放
//     }
//     _set_pause() {
//       this._in_play = false;
//       this._play.removeClass("btn_pause").addClass("btn_play");
//       this._musice_pic.css("-webkit-animation-play-state", "paused");
//       this._js_audio.pause(); //执行播放
//     }
//     touchSatrtFunc(evt) {
//       try {
//         //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
//         let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
//           x = Number(touch.pageX), //页面触点X坐标
//           y = Number(touch.pageY); //页面触点Y坐标
//         //记录触点初始位置
//         this.startX = x;
//         this.startY = y;
//       } catch (e) {
//         //alert('touchSatrtFunc：' + e.message);
//       }
//     }
//     touchMoveFunc(evt) {
//       try {
//         let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
//           x = Number(touch.pageX), //页面触点X坐标
//           y = Number(touch.pageY), //页面触点Y坐标
//           index = 0;

//         //var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
//         //判断滑动方向
//         if (y - this.startY < 12 && y - this.startY > -12) {
//           //上划不阻止滚动条
//           // evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
//         }

//         if (x - this.startX > 35) {
//           //左划
//           index = 0;
//         } else if (x - this.startX < -35) {
//           index = 1;
//         }
//         this.tag_switch(index);
//       } catch (e) {
//         // alert('touchMoveFunc：' + e.message);
//       }
//     }
//     tag_switch(index) {
//       if (index == 0) {
//         $(".zuobian").css({
//           "-webkit-transform": "translate3d(0, 0px, 0px)",
//           "z-index": "1",
//         }); //移动
//         $(".youbian").css({
//           "-webkit-transform": "translate3d(100%, 0px, 0px)",
//           "z-index": "0",
//         }); //移动
//       } else {
//         $(".zuobian").css({
//           "-webkit-transform": "translate3d(-100%, 0px, 0px)",
//           "z-index": "0",
//         }); //移动
//         $(".youbian").css({
//           "-webkit-transform": "translate3d(0, 0px, 0px)",
//           "z-index": "1",
//         }); //移动
//       }
//       $(".diyige a")
//         .removeClass("kongzhi_2")
//         .end()
//         .eq(index)
//         .addClass("kongzhi_2");
//     }
//     musice_switch() {
//       let this_data = this._musice_data[this._index];
//       if (this_data) {
//         this._audio.attr("src", this_data["mp3"]);
//         this._musice_name_box.html(this_data.name);
//         this._musice_singer_box.html(this_data.singer);

//         this._musice_bg.css("backgroundImage", "url(" + this_data["img"] + ")");
//         this._musice_pic.attr("src", this_data["img"]);

//         // this._musice_list.find('a').removeClass('danqian');
//         // this._musice_list.find('a').eq(this._index).addClass('danqian');
//         // this.get_music_lrc(this_data.lrc || '');
//       }
//     }
//     getcurrent() {
//       //将歌曲实际播放的时间，和我们自己的歌词的时间，进行比较，算出现在应该显示的歌词
//       let i = 0;
//       //152,154存歌词和时间的时候
//       //时间是由小到大的
//       //当然实际的歌词不一定都是由小到大，还可能是两个时间重复的歌词就合并到一起，其他的情况都没做处理
//       for (i = 0; i < this.shijianshuzu.length; i++) {
//         //数和undefined比较，undefined要大些。
//         if (this.shijianshuzu[i] >= this._js_audio.currentTime) {
//           return i;
//         }
//       }
//       return i - 1;
//     }
//     updategeci() {
//       let quanbugeci = document.getElementById("lyricDiv"),
//         allp = quanbugeci.getElementsByTagName("p"), //所有的歌词p
//         i = this.getcurrent(), //从get函数中传过来的
//         lyricDiv = $("#lyricDiv"),
//         shijia = 0;

//       if (allp.length < 2) {
//         //不存在歌词
//         lyricDiv.css("-webkit-transform", "translate3d(0px ,0px,0px)");
//         return;
//       }
//       shijia = -(i - 1) * 24;
//       for (let qt = 0; qt < allp.length; qt++) {
//         allp[qt].className = "";
//       }
//       allp[i - 1].className = "current";
//       lyricDiv.css(
//         "-webkit-transform",
//         "translate3d(0px ," + shijia + "px,0px)"
//       );
//     }
//   }

//   window.Musice = Musice;
// })();
