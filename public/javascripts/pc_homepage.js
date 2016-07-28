import $ from "./module/jquery.min.js";

function setHeight(){
	var  clientH=document.documentElement.clientHeight;
	var sections=document.getElementsByTagName("section");
	for (var i = 0; i < sections.length; i++) {
		sections[i].style.height=clientH + 'px';
	};
}

function align(id){
	var clientW=document.documentElement.clientWidth;
	var alignBOX=document.getElementById(id);
	alignBOX.style.left=(clientW - alignBOX.offsetWidth)/2 + 'px';
}

function check_mobile(){
	var sUserAgent = navigator.userAgent;            
	if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {

                location.href = '/mobile';            
            } else {

            }        
}

function getScrollTop(){ 
	var scrollTop=0; 
	if(document.documentElement&&document.documentElement.scrollTop){ 
		scrollTop=document.documentElement.scrollTop; 
	}else if(document.body){ 
		scrollTop=document.body.scrollTop; 
	} 
	return scrollTop; 
} 

function animate(){
	var clientH=document.documentElement.clientHeight;
	var scrollTop=getScrollTop();
	if(scrollTop>clientH/2){
		$("#home_introduce_title").animate({ opacity : 1 },500,function(){
			$("#home_introduce_text").animate({ opacity : 1 },500);
		});
	}
	if(scrollTop>1.5*clientH){
		$("#activity_introduce_title").animate({ opacity : 1 },500,function(){
			$("#activity_introduce_text").animate({ opacity : 1 },500);
		});
	}
}

window.onload=function(){
	setHeight();
	align("contact_main");
	check_mobile();
	$("#meet").animate({ opacity : 1 },1800);
	
	window.onscroll=function(){
		animate();
	}
}