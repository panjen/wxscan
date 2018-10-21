package com.jahwa.demo;

import java.util.HashMap;

import java.util.Map;

import org.activiti.engine.impl.util.json.JSONObject;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jahwa.demo.AesCbcUtil;
import com.jahwa.demo.HttpRequest;

@Controller
@RequestMapping("/wXLoginController")
public class WXAppletUserInfo {
	private static Logger logger = LoggerFactory.getLogger(WXAppletUserInfo.class);
	@RequestMapping(params = "decodeUserInfo")
	@ResponseBody
	public Map<String, Object> decodeUserInfo(String encryptedData, String iv, String code,HttpServletRequest request) {
		logger.info(request.getRemoteAddr()+":"+request.getRequestURI()+"?"
				+request.getQueryString()+"="+encryptedData+"&"+iv+"&"+code);
		Map<String, Object> map = new HashMap<String, Object>();

		// 登录凭证不能为空
		if (code == null || code.length() == 0) {
			map.put("status", 0);
			map.put("msg", "code 不能为空");
			return map;
		}

		// 小程序唯一标识 (在微信小程序管理后台获取)
		String wxspAppid = "wx655a08f1d46055fd";
		// 小程序的 app secret (在微信小程序管理后台获取)
		String wxspSecret = "c755b556a5040fd262a157ed81d4a79d";
		// 授权（必填）
		String grant_type = "authorization_code";

		// 1、向微信服务器 使用登录凭证 code 获取 session_key 和 openid
		// 请求参数
		String params = "appid=" + wxspAppid + "&secret=" + wxspSecret + "&js_code=" + 
						code + "&grant_type="+ grant_type;
		// 发送请求
		String sr = HttpRequest.sendGet("https://api.weixin.qq.com/sns/jscode2session", params);
		// 解析相应内容（转换成json对象）
		JSONObject json = new JSONObject(sr);
		// 获取会话密钥（session_key）
		String session_key = json.get("session_key").toString();
		// 用户的唯一标识（openid）
		String openid = (String) json.get("openid");
		System.out.println(json);

		// 2、对encryptedData加密数据进行AES解密
		try {
			String result = AesCbcUtil.decrypt(encryptedData, session_key, iv, "UTF-8");
			System.out.println(result);
			if (null != result && result.length() > 0) {
				map.put("status", 1);
				map.put("msg", "解密成功");

				JSONObject userInfoJSON = new JSONObject(result);
				Map<String, Object> userInfo = new HashMap<String, Object>();
				userInfo.put("openId", userInfoJSON.get("openId"));
				userInfo.put("nickName", userInfoJSON.get("nickName"));
				userInfo.put("gender", userInfoJSON.get("gender"));
				userInfo.put("city", userInfoJSON.get("city"));
				userInfo.put("province", userInfoJSON.get("province"));
				userInfo.put("country", userInfoJSON.get("country"));
				userInfo.put("avatarUrl", userInfoJSON.get("avatarUrl"));
				// 解密unionId & openId;
				if (!userInfoJSON.isNull("unionId")) {
					userInfo.put("unionId", userInfoJSON.get("unionId"));
				}
				map.put("userInfo", userInfo);
				//System.out.println(userInfo);
			} else {
				map.put("status", 0);
				map.put("msg", "解密失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}



}
