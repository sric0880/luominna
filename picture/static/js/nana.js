function resize_clip(){
  $("div.clip").each(function(){
  	var r = $(this).attr("r");
  	var w = $(this).width();
  	$(this).height(Math.round(w) / r);
  });
}
function resize_layer_container_gallery(isWindowResize) {
	var $layer = $(".full-screen-layer");
	var $gallery = $layer.find(".gallery-demo");
	var h = $(window).height() - 40;
	$gallery.height(h);
	var $gallery_cells = $gallery.find(".gallery-cell");
	$gallery_cells.height(h - 120); //100 used for info cell
	$gallery_cells.width($(window).width());
	if (isWindowResize)
	{
		var $visibleGallery = $layer.find(".gallery-demo:visible");
		if ($visibleGallery.length != 0){
			resize_gallery_cell_img($visibleGallery.find(".gallery-cell"));
		}
	}
}
function resize_gallery_cell_img(visibleGalleryCells) {
	$(visibleGalleryCells).each(function(){
		$img = $(this).find("img");
		var h = $img.height();
		console.log(" : " + h);
		var margin = ($(window).height() - h - 130 - 40)/2;
		console.log(margin + " : " + $img.length);
		$img.css({"margin-top":margin+"px", "margin-bottom":margin+"px"});
	});
}
function relayout(){
	$images = $(".thumbnail img");
	if ($images.length == 0){
		//相册使用的是css background-image
		$(".clip").each(function(){
			var el = $(this), sources, image;
			if(sources = el.css('background-image')){
				$.each(sources.split(','), function(i, source){
					if(image = source.match(/url\((['"])?(.*?)\1\)/)){
						$images = $images.add($('<img>').attr('src', image.pop()));
					}
				});
			}
		});
	}
	$images.imagesLoaded( function() {
		$(".row").masonry({
			percentPosition: true
		});
	});
}
function appendLayout(appendItems) {
	var $row = $('.row').imagesLoaded( function() {
	  $row.masonry('appended', appendItems);
	});
}
/* 滚动加载 */
function page_more(){
	var page=1;
	var loading_flag=false;
	var has_more = true;
	function scrollListen(){
		var scroll_func = function(){
			var bottom_padding=$(document).height()-$(document).scrollTop()-$(window).height();
			if(bottom_padding<50 && !loading_flag && has_more){
				loading_flag=true;
				page_show();
				page++;
			}
		};
		// scroll_func();
		$(document).scroll(scroll_func);
	}
	function page_show(){
		var action = $("#infscr-loading").attr("action");
		var _url = action + "/"+page;
		$.ajax({
			url: _url,
			type: 'GET',
			dataType: 'text',
			timeout: 20000,
			error:function(){ console.log("error fetch more pics or albums"); },
			success:function(feedback){
				loading_flag=false;
				if(feedback.replace(/(^\s*)|(\s*$)/g, "")==""){
					has_more = false;
					$("#infscr-loading").hide();
					console.log("nothing any more");
				}else{
					var ret = feedback.split("&");
					var $appendItems = $(ret[0]);
					$appendItems.find("div.thumbnail").click(itemClicked);
					$('.row').append($appendItems);
					appendLayout($appendItems);
					$(".layer-container").append($(ret[1]));
					resize_layer_container_gallery(false);
				}
			}
		});
	}
	scrollListen();
}
$("#go-top").hide();
//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
$(function () {
	$(window).scroll(function(){
		if ($(window).scrollTop()>300){
			$("#go-top").fadeIn(500);
		} else {
			$("#go-top").fadeOut(500);
		}
	});
	//当点击跳转链接后，回到页面顶部位置
	$("#go-top").click(function(){
		$('body,html').animate({scrollTop:0},500);
		return false;
	});
});
function hideScrollbar(){
	$("body").css({overflow:"hidden"});
	$(".wrapper").hide();
	$("nav").hide();
	$("#footer").hide();
}
function showScrollbar(){
	$("body").css({overflow:"auto"});
	$(".wrapper").show();
	$("nav").show();
	$("#footer").show();
}
function itemClicked() {
	var $layer = $(".full-screen-layer");
	$layer.show();
	var scrollvalue = $(document).scrollTop();
	hideScrollbar();
	$layer.find(".gallery-close").click(function(){
		$layer.hide();
		$layer.find(".gallery-demo").hide();
		showScrollbar();
		resize_clip();
		$('body,html').animate({scrollTop:scrollvalue},0);
	});
	var $gallery = $layer.find("#" + $(this).attr("id"));
	console.log("#" + $(this).attr("id"));
	$gallery.fadeIn();
	var $g;
	if ($(this).parent().hasClass("album-entry")) {
		$g = $gallery.flickity({
			imagesLoaded: true,
		  cellAlign: 'center',
		  draggable: true,
		  freeScroll: false,
		  lazyLoad: 2,
		  percentPosition: false,
		  prevNextButtons: true,
		  pageDots: true,
		  resize: true,
		  setGallerySize: false,
		  wrapAround: false
		});
	} else {
		$g = $gallery.flickity({
			imagesLoaded: true,
		  cellAlign: 'center',
		  draggable: false,
		  freeScroll: false,
		  lazyLoad: true,
		  percentPosition: false,
		  prevNextButtons: false,
		  pageDots: false,
		  resize: true,
		  setGallerySize: false,
		  wrapAround: false
		});
	}
	$g.on( 'lazyLoad', function( event, cellElement ) {
		var img = event.originalEvent.target;
		console.log( event.originalEvent.type, img.src );
		resize_gallery_cell_img(cellElement);
	});
}
$(window).resize(function() {
	resize_clip();
	resize_layer_container_gallery(true);
});
$(document).ready( function() {
	$(".album-entry").each(function(){
		var width = $(this).find(".thumbnail").width();
		var $clips = $(this).find(".clip");
		var $images = $(".clip img");
		$clips.each(function(){
			var el = $(this), sources, image;
			if(sources = el.css('background-image')){
				$.each(sources.split(','), function(i, source){
					if(image = source.match(/url\((['"])?(.*?)\1\)/)){
						$images = $images.add($('<img>').attr('src', image.pop()));
					}
				});
			}
		});
		var imgLoad = imagesLoaded($images);
		imgLoad.on( 'always', function() {
			var ratios = [];
			var len = imgLoad.images.length;
			console.log(len);
		  for ( var i = 0; i < len; i++ ) {
		  	var image = imgLoad.images[i];
		  	var result = image.isLoaded ? 'loaded' : 'broken';
		  	console.log( 'image is ' + result + ' for ' + image.img.src );
		  	ratios.push(image.img.width / image.img.height);
	  	}
	  	var min = 100000;
	  	var max = 0;
	  	var min_index, max_index = 0;
	  	if (len == 2 || len == 3){
	  		for (var i = ratios.length - 1; i >= 0; i--) {
	  			if (min > ratios[i]) {
	  				min = ratios[i];
	  				min_index = i;
	  			}
	  			if (max < ratios[i]) {
	  				max = ratios[i];
	  				max_index = i;
	  			} 
	  		}
	  	}
	  	var len2_r = 0;
	  	if (len == 2){
	  		if (min > 1){
	  			len2_r = 2;
	  		} else if (max < 1) {
	  			len2_r = 0.5;
	  		} else if (max > 1/min) {
	  			len2_r = 2;
	  		}
	  		else {
	  			len2_r = 0.5;
	  		}
	  	}
	  	var len3_r = [1,1,1];
	  	if (len == 3){
	  		if (max > 2) { 
	  			len3_r[max_index] = 2;
	  		}
	  		else if (min < 0.5 ){
	  			len3_r[min_index] = 0.5;
	  		}
	  		else if (max > 1/min){
	  			len3_r[max_index] = 2;
	  		}
	  		else {
	  			len3_r[min_index] = 0.5;
	  		}
	  	}
	  	$clips.each(function(index, element){
		  	var r = ratios[index];
		  	var real_r = 1;
		  	if (len == 2) {
		  		real_r = len2_r;
		  	}
		  	else if (len == 3) {
		  		real_r = len3_r[index];
		  	}
		  	var ele_width = 0;
		  	if (real_r == 0.5){
		  		$(element).css("width", "50%");
		  		ele_width = width * 0.5;
		  		$(element).height(width);
		  	}
		  	else if (real_r == 1) {
		  		if (len == 1){
			  		$(element).css("width", "100%");
			  		ele_width = width;
		  			$(element).height(width);
		  		}else{
			  		$(element).css("width", "50%");
			  		ele_width = width * 0.5;
		  			$(element).height(ele_width);
		  		}
		  	}
		  	else {
		  		$(element).css("width", "100%");
		  		ele_width = width;
		  		$(element).height(width * 0.5);
		  	}
		  	$(element).attr("r", real_r);
		  });
			if (len == 3){
				if (len3_r[max_index] == 2 && max_index == 1){
					//长条必须放在 0 和 2的位置
					var $max_clip = $clips.eq(max_index);
					$max_clip.insertBefore($max_clip.prev());
				}
				else if (len3_r[min_index] == 0.5 && min_index != 0) {
					//竖条必须放在0 的位置
					var $min_clip = $clips.eq(min_index);
					$min_clip.insertBefore($clips.eq(0));
				}
			}
	  });
	});
	relayout();
	if ($("#infscr-loading").length != 0) {
		page_more();
	}
	resize_layer_container_gallery(false);
	$(".full-screen-layer").hide();
	$("div.thumbnail").click(itemClicked);
});

