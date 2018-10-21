package com.jahwa.demo;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.impl.util.json.JSONObject;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WXScanCode {
	private static Logger logger = LoggerFactory.getLogger(WXScanCode.class);
	
	@ResponseBody
	@RequestMapping(value="/wXScanCodeController",params="scanCodeInfo")
	public String scanCodeInfo(String result,String openid,HttpServletRequest request) throws Exception{
		logger.info(request.getRemoteAddr()+":"+request.getRequestURI()+"?"
				+request.getQueryString()+"="+result+"="+openid);
		
		String ipAddress=AesCbcUtil.getIpAddress(request);
		logger.info(ipAddress);
		String[] primarycodeUrl=result.split("/");
		String primarycode=primarycodeUrl[primarycodeUrl.length-1];
//		for(int i=0;i<primarycodeUrl.length;i++){
//			logger.info(primarycodeUrl[i]);
//			
//		}
		// 1、向防伪服务器 发送code验证
		// 请求参数
		String params ="code="+primarycode+"&ip="+	ipAddress+"&wx="+openid;
		String sr=HttpRequest.sendGet("http://jahwa.winsafe.cn/fwmQueryLogController/wxFwmQuery.do", params);
		JSONObject json = new JSONObject(sr);
		logger.info("{}",json);
		
		String msg=json.get("returnMsg").toString();
		return msg;
		
	}

}
