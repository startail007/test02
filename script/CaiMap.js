function checkserAgent() {
    var userAgentInfo = navigator.userAgent;
    var flag = false;
    if (userAgentInfo.indexOf("Windows NT") == -1) {
        flag = true;
    }
    return flag;
}


function CaiMap(pMapFrame, pMapImage, pType) {
    var TypeA = ["Cover", "Contain"]
    var Type = pType ? pType : TypeA[0];
    var MapFrame = pMapFrame;
    var MapImage = pMapImage;
    var MapLockRange = MapFrame.querySelector('.MapLockRange')

    var scale = 1;
    var myEvents = new EventTarget();
    var ZoomMaxBool = false;
    var ZoomMinBool = false;
    var PWidth = Number(MapImage.style.width.replace('px', '') || MapImage.offsetWidth);
    var PHeight = Number(MapImage.style.height.replace('px', '') || MapImage.offsetHeight);
    var ZoomMax = 4;
    var ZoomMin = 0.1;
    var ZoomA = ZoomA0;

    var BoundBool = {
        t: false,
        b: false,
        l: false,
        r: false
    }

    var ZoomAId
    var ScrollToAId

    var MapProp = {
        get Width() {
            return Number(MapFrame.style.width.replace('px', '') || MapFrame.offsetWidth);
        },
        get Height() {
            return Number(MapFrame.style.height.replace('px', '') || MapFrame.offsetHeight);
        },
        get PosX() {
            return Number(MapFrame.style.left.replace('px', '') || MapFrame.offsetLeft);
        },
        get PosY() {
            return Number(MapFrame.style.top.replace('px', '') || MapFrame.offsetTop);
        },
    };
    var getPosition = function(el) {
        var Rect = el.getBoundingClientRect();
        return {
            x: Rect.left + window.scrollX,
            y: Rect.top + window.scrollY
        };
    }
    var MapLockRangeProp = {
        get Width() {
            return Number(MapLockRange.style.width.replace('px', '') || MapLockRange.offsetWidth);
        },
        get Height() {
            return Number(MapLockRange.style.height.replace('px', '') || MapLockRange.offsetHeight);
        },
        get PosX() {
            return Number(MapLockRange.style.left.replace('px', '') || MapLockRange.offsetLeft);
        },
        get PosY() {
            return Number(MapLockRange.style.top.replace('px', '') || MapLockRange.offsetTop);
        },
    };



    var Prop = {
        get MapFrame() {
            return MapFrame;
        },
        get MapImage() {
            return MapImage;
        },
        get MapLockRange() {
            return MapLockRange;
        },
        get ZoomMaxBool() {
            return ZoomMaxBool;
        },
        get ZoomMinBool() {
            return ZoomMinBool;
        },
        get MapWidth() {
            return PWidth * scale;
        },
        get MapHeight() {
            return PHeight * scale;
        },
        get scale() {
            return scale;
        },
        get ZoomMax() {
            return ZoomMax;
        },
        get ZoomMin() {
            return ZoomMin;
        },
        get MapPosX() {
            return Number(MapImage.style.left.replace('px', '') || MapImage.offsetLeft);
        },
        get MapPosY() {
            return Number(MapImage.style.top.replace('px', '') || MapImage.offsetTop);
        },
        set ZoomMax(pValue) {
            ZoomMax = pValue;
        },
        set ZoomMin(pValue) {
            ZoomMin = pValue;
        },
        get BoundBool() {
            return BoundBool;
        }

    };
    this.Prop = Prop;
    this.addEvent = function(type, fn) {
        myEvents.addEvent(type, fn);
    }
    this.Init = function() {
        if (checkserAgent()) {
            EventUtil.addHandler(MapImage, 'touchmove', TM);
            EventUtil.addHandler(MapImage, 'touchstart', TS);
            EventUtil.addHandler(MapImage, 'touchend', TE);
            //EventUtil.addHandler(MapImage, 'mousewheel', MW);
            ZoomA = ZoomA1;
        } else {
            EventUtil.addHandler(window, 'mousemove', MM);
            EventUtil.addHandler(MapImage, 'mousedown', MD);
            EventUtil.addHandler(window, 'mouseup', MU);
            EventUtil.addHandler(MapImage, 'mousewheel', MW);
            ZoomA = ZoomA0;
            MapImage.ondragstart = function() {
                return false;
            };
        }
    }

    this.zoom = function(pScale, pX, pY, pT) {
        if ((pScale < scale && scale > ZoomMin) || (pScale > scale && scale < ZoomMax)) {
            pT = pT || 0;
            if (pT == 0) {
                LockScale()
                SetScale(pScale, pX, pY);
                unLockScale();
            } else {
                ZoomA(pScale, pX, pY, pT);
            }
        }
    }

    function ClearA() {
        clearInterval(ZoomAId);
        clearInterval(ScrollToAId);
    }

    this.scrollTo = function(pX, pY, pT) {
        pT = pT || 0;
        if (pT == 0) {
            SetPos(pX, pY);
        } else {
            ScrollToA(pX, pY, pT)
        }
    }

    function ZoomA0(pScale, pX, pY, pT) {
        if ((pScale < scale && scale > ZoomMin) || (pScale > scale && scale < ZoomMax)) {
            ClearA()
            var tempScale = scale;
            var step = 0;
            var len = Math.round(60 * pT / 1000);
            ZoomAId = setInterval(function() {
                step++;
                var temp = EaseQuadratic(step / len);
                LockScale();
                SetScale(tempScale + (pScale - tempScale) * temp, pX, pY);
                unLockScale();
                if (step >= len) {
                    clearInterval(ZoomAId);
                }
            }, 1000 / 60);
        }
    }

    function ZoomA1(pScale, pX, pY, pT) {
        if ((pScale < scale && scale > ZoomMin) || (pScale > scale && scale < ZoomMax)) {
            ClearA()
            var tempScale = scale;
            var step = 0;
            var len = Math.round(60 * pT / 1000);
            if (!LockScaleBool) {
                LockScale();
            }
            ZoomAId = setInterval(function() {
                step++;
                var temp = EaseQuadratic(step / len);
                SetScale(tempScale + (pScale - tempScale) * temp, pX, pY);
                if (step >= len) {
                    clearInterval(ZoomAId);
                    unLockScale();
                }
            }, 1000 / 60);
        }
    }

    function ScrollToA(pX, pY, pT) {
        ClearA();
        var tempX = Prop.MapPosX;
        var tempY = Prop.MapPosY;
        var step = 0;
        var len = Math.round(60 * pT / 1000);
        ScrollToAId = setInterval(function() {
            step++;
            if (step >= len) {
                clearInterval(ScrollToAId);
            }
            var temp = EaseQuadratic(step / len);
            SetPos(tempX + (pX - tempX) * temp, tempY + (pY - tempY) * temp);
        }, 1000 / 60)
    }


    function EaseQuadratic(k) {
        return k * (2 - k);
    }

    function Delta(e) {
        if (e.deltaY) {
            return -e.deltaY / Math.abs(e.deltaY);
        } else if (e.wheelDeltaY) {
            return e.wheelDeltaY / Math.abs(e.wheelDeltaY);
        } else if (e.wheelDelta) {
            return e.wheelDelta / Math.abs(e.wheelDelta);
        } else if (e.detail) {
            return -e.detail / Math.abs(e.detail);
        }
        return 0;
    }

    function getAbsPos(o) {
        var pos = {
            x: 0,
            y: 0
        };
        while (o != null) {
            pos.x += o.offsetLeft;
            pos.y += o.offsetTop;
            o = o.offsetParent;
        }
        return pos;
    }

    function MW(e) {
        //var temp = getAbsPos(MapFrame);
        //console.log(MapFrame.getBoundingClientRect());
        var temp0 = MapFrame.getBoundingClientRect();
        temp = {
            x: temp0.left || 0,
            y: temp0.top || 0
        }
        ZoomA(scale + 0.25 * Delta(e), e.pageX - temp.x, e.pageY - temp.y, 600);
        e.preventDefault();
        e.stopPropagation();
    }

    var old_TP;
    var EndVelocity;
    var old_MP;
    var MDBool = false;

    function MoveBool() {
        var bool0 = false;
        var bool1 = false;
        if (EndVelocity.x < 0) {
            if (BoundBool.r) {
                EndVelocity.x = 0;
            } else {
                bool0 = true;
            }
            //console.log("已達右邊邊界");
        } else if (EndVelocity.x > 0) {
            if (BoundBool.l) {
                EndVelocity.x = 0;
            } else {
                bool0 = true;
            }
            //console.log("已達左邊邊界");
        }
        if (EndVelocity.y < 0) {
            if (BoundBool.b) {
                EndVelocity.y = 0;
            } else {
                bool1 = true;
            }
            //console.log("已達上邊邊界");
        } else if (EndVelocity.y > 0) {
            if (BoundBool.t) {
                EndVelocity.y = 0;
            } else {
                bool1 = true;
            }
            //console.log("已達下邊邊界");
        }
        return {
            b0: bool0,
            b1: bool1
        }
    }

    this.MoveBool = MoveBool;

    function MM(e) {
        if (MDBool) {
            var TP = new Point(e.pageX, e.pageY);
            var MapPos = new Point(Prop.MapPosX, Prop.MapPosY);
            EndVelocity = TP.sub(old_TP);

            if (MoveBool()) {
                //console.log("移動");
                var MP = MapPos.add(EndVelocity);
                MP = SetPos(MP.x, MP.y);
                e.preventDefault();
                e.stopPropagation();
            }
            old_MP = MP;
            old_TP = TP;

        }
    }

    function MD(e) {
        ClearA();
        old_TP = new Point(e.pageX, e.pageY);
        old_MP = new Point(Prop.MapPosX, Prop.MapPosY);
        EndVelocity = new Point();
        MDBool = true;
    }

    function MU(e) {
        if (MDBool) {
            MDBool = false
            if (EndVelocity.len() > 2) {
                var MapPos = new Point(Prop.MapPosX, Prop.MapPosY);
                var tempMapPos = MapPos.add(EndVelocity.mul(20));
                ScrollToA(tempMapPos.x, tempMapPos.y, 400);
            }
        }
    }
    var b = false;

    function TM(e) {
        var Ts = e.touches;
        var TP = TouchesPoint(Ts);

        if (Ts.length == 2) {
            LockScale();
            SetScale((scale * TP.Dis / old_TP.Dis), TP.Pos.x, TP.Pos.y)
        }
        var MapPos = new Point(Prop.MapPosX, Prop.MapPosY);
        EndVelocity = TP.Pos.sub(old_TP.Pos);
        var aaa = MoveBool()
        if (aaa.b0 || aaa.b1) {
            var MP = MapPos.add(EndVelocity);
            MP = SetPos(MP.x, MP.y);
        }
        //console.log(aaa.b1)
        if (aaa.b1) {
            b = true;
        }

        old_MP = MP;
        old_TP = TP;
        if ((b && scale != ZoomMin) || scale > ZoomMin) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    var sss = 1;

    function TS(e) {
        ClearA();
        old_TP = TouchesPoint(e.touches);
        old_MP = new Point(Prop.MapPosX, Prop.MapPosY);
        EndVelocity = new Point();
        var Ts = e.touches;
        if (Ts.length < 2) {
            b = false;
        }
    }

    function TE(e) {
        unLockScale();
        if (EndVelocity.len() > 2) {
            var MapPos = new Point(Prop.MapPosX, Prop.MapPosY);
            var tempMapPos = MapPos.add(EndVelocity.mul(10));
            ScrollToA(tempMapPos.x, tempMapPos.y, 400);
        }
        old_TP = TouchesPoint(e.touches);

        /*if (!b0) {
            b0 = true;
            EnableScroll(true);
        }*/
    }
    var LockScaleBool = false;

    function LockScale() {
        if (!LockScaleBool) {
            LockScaleBool = true;
            sss = scale;
        }
    }

    function unLockScale() {
        if (LockScaleBool) {
            LockScaleBool = false;
            MapImage.style.transform = "translateZ(0) scale(1, 1)";
            MapImage.style.backfaceVisibility = "hidden";
            MapImage.style.perspective = "1000";
            MapImage.style.width = Prop.MapWidth + "px";
            MapImage.style.height = Prop.MapHeight + "px";
            sss = 1;
        }
    }

    var GetWH = function(pScale) {
        var scale0 = pScale;
        ZoomMaxBool = scale0 >= ZoomMax;
        if (ZoomMaxBool) {
            scale0 = ZoomMax;
        }
        ZoomMinBool = scale0 <= ZoomMin;
        if (ZoomMinBool) {
            scale0 = ZoomMin;
        }
        return {
            w: PWidth * scale0,
            h: PHeight * scale0
        }
    }
    this.GetWH = GetWH;

    function SetScale(pScale, pX, pY) {
        pX -= MapProp.PosX;
        pY -= MapProp.PosY;
        var xx = pX || 0;
        var yy = pY || 0;
        var s = scale;
        var ww = Prop.MapPosX - xx;
        var hh = Prop.MapPosY - yy;

        var scale0 = pScale;

        ZoomMaxBool = scale0 >= ZoomMax;
        if (ZoomMaxBool) {
            scale0 = ZoomMax;
        }
        ZoomMinBool = scale0 <= ZoomMin;
        if (ZoomMinBool) {
            scale0 = ZoomMin;
        }
        scale = scale0;
        MapImage.style.transform = "translateZ(0) scale(" + scale / sss + ", " + scale / sss + ")";
        MapImage.style.backfaceVisibility = "hidden";
        MapImage.style.perspective = "1000";
        SetPos((ww * scale / s) + xx, (hh * scale / s) + yy);
        myEvents.fireEvent("Zoom");
    }

    function SetPos(pX, pY) {
        if (Type == "Contain") {
            return SetPosContain(pX, pY);
        } else {
            return SetPosCover(pX, pY);
        }
    }

    function SetPosCover(pX, pY) {
        var p = new Point();
        if (MapLockRange != null) {
            p.x = pX.CropNumber(MapLockRangeProp.PosX + MapLockRangeProp.Width - Prop.MapWidth, MapLockRangeProp.PosX);
            p.y = pY.CropNumber(MapLockRangeProp.PosY + MapLockRangeProp.Height - Prop.MapHeight, MapLockRangeProp.PosY)

        } else {
            p.x = pX.CropNumber(MapProp.Width - Prop.MapWidth, 0)
            p.y = pY.CropNumber(MapProp.Height - Prop.MapHeight, 0);
        }
        MapImage.style.left = p.x + "px";
        MapImage.style.top = p.y + "px";
        SetBoundBool();
        return p;

    }

    function SetBoundBool() {
        BoundBool.l = Prop.MapPosX >= MapLockRangeProp.PosX;
        BoundBool.r = Prop.MapPosX <= (MapLockRangeProp.PosX + MapLockRangeProp.Width - Prop.MapWidth).toFixed(3);
        BoundBool.t = Prop.MapPosY >= MapLockRangeProp.PosY;
        BoundBool.b = Prop.MapPosY <= (MapLockRangeProp.PosY + MapLockRangeProp.Height - Prop.MapHeight).toFixed(3);
    }

    function SetPosContain(pX, pY) {
        var p = new Point();
        if (MapLockRange != null) {
            if (Prop.MapWidth > MapLockRangeProp.Width) {
                p.x = pX.CropNumber(MapLockRangeProp.PosX + MapLockRangeProp.Width - Prop.MapWidth, MapLockRangeProp.PosX)
            } else {
                p.x = pX.CropNumber(MapLockRangeProp.PosX, MapLockRangeProp.PosX + MapLockRangeProp.Width - Prop.MapWidth)
            }
            if (Prop.MapHeight > MapLockRangeProp.Height) {
                p.y = pY.CropNumber(MapLockRangeProp.PosY + MapLockRangeProp.Height - Prop.MapHeight, MapLockRangeProp.PosY)
            } else {
                p.y = pY.CropNumber(MapLockRangeProp.PosY, MapLockRangeProp.PosY + MapLockRangeProp.Height - Prop.MapHeight)
            }
        } else {
            if (Prop.MapWidth > MapProp.Width) {
                p.x = pX.CropNumber(MapProp.Width - Prop.MapWidth, 0)
            } else {
                p.x = pX.CropNumber(0, MapProp.Width - Prop.MapWidth)
            }
            if (Prop.MapHeight > MapProp.Height) {
                p.y = pY.CropNumber(MapProp.Height - Prop.MapHeight, 0)
            } else {
                p.y = pY.CropNumber(0, MapProp.Height - Prop.MapHeight)
            }
        }
        MapImage.style.left = p.x + "px";
        MapImage.style.top = p.y + "px";
        SetBoundBool();
        return p;
    }




    function TouchesPoint(pTouches) {
        var p = new Array();
        var c = new Point();
        var d = 0
        if (pTouches) {
            var len = pTouches.length;
            for (var i = 0; i < len; i++) {
                p[i] = new Point(pTouches[i].pageX, pTouches[i].pageY)
                c.x += p[i].x;
                c.y += p[i].y;
            }
            c.x /= len;
            c.y /= len;
            if (len == 2) {
                d = p[1].sub(p[0]).len();
            }
        }
        return {
            Pos: c,
            Dis: d
        };
    }
    this.Init();
}

var OldFun;
var Count001 = 0;

function EnableScroll(pBool) {
    if (pBool) {
        Count001--;
        if (Count001 == 0) {
            document.body.onmousewheel = OldFun;
            $('html, body').css({
                overflow: 'auto'
            });
        }
    } else {
        if (Count001 == 0) {
            OldFun = document.body.onmousewheel;
            document.body.onmousewheel = '';
            $('html, body').css({
                overflow: 'hidden'
            });
        }
        Count001++;
    }
}