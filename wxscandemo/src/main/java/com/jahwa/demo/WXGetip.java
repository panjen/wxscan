package com.jahwa.demo;

import java.io.IOException;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class WXGetip {
	private static Logger logger = LoggerFactory.getLogger(WXGetip.class);
	//方法一
    @ResponseBody
    @RequestMapping(value = "/getIp", method = RequestMethod.POST)
    public String getIp(HttpServletRequest request) throws Exception {
        return AesCbcUtil.getIpAddress(request);
    }
    
    
    //方法二
    @Autowired
    public HttpServletRequest request;
    
    @ResponseBody
    @RequestMapping(value = "/getIp2")
    public String getIp2(){
    	logger.info(request.getRemoteAddr()+":"+request.getRequestURI()+"?"+request.getQueryString());
		return request.getRemoteAddr();
    	
    }
    

}
