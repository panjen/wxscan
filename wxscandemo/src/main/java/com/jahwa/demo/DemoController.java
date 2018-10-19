package com.jahwa.demo;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DemoController {
	@ResponseBody
    @RequestMapping(value = "/hello")
	public String HelloWorld(HttpServletRequest request){
		return AesCbcUtil.getIpAddr(request);
	}

}
