function resize_clip(){
  $("div.clip").each(function(){
  	var r = $(this).attr("r");
  	var w = $(this).width();
  	$(this).height(w / r);
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
	console.log($images);
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
					var $appendItems = $(feedback);
					$('.row').append($appendItems);
					appendLayout($appendItems);
				}
			}
		});
	}
	scrollListen();
}
$(window).resize(resize_clip);
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
		console.log($images);
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
});
