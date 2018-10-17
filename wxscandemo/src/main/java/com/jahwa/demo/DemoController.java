package com.jahwa.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DemoController {
	@ResponseBody
    @RequestMapping("/hello")
	public String HelloWorld(){
		return "HELLO WORLD!";
	}

}
