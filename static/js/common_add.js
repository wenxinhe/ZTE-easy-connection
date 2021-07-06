String.prototype.deSerialize = function()
{
    var obj = this;
    obj = obj.replace(/\r/g,"\\r").replace(/\n/g,"\\n");
    var varName ="targetObj";
    if(/^\s*var\s*[a-zA-Z_]+\s*=.*/.test(obj)){
        varName = obj.replace(/^\s*var\s*([a-zA-Z_]+)\s*=.*/,"$1");
        obj += ";var targetObj = " +varName +";";
    }
    else
        obj = "var targetObj = " + obj;
    try{
        eval(obj);
        if(typeof(targetObj) != "undefined" )
            return targetObj;
    }
    catch(e){
        alert(tr("���л�ʱ:")+e.message);
    }
    return null;
};

var Browser = {};
try{
    (function(){
        var idSeed = 0,
            ua = navigator.userAgent.toLowerCase(),
            check = function(r){
                return r.test(ua);
            },
            DOC = document,
            isStrict = DOC.compatMode == "CSS1Compat",
            isOpera = check(/opera/),
            isChrome = check(/\bchrome\b/),
            isWebKit = check(/webkit/),
            isSafari = !isChrome && check(/safari/),
            isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
            isSafari3 = isSafari && check(/version\/3/),
            isSafari4 = isSafari && check(/version\/4/),
            isIE = !isOpera && check(/(msie\s|trident.*rv:)([\w.]+)/),
            isIE7 = isIE && check(/msie 7/),
            isIE8 = isIE && check(/msie 8/),
            isIE9 = isIE && check(/msie 9/),
            isIE10 = isIE && check(/msie 10/),
            isIE11 = isIE && check(/trident.*rv:11/),
            isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10 && !isIE11,
            isGecko = !isIE && !isWebKit && check(/gecko/),
            isGecko2 = isGecko && check(/rv:1\.8/),
            isGecko3 = isGecko && check(/rv:1\.9/),
            isBorderBox = isIE && !isStrict,
            isWindows = check(/windows|win32/),
            isWin8 = check(/windows nt 6.(2|3)/), // win8 : 6.2 , win8.1 : 6.3
            isMac = check(/macintosh|mac os x/),
            isAir = check(/adobeair/),
            isLinux = check(/linux/),
            isIpad = check(/ipad/),
            is64 = check(/x64/),
            isSecure = /^https/i.test(window.location.protocol);

        if (isChrome) {
            Browser.chromeVersion = ua.match(/chrome\/([\w\.]*)/)[1];
        }

        extend(Browser,{
            isOpera:isOpera,
            isIE:isIE,
            isIE6:isIE6,
            isIE7:isIE7,
            isIE8:isIE8,
            isIE9:isIE9,
            isIE10:isIE10,
            isIE11:isIE11,
            isFirefox:isGecko,
            isSafari:isSafari,
            isChrome:isChrome,
            isIpad:isIpad,
            isWindows: isWindows,
            isWin8: isWin8,
            is64: is64
        });
    })();
}catch(e){}

function SetCookie(name, value,expire)
{
    //document.cookie = name + "=" + encodeURIComponent(value) + ";path=/";
    var expireTime = null;
    var cookiestr = null;
    if(expire===true){
        expireTime = new Date();
        expireTime.setTime(expireTime.getTime() + (364*86400000));
        cookiestr = name + "=" + value +  "; expires=" + expireTime.toGMTString() + "; path=/";
    }else{
        cookiestr = name + "=" + encodeURIComponent(value) + "; path=/";
    }
    if (/^https/i.test(window.location.protocol)){
        cookiestr += "; secure";
    }
    document.cookie = cookiestr;
}
function GetCookie(name)
{
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var ret = "SangforDefaultValue";
    var i = 0;
    while (i < clen)
    {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
        {
            var endstr = document.cookie.indexOf(";", j);
            if(endstr == -1){
                endstr = document.cookie.length;
            }
            ret = decodeURIComponent(document.cookie.substring(j, endstr));
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0){
            break;
        }
    }
    return ret;
}

function DelCookie(name)
{
    var expireTime = new Date();
    expireTime.setTime(expireTime.getTime() - (365*3600000));
    var c = name + "=0" +  "; expires=" + expireTime.toGMTString() + "; path=/";
    if (/^https/i.test(window.location.protocol)){
        c += "; secure";
    }
    document.cookie = c;
}

function CookieClass()
{
    var _this = this;
    var _cookies = {};
    //COOKIE�������ƣ���Сд
    var _fixName = "collection";
    var _MAX_LENGTH = 20;
    var _MAX_SIZE = 4 * 1024;
    /*��ʵ��COOKIE����*/
    var _cookieCount = 0;
    _this.init = function(){
        readCookie();
    };
    /*����COOKIEֵ*/
    _this.setCookie  = function(ckName,ckValue,expire)
    {
        ckValue = ckValue===null?"":ckValue;
        if(arguments.length<2 )
            return E_CK_PARAM;
        if(ckName.toLowerCase() == _fixName)
            return E_CK_RESERVED_NAME;
        //���ֻ����20��cookieֵ

        if(_cookieCount >= _MAX_LENGTH)
            return E_CK_LENGTH;
        if((document.cookie.length + ckValue.length) > _MAX_SIZE )
            return E_CK_SIZE;
        /*���ԭCOOKIE��������COOKIE������1��COOKIE��ֻ��һ��COOKIE*/
        if(arguments.length > 2 )/*��������˹���ʱ�䣬����Ҫ�������棬����ŵ�COOKIE���Ͻ�ʡ�ռ䡣�������COOKIE�����浽����COOKIE���л��������setCookieΪ׼��ɾ�������ġ�*/
        {
            if(typeof(_cookies[ckName]) == "undefined")
                ++_cookieCount;
            _cookies[ckName] = ckValue;
            _setCookie(ckName,ckValue,expire);
            if(_cookies[_fixName][ckName])
                delete _cookies[_fixName][ckName];
        }
        else
        {
            if(typeof(_cookies[_fixName]) == "undefined")
            {
                ++_cookieCount;
                _cookies[_fixName] = {};
                if(_cookies[ckName])
                    delete _cookies[ckName];
            }
            _cookies[_fixName][ckName] = ckValue;
            _setCookie(_fixName,Json.encode(_cookies[_fixName]));
        }
        return E_CK_OK;
    };
    _this.getCookie = function(ckName,isCache)
    {
        if(!isCache)
            readCookie();
        if(_cookies[ckName])
            return _cookies[ckName];
        else if(_cookies[_fixName] && _cookies[_fixName][ckName])
            return _cookies[_fixName][ckName];
        else return null;
    };
    _this.delCookie = function(ckName)
    {
        if(_cookies[ckName])
        {
            _delCookie(ckName);
            delete _cookies[ckName];
            _cookieCount --;
            return E_CK_OK;
        }
        else if(_cookies[_fixName]&&_cookies[_fixName][ckName])
        {
            if(_cookies[_fixName][ckName])
            {
                delete _cookies[_fixName][ckName];
                _setCookie(_fixName,Json.encode(_cookies[_fixName]));
            }
            if(Json.encode(_cookies[_fixName]) =="{}")
            {
                delete _cookies[_fixName];
                _delCookie(_fixName);
                --_cookieCount;
            }
            return E_CK_OK;
        }
        else return E_CK_NOEXISTS;
    };

    _this.clearCookie  = function()
    {
        _setCookie(_fixName,"{}");
    };

    /*��ȡ����COOKIEֵ����Ա����*/
    function readCookie()
    {
        var tmpCookies= document.cookie.split("; ");
        _cookies = {};
        _cookieCount = 0;
        for (var i=0; i < tmpCookies.length; ++i)
        {
            var aCrumb = tmpCookies[i].split("=");
            var sName=aCrumb[0] ;
            if (sName)
            {
                ckValue = unescape(aCrumb[1]);
                if(_fixName == sName.toLowerCase())
                {
                    var tmpCKValue = new String(ckValue);
                    tmpCKValue.isSerialized = true;
                    _cookies[sName] = tmpCKValue.deSerialize();
                }
                else
                    _cookies[sName] = unescape(aCrumb[1]);
                ++_cookieCount;
            }
        }
    }
    /*ԭʼ����COOKIE�ӿ�*/
    function _setCookie(sName, sValue,expire)
    {
        var expireInfo ="";
        if(arguments.length == 3)
            expireInfo ="; expires=" + arguments[2];
        var cookiestr = sName + "=" + escape(sValue) + expireInfo + "; path=/";
        if (/^https/i.test(window.location.protocol)){
            cookiestr += "; secure";
        }
        document.cookie = cookiestr;
    }
    /*ԭʼɾ��COOKIE�ӿ�*/
    function _delCookie(ckName)
    {
        var expireTime = new Date();
        expireTime.setTime(expireTime.getTime() - (365*86400000));
        var cookiestr = ckName + "=deleted" +  "; expires=" + expireTime.toGMTString();
        if (/^https/i.test(window.location.protocol)){
            cookiestr += "; secure";
        }
        document.cookie = cookiestr;
    }
    _this.init();
}

var Cookie = new CookieClass();