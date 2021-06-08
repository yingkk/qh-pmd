$(function () {
    var _index = 0;
    //main init
    $(".main div[class*=tab-]").hide();
    $(".main .tab-"+_index).show();
    //tab init
    $(".tab .tab-item").eq(0).find("img").eq(0).attr("src", "../imgs/tab-1-active.png")
    $(".tab .tab-item").eq(0).addClass("active");
   
  $(".tab .tab-item").click(function () {
    const _defaultSrc = $(".tab .active").find("img").eq(0).attr("data-default-src");
    $(".tab .active").find("img").eq(0).attr("src", _defaultSrc);
    $(".tab .tab-item").removeClass("active");
    _index = $(this).index();
    const _activeSrc = "../imgs/tab-" + (_index + 1) + "-active.png";
    $(this).find("img").eq(0).attr("src", _activeSrc);
    $(this).addClass("active");
    $(".main div[class*=tab-]").hide();
    $(".main .tab-" + _index).show();
  });
});
