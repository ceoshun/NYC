
/**
 * author arvin
 * 2014-08-22
 * version 0.1
 */

var RX = {};
RX.COMMON = {
	/**
	 * 显示分享遮罩
	 */
    showShareMask: function(){
        $('.share-mask').removeClass('none').bind('click', function(){
            $(this).addClass('none');
			$(this).unbind('click');
        })
    },
	/**
	 * 弹窗
	 * @param {Object} msg
	 */
    alert: function(msg, callback){
        if (!msg) {
            return;
        }
        var alert = $('.alert');
        alert.find('.alert-text').html(msg);
        alert.removeClass('none');
        alert.bind('click', function(){
            alert.addClass('none');
            alert.unbind('click');
            if (typeof callback == 'function') {
                callback();
            }
        })
    },
	showLoadMask: function(show, text){
        var _this = this;
        text ? $('.page-load-mask .page-load-mask-text').html(text) : $('.page-load-mask .page-load-mask-text').html('');
        show ? $('.page-load-mask').show() : $('.page-load-mask').hide();
    },
	/**
	 * 预加载所有图片
	 */
	loadImages: function(callback){
		var _this = this;
		var images = $('.slide-box img');
		var loaded = 0;
		var count = images.length;
		images.each(function(){
			var img = new Image();
			var image = this;
			img.onload = img.onerror = function(){
				loaded ++;
                $(image).attr('src', this.src);
				if ($(image).attr('data-first') == 'true') {
                    $(image).parent().css('background-image', 'url(' + this.src + ')');
				}
				if ($(image).attr('data-second') == 'true') {
					var div = $('<div data-second="true"></div>');
                    div.css('background-image', 'url(' + this.src + ')');
					$(image).attr('onclick') && div.attr('onclick', $(image).attr('onclick'));
					$(image).replaceWith(div);
				}
                if (loaded >= count) {
                    _this.showLoadMask(false);
                    typeof callback === 'function' && callback();
                }
                else {
                    _this.showLoadMask(true, parseInt(((loaded / count) * 100)) + '%');
                }
			}
			img.src = $(this).attr('data-src');
		})
	}
}

$(document).ready(function(){
	
    //消除移动端点击延迟
    $(function(){
        FastClick.attach(document.body);
    });
    
    if (window.isPlayMusic) {
        //播放音乐
        $(document).bind('touchstart', function(){
            if (!window.isTouchFirst) {
                window.isTouchFirst = true;
                $('#audio')[0].play();
            }
        })
    }
    else {
        $('#audio').removeAttr('autoplay')
        $('.music-icon').addClass('disabled');
    }
	
	//设定slidebox
	var slideBox = $('.slide-box');
    var slideItem = $('.slide-box .slide-item');
	slideBox.css({
		'height': 100 * slideItem.length + '%',
		'left': 0,
		'top': 0,
		'transform': 'translateY(0px) translateZ(0)'
	});

    slideItem.each(function(i){
        $(this).css({
			'height': 100 / slideItem.length + (100 / slideItem.length) / 100 + '%',
			'z-index': slideItem.length * 2 - i,
			'top': 100 / slideItem.length * i - (100 / slideItem.length) / 200 + '%'
		}).attr('data-index', i);
    })
	
	
    //onload
    $(window).bind('load', function(){
		
        RX.COMMON.loadImages(function(){
			
			$('.slide-box .slide-item').eq(0).addClass('active');
            
            //绑定音乐按钮
            $('.music-icon').click(function(){
                if ($(this).hasClass('disabled')) {
                    $('#audio')[0].play();
                    $(this).removeClass('disabled');
                }
                else {
                    $('#audio')[0].pause();
                    $(this).addClass('disabled');
                }
            })


            //绑定滑动事件
            $('.slide-box').hammer({
                drag_block_horizontal: true,
                drag_block_vertical: true,
            }).on('swipeup swipedown dragup dragdown', function(e){
				
				
				var slideBox = $('.slide-box');
				var slideItem = $('.slide-box .slide-item');
				var active = $('.slide-box .slide-item.active');
				var gesture = e.gesture;
				
				
                switch (e.type) {
                    case 'swipeup':
                        swipeUp();
                        break;
                    case 'swipedown':
                        swipeDown();
                        break;
                    case 'dragup':
                        if (Math.abs(gesture.deltaY) > 100) {
                            swipeUp();
                        }
                        break;
                    case 'dragdown':
                        if (Math.abs(gesture.deltaY) > 100) {
                            swipeDown();
                        }
                        break;
                }
				window.swipeUp = swipeUp;
				function swipeUp(callback){
					var slideBox = $('.slide-box');
					var slideItem = $('.slide-box .slide-item');
					var active = $('.slide-box .slide-item.active');
                    
					
					if (active[0] && active.attr('data-hasScroll') == 'true' && active[0].scrollHeight && ((active[0].scrollHeight - active.scrollTop()) > (active.height() + (parseInt(active.css('padding-top')) || 0) + (parseInt(active.css('padding-bottom')) || 0) + 10))) {
                        window.preventGGlDefault = false;
                        return;
                    }
                    else {
                        window.preventGGlDefault = true;
                    }
                    
                    
                    if (window.swipeing) {
                        return;
                    }
					window.swipeing = true;

                    if (active.attr('data-callback')) {
                        eval(active.attr('data-callback').split('()')[0]).call(RX.COMMON, active, true);
                    }
                    if (active.next().length) {
						
						
                        
						
                        slideBox.css({
                            'transition': 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            'transform': 'translateY( ' + (-(100 / slideItem.length * (parseInt(active.attr('data-index')) + 1))) + '%) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
                            
							active.removeClass('active');
							active.next().addClass('active');
                            
                            typeof callback === 'function' && callback();
							if (active.next().attr('data-callback')) {
                                eval(active.next().attr('data-callback').split('()')[0]).call(RX.COMMON, active.next(), false);
                            }
                            $(this).unbind('webkitTransitionEnd transitionend');
							window.swipeing = false;
                        })
                    }
                    else {
						var newItem = slideItem.eq(0).clone(true);
						newItem.css({
							'top': 100 / slideItem.length * (parseInt(active.attr('data-index')) + 1) + '%'
						}).addClass('active');
						slideBox.append(newItem);
						slideItem.eq(0).addClass('active');
						
                        
						
                        slideBox.css({
                            'transition': 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            'transform': 'translateY( ' + (-(100 / slideItem.length * (parseInt(active.attr('data-index')) + 1))) + '%) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
							
							active.removeClass('active');
							
							
							$(this).unbind('webkitTransitionEnd transitionend');
							slideBox.css({
								'transition': 'all 0ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
								'transform': 'translateY(0%) translateZ(0)'
							})
                            
							
							newItem.remove();
                            typeof callback === 'function' && callback();
							if (slideItem.eq(0).attr('data-callback')) {
                                eval(slideItem.eq(0).attr('data-callback').split('()')[0]).call(RX.COMMON, slideItem.eq(0), false);
                            }
							window.swipeing = false;
                            
                        })
                    }
				}
				window.swipeDown = swipeDown;
                function swipeDown(){
					var slideBox = $('.slide-box');
					var slideItem = $('.slide-box .slide-item');
					var active = $('.slide-box .slide-item.active');
					
					if (active[0] && active.attr('data-hasScroll') == 'true' && active[0].scrollHeight && (active.scrollTop() > 10)) {
                        window.preventGGlDefault = false;
                        return;
                    }
                    else {
                        window.preventGGlDefault = true;
                    }
                    
                    if (window.swipeing) {
                        return;
                    }
					window.swipeing = true;
                    
                    if (active.prev().length) {
                        if (active.attr('data-callback')) {
                            eval(active.attr('data-callback').split('()')[0]).call(RX.COMMON, active, true);
                        }
						
						
                        
						
                        slideBox.css({
                            'transition': 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            'transform': 'translateY( ' + (-(100 / slideItem.length * (parseInt(active.attr('data-index')) - 1))) + '%) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
							active.prev().addClass('active');
							active.removeClass('active');
                            
                            typeof callback === 'function' && callback();
							if (active.prev().attr('data-callback')) {
                                eval(active.prev().attr('data-callback').split('()')[0]).call(RX.COMMON, active.prev(), false);
                            }
                            $(this).unbind('webkitTransitionEnd transitionend');
                            window.swipeing = false;
                        })
                    }
                    else {
                        var newItem = slideItem.eq(slideItem.length - 1).clone(true);
						newItem.css({
							'top': 100 / slideItem.length * (parseInt(active.attr('data-index')) - 1) + '%'
						}).addClass('active');

						newItem.insertBefore(slideItem.eq(0));
						
						slideItem.eq(slideItem.length - 1).addClass('active');
                        
							
                        slideBox.css({
                            'transition': 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            'transform': 'translateY( ' + (-(100 / slideItem.length * (parseInt(active.attr('data-index')) - 1))) + '%) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
							
							active.removeClass('active');
							
							$(this).unbind('webkitTransitionEnd transitionend');
							slideBox.css({
								'transition': 'all 0ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
								'transform': 'translateY(' + (-(100 / slideItem.length * (slideItem.length - 1))) + '%) translateZ(0)'
							})
                            
							
							newItem.remove();
                            typeof callback === 'function' && callback();
							if (slideItem.eq(slideItem.length - 1).attr('data-callback')) {
                                eval(slideItem.eq(slideItem.length - 1).attr('data-callback').split('()')[0]).call(RX.COMMON, slideItem.eq(slideItem.length - 1), false);
                            }
							window.swipeing = false;
                            
                        })
                    }
                }
            });
            
        });
    });
    
})

//微信分享 分享的【图片，链接，标题，内容】设置
$(window).wxShare(location.protocol + '//' + location.host + '/nyc7/images/wxShare.jpg', 100, 100, $('title').html(), '南飞鸿广场NYC', window.location.href, window.appId || '', {
    showOptionMenu: true,
    showToolbar: false,
    callback: function(data){
       
    }
});

$('.loc').click(function(e){
    $(this).find('a').css({
		right: -80,
		width: $(window).width()
    }).addClass('show')
	e.stopPropagation();
})
$('.loc a').click(function(e){
	e.stopPropagation();
})
$('.slide-box .slide-item.s19').click(function(){
	$('.loc a').removeClass('show');
})



