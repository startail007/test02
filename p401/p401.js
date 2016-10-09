function getSlideIndex() {
    var url = location.hash;
    var str = "";
    if (url.indexOf("#") != -1) {
        str = url.substr(1);
    }
    var index = 0;
    switch (str) {
        case '0':
            index = 0;
            break;
        case '1':
            index = 1;
            break;
        case '2':
            index = 2;
            break;
        case '3':
            index = 3;
            break;
        case '4':
            index = 4;
            break;
        case '5':
            index = 5;
            break;
    }
    return index;
}
(function() {
    $(document).ready(function() {
        var myText01 = ['標準', '標準', '標準', '標準', '標準', '標準'];
        var Buttons01 = $('#Buttons01 > ul > li > a');
        Buttons01.each(function(index, element) {
            $(element).html(myText01[index])
        })
        var mySwiper = new Swiper('#SlideFrame01', {
            onInit: change01,
            onSlideChangeStart: change01
        });
        //mySwiper.lockSwipes()鎖住不滑動
        //mySwiper.unlockSwipes()
        function change01(swiper) {
            var index = swiper.activeIndex;
            $('div#Buttons01 > ul > li').removeClass('active');
            $($('div#Buttons01 > ul > li')[index]).addClass('active');
            $('div#ControlText01')[0].innerHTML = myText01[index];
        }

        Buttons01.on("click", function(e) {
            var index = Buttons01.index(this);
            mySwiper.slideTo(index, 600);
            window.location = location.pathname + "#" + index;
        })
        mySwiper.slideTo(getSlideIndex(), 0);

        var Frames01 = [];
        var MapImages01 = [];
        var CaiMaps01 = []

        var Maps01 = $(".Map01");
        Maps01.each(function(index, element) {
            Frames01[index] = element;
            MapImages01[index] = element.querySelector('.MapImage');
            CaiMaps01[index] = new CaiMap(Frames01[index], MapImages01[index], "Contain");
            ZoomInit(CaiMaps01[index]);
            //console.log($(element.parentElement).offset())
        })
        //console.log(Frames01,MapImages01)

        /*var Frame01 = document.getElementById('MainMapRF');
        var Map01 = Frame01.querySelector('.MapImage');
        var myScroll = new CaiMap(Frame01, Map01, "Contain");*/


        //ZoomInit(myScroll);
        window.onresize = onresize;

        function onresize(e) {
            CaiMaps01.forEach(function(element, index) {
                var temp = ResizeLockRect(element);
                ZoomInit(element);
            });
        }


        $('.fancybox-thumbs').fancybox({
            autoCenter: true,
            autoScale: true,
            autoHeight: true,
            autoWidth: true,
            padding: 30,
            margin: 30,
            openEffect: 'elastic',
            openSpeed: 150,
            closeEffect: 'elastic',
            closeSpeed: 150,
            prevEffect: 'elastic',
            prevSpeed: 150,
            nextEffect: 'elastic',
            nextSpeed: 150,
            closeClick: false,
            arrows: false,
            helpers: {
                title: {
                    type: 'float'
                },
                overlay: {
                    css: {
                        background: 'rgba(0, 0, 0, 0.85)',
                        overflow: 'hidden'
                    }
                },
                thumbs: {
                    width: 50,
                    height: 50

                },
            },
            afterLoad: function() {
                /*$('.fancybox-inner').addClass('Vignette');*/
                //$('.fancybox-skin').css('background-color', 'transparent');
                /*$('.fancybox-wrap').css('width', 'auto');
                $('.fancybox-inner').css('margin-right', '80px');
                $('.fancybox-inner').css('margin-left', '80px');*/
                /*$('.fancybox-inner').css('margin-top', '20px');
                $('.fancybox-inner').css('margin-bottom', '80px');*/
                /*$('.fancybox-inner').css('padding', '20px');
                $.fancybox.update();*/
            },
            onUpdate: function() {
                $('#fancybox-thumbs').addClass('fancybox-thumbs-css');
            }

        });
        /*var mySwiper
        var Index = 0;
        var myScroll = [];
        var myMap01 = [];
        var myMapC01 = [];
        var myText01 = ['標準', '標準', '標準', '標準', '標準', '標準'];
        //MenuInit();
        $("#Buttons01 > ul > li > a").each(function(index,element){
            //console.log(element)
            $(element).html(myText01[index])
        })
        myMapC01 = [$("div#MainMapRF"), $("div#MainMap314F"), $("div#MainMap1VF"), $("div#MainMap1F"), $("div#MainMapB1F"), $("div#MainMapB2F")];
        for (var i = 0; i < myMapC01.length; i++) {
            myMap01[i] = myMapC01[i].find("> .MapImage");
        }

        function AddmySwiper() {
            if (!mySwiper) {
                mySwiper = new Swiper('#SlideFrame01', {
                    onSlideChangeStart: function (swiper) {
                        Index = mySwiper.activeIndex;
                        $('div#Buttons01 > ul > li').removeClass('active');
                        $($('div#Buttons01 > ul > li')[Index]).addClass('active');
                        $('div#ControlText01')[0].innerHTML = myText01[Index];
                    }
                });
                SetSwiperIndex(Index, 0);
            }
        }
        //建立板塊滑動套件

        function RemovemySwiper() {
            if (mySwiper) {
                mySwiper.destroy();
                mySwiper = undefined;
            }
        }
        //移除板塊滑動套件

        $('div#Buttons01 > ul > li > a').click(
            function (e) {
                var temp = $('div#Buttons01 > ul > li > a');
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] == this) {
                        SetSwiperIndex(i, 600);
                    }
                }
            }
        );
        //樓層按鈕按下

        for (i = 0; i < myMapC01.length; i++) {
            Fun01(i);
        }
        //縮放套件建立


        function Fun01(pIndex) {
            var Frame01 = myMapC01[pIndex];
            var Map01 = myMap01[pIndex];
            myScroll[pIndex] = CreateIScroll(Frame01, Map01);
            myMapC01[pIndex][0].addEventListener('touchmove', function (e) {
                if (myScroll[pIndex].Prop.scale > myScroll[pIndex].Prop.ZoomMin) {
                    e.preventDefault();
                }
            }, false);
            myMapC01[pIndex][0].addEventListener('touchstart', MD, false);
            myMapC01[pIndex].mousedown(MD);
            myMapC01[pIndex][0].addEventListener('touchend', MU, false);
            myMapC01[pIndex].mouseup(MU);

            function MD(e) {
                if (myScroll[pIndex].Prop.scale > myScroll[pIndex].Prop.ZoomMin) {
                    RemovemySwiper();
                }
            }

            function MU(e) {
                AddmySwiper();
            }
        }
        //縮放套件建立方法

        AddmySwiper();
        SetSwiperIndex(3, 0);
        $('div#Buttons01 > ul > li').removeClass('active');
        $($('div#Buttons01 > ul > li')[Index]).addClass('active');
        //滑動板塊初始化建立

        function SetSwiperIndex(pIndex, pTime) {
            if (Index != pIndex) {
                for (var i = 0; i < myMapC01.length; i++) {
                    ZoomInit(myScroll[i], myMapC01[i], myMap01[i]);
                }
                Index = pIndex;
            }
            mySwiper.slideTo(Index, pTime);
        }
        //設定滑動板塊位置

        $('.fancybox-thumbs').fancybox({
            autoCenter: true,
            autoScale: true,
            autoHeight: true,
            autoWidth: true,
            padding: 0,
            openEffect: 'elastic',
            openSpeed: 150,
            closeEffect: 'elastic',
            closeSpeed: 150,
            prevEffect: 'elastic',
            prevSpeed: 150,
            nextEffect: 'elastic',
            nextSpeed: 150,
            closeClick: true,
            arrows: false,
            helpers: {
                title: {
                    type: 'float'
                },
                overlay: {
                    css: {
                        background: 'rgba(33, 55, 70, 0.85)',
                        overflow: 'hidden'
                    }
                },
                thumbs: {
                    width: 50,
                    height: 50

                },
            },
            afterLoad: function () {
                $('.fancybox-inner').addClass('Vignette');
                $('.fancybox-inner').css('margin-bottom', '80px');
                $.fancybox.update();
            },
            onUpdate: function () {
                $('div#fancybox-thumbs').addClass('fancybox-thumbs-css');
            }

        });
        //建立照片套件

        $("div#EnlargeButton").click(
            function (e) {
                var temp = $('div#SlideFrame01');
                myScroll[Index].zoom(myScroll[Index].Prop.scale + 0.4, temp.position().left + temp.width() / 2, temp.position().top + temp.height() / 2, 600);
            }
        );
        //按下放大

        $("div#NarrowButton").click(
            function (e) {
                var temp = $('div#SlideFrame01');
                myScroll[Index].zoom(myScroll[Index].Prop.scale - 0.4, temp.position().left + temp.width() / 2, temp.position().top + temp.height() / 2, 600);

            }
        );
        //按下縮小

        $("div#RecoveryButton").click(
            function (e) {
                ZoomInit(myScroll[Index], myMapC01[Index], myMap01[Index]);
            }
        );
        //按下恢復

        onresize();
        //刷新視窗大小

        window.onresize = onresize;

        function onresize(e) {
            mySwiper.onResize();
            for (var i = 0; i < myMapC01.length; i++) {
                ResizeZoomMaxMin(myScroll[i], myMapC01[i], myMap01[i]);
                ZoomInit(myScroll[i], myMapC01[i], myMap01[i]);
            }
            //MenuResize();
        }*/
        //改變視窗大小時

    });
    //網頁框架載入時

})();

/*function ResizeZoomMaxMin(pIScroll, pFrame, pTarget) {
    var rate = pIScroll.Prop.scale * GetRate(pFrame, pTarget);
    if ($(window).width() > 768) {
        rate *= 0.75;
    } else {
        rate *= 0.95;
    }
    pIScroll.Prop.ZoomMin = rate;
    pIScroll.Prop.ZoomMax = rate * 4;
}
//刷新縮放最大最小值

function GetRate(pFrame, pTarget) {
    if ($(window).width() <= 480) {
        return ContainRate(pFrame, pTarget);
    } else if ($(window).width() <= 768) {
        return ContainRate(pFrame, pTarget);
    } else {
        return ContainRate(pFrame, pTarget);
    }
}
//取得比例

function ZoomInit(pIScroll, pFrame, pTarget, pTime) {
    pTime = pTime | 0;
    var rate = pIScroll.Prop.scale * GetRate(pFrame, pTarget);
    if ($(window).width() > 768) {
        rate *= 0.75;
    } else {
        rate *= 0.95;
    }
    pIScroll.zoom(rate, 0, 0, pTime);

    var w = pFrame.width();
    var h = pFrame.height();
    var w0 = pIScroll.Prop.MapWidth;
    var h0 = pIScroll.Prop.MapHeight;

    pIScroll.scrollTo(w / 2 - w0 / 2, h / 2 - h0 / 2, pTime);
}
//縮放初始化

function CreateIScroll(pFrame, pTarget) {
    var myScroll = new CaiMap(pFrame, pTarget, "Contain");
    ZoomInit(myScroll, pFrame, pTarget);
    return myScroll;
}
//建立縮放套件並初始化*/

function ZoomRange(pIScroll) {
    var rate = pIScroll.Prop.scale * GetRate(pIScroll.Prop.MapFrame, pIScroll.Prop.MapImage);
    if (window.innerWidth > 768) {
        rate *= 0.85;
    }else{
        rate *= 0.75;
    }
    pIScroll.Prop.ZoomMin = rate;
    pIScroll.Prop.ZoomMax = rate * 4;
    return rate;
}

function GetRate(pFrame, pTarget) {
    if (window.innerWidth <= 480) {
        return ContainRate(pFrame, pTarget);
    } else if (window.innerWidth <= 768) {
        return ContainRate(pFrame, pTarget);
    } else {
        return ContainRate(pFrame, pTarget);
    }
}

function ResizeLockRect(pIScroll) {
    var rate = ZoomRange(pIScroll);
    var wh = pIScroll.GetWH(rate);
    var xy = {
        x: 0,
        y: 0
    };
    var w = getWidth(pIScroll.Prop.MapFrame);
    var h = getHeight(pIScroll.Prop.MapFrame);

    /*if (window.innerWidth <= 768) {
        xy.x = 0;
        xy.y = 0;
        wh.w = w;
        wh.h = h;
    } else {*/
    xy.x = (w - wh.w) / 2;
    xy.y = (h - wh.h) / 2;
    //}
    pIScroll.Prop.MapLockRange.style.left = xy.x + 'px';
    pIScroll.Prop.MapLockRange.style.top = xy.y + 'px';
    pIScroll.Prop.MapLockRange.style.width = wh.w + 'px';
    pIScroll.Prop.MapLockRange.style.height = wh.h + 'px';
    return {
        x: xy.x,
        y: xy.y,
        rate: rate
    };
}

function ZoomInit(pIScroll) {
    var temp = ResizeLockRect(pIScroll);
    pIScroll.zoom(temp.rate, 0, 0, 0);
    pIScroll.scrollTo(temp.x, temp.y);

}