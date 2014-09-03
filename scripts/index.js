$(function(){
    document.ontouchmove = function(e){ e.preventDefault();}
    // var pageHeight = $(".js-page").eq(0).height();
    // var pageHeight = $(window).height();
    var pageNum = 1;
    var pageCount = $('section').size();
    var $btnNext = $("#btn-next");
    var scrollTo = function(num){
        if(num < 1 || num > pageCount){
            return;
        }
        pageNum = num;
        if(pageNum >= pageCount){
            $btnNext.hide();
        }else{
            $btnNext.show();
        }
        var scrollHeight = -((pageNum - 1) * $(window).height());
         $("article").css({
                "-webkit-transform": "translateY("+ scrollHeight +"px)",
                "-webkit-transition":"all .5s ease"
            });
        $(".js-page").removeClass('play').eq(pageNum-1).addClass("play");
    }
    var scrollToNext = function(){
        scrollTo(pageNum+1);
    }
    var scrollToPre = function(){
        scrollTo(pageNum-1);
    }
    $.each($('.js-page'), function(i,item){
        $(this).css('top',i*100 + '%');
        $(this).show();
    });
    $btnNext.tap(function(){
        scrollToNext();
    });
    $(document).swipeUp(function(){
        scrollToNext();
    });
    $(document).swipeDown(function(){
        scrollToPre();
    });
    scrollTo(1);

});