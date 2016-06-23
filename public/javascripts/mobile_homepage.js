function config(){
	var swiper = new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        direction: 'vertical',
	        slidesPerView: 1,
	        paginationClickable: true,
	        spaceBetween: 30,
	        mousewheelControl: true
	    });
}

window.onload=function(){
	config();
}