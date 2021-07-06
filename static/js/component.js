/**
 * Created by chenpei on 2018/8/13.
 * �ж��Ƿ�Ϊmac
 */
function isMac() {
	var agt = navigator.userAgent.toLowerCase();
	return /macintosh|\bmac\b/.test(agt);
}

// macos�����·���js

function needNewComponent() {
	var href = window.location.href;
	var arr = [
		"login_psw.csp",
		"service.csp",
		"svpnSetting.csp",
		"general.csp",
		"hardid.csp",
		"hiderr.csp",
		"hidtip.csp",
		"dkey_portal.csp",
		"login_cert.csp",
		"security_check.csp"
	];
	var len = arr.length;
	var need_new = false;
	for (var i = 0; i < len; i++) {
		if (href.indexOf(arr[i]) > -1) {
			need_new = true;
			break;
		}
	}
	return need_new;
}



// if(!isMac() || !needNewComponent()){
// 	document.write("<script type=\"text/javascript\" charset='utf-8' src=\"/com/component_old.js\"><\/script>");
// }


