
/**
 * author arvin
 * 2014-08-22
 * version 0.1
 */

var RX = {};
RX.COMMON = {
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
    $('#scratch').wScratchPad({
        size: 40,
        //盖在上面的图片链接
        bg: 'images/1_0.jpg',
        fg: 'images/1_1.jpg',
        scratchMove: function(e, percent){
            if (percent > 50 && percent != 100) {
                $('#scratch').addClass('hide');
                $('.slide-box').addClass('show');
				$('.music-icon').addClass('show');
				$('.arrow').addClass('show');
            }
        }
    });

	
	//消除移动端点击延迟
    $(function(){
        FastClick.attach(document.body);
    });
	//播放音乐
    $(document).bind('touchstart', function(){
        if (!window.isTouchFirst) {
			window.isTouchFirst = true;
            $('#audio')[0].play();
        }
    })
	//onload
    $(window).bind('load', function(){
        var slideItem = $('.slide-box .slide-item');
        slideItem.each(function(i){
            $(this).css('z-index', slideItem.length * 2 - i);
        })
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
            }).on('swipeup swipedown dragup dragdown release', function(e){
                var active = $('.slide-box .slide-item.active');
                var gesture = e.gesture;
                function dragUpDown(ges, direction){
                    window.direction = direction;
                    if (gesture) {
                        if (direction == 'up') {
                            var percent = gesture.deltaY / $(window).height();
                            percent = Math.abs(percent);
                            window.slidePercent = percent;
                            if (active[0] && active.next()[0]) {
                                active[0] &&
                                active.css({
                                    'transition': 'all 0ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(-' + (100 * percent) + '%) rotateY(-' + (90 * percent) + 'deg) translateZ(0)'
                                })
                            }
                            if (active[0] && active.prev()[0]) {
                                active.prev()[0] &&
                                active.prev().css({
                                    'transition': 'all 0ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(-100%) rotateY(-90deg) translateZ(0)'
                                })
                            }
                        }
                        if (direction == 'down') {
                            var percent = gesture.deltaY / $(window).height();
                            percent = Math.abs(percent);
                            window.slidePercent = percent;
                            if (active[0] && active.next()[0]) {
                                active[0] &&
                                active.css({
                                    'transition': 'all 0ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(0%) rotateY(0deg) translateZ(0)'
                                })
                            }
                            if (active[0] && active.prev()[0]) {
                                active.prev()[0] &&
                                active.prev().css({
                                    'transition': 'all 0ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(-' + (100 - 100 * percent) + '%) rotateY(-' + (90 - 90 * percent) + 'deg) translateZ(0)'
                                })
                            }
                        }
                    }
                }
                function swipeUp(){
                    if (active[0] && active.next()[0]) {
                        active[0] &&
                        active.removeClass('active').css({
                            'transition': 'all 600ms ease',
                            'transform-origin': 'top center',
                            'transform': 'translateY(-100%) rotateY(-90deg) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
                            $(this).unbind('webkitTransitionEnd transitionend');
                            active.next()[0] && active.next().addClass('active');
                        })
                    }
					if (active[0] && !active.next()[0]) {
                        active.removeClass('active').siblings().each(function(i){
                            setTimeout(function(el, i){
                                
                                if (i == (active.siblings().length - 1)) {
                                    $(el).css({
                                        'transition': 'all 100ms ease',
                                        'transform-origin': 'top center',
                                        'transform': 'translateY(0%) rotateY(0deg) translateZ(0)'
                                    }).bind('webkitTransitionEnd transitionend', function(){
                                        $(this).unbind('webkitTransitionEnd transitionend');
                                        active.siblings().eq(0).addClass('active');
                                    })
                                }
                                else {
                                    $(el).css({
                                        'transition': 'all 600ms ease',
                                        'transform-origin': 'top center',
                                        'transform': 'translateY(0%) rotateY(0deg) translateZ(0)'
                                    }).bind('webkitTransitionEnd transitionend', function(){
                                        $(this).unbind('webkitTransitionEnd transitionend');
                                    })
                                }
                                
                            }, 50 * i, this, i)
                            
                        })
					}
                }
                function swipeDown(){
                    if (active[0] && active.prev()[0]) {
                        active[0] && active.removeClass('active');
                        active.prev()[0] &&
                        active.prev().css({
                            'transition': 'all 600ms ease',
                            'transform-origin': 'top center',
                            'transform': 'translateY(0%) rotateY(0deg) translateZ(0)'
                        }).bind('webkitTransitionEnd transitionend', function(){
                            $(this).unbind('webkitTransitionEnd transitionend');
                            active.prev()[0] && active.prev().addClass('active');
                        })
                    }
					if (active[0] && !active.prev()[0]) {
                        active.removeClass('active').siblings().eq(active.siblings().length - 1).siblings().each(function(i){
                            setTimeout(function(el, i){
                                
                                if (i == (active.siblings().length - 1)) {
                                    $(el).css({
                                        'transition': 'all 100ms ease',
                                        'transform-origin': 'top center',
                                        'transform': 'translateY(-100%) rotateY(-90deg) translateZ(0)'
                                    }).bind('webkitTransitionEnd transitionend', function(){
                                        $(this).unbind('webkitTransitionEnd transitionend');
                                        active.siblings().eq(active.siblings().length - 1).addClass('active');
                                    })
                                }
                                else {
                                    $(el).css({
                                        'transition': 'all 600ms ease',
                                        'transform-origin': 'top center',
                                        'transform': 'translateY(-100%) rotateY(-90deg) translateZ(0)'
                                    }).bind('webkitTransitionEnd transitionend', function(){
                                        $(this).unbind('webkitTransitionEnd transitionend');
                                    })
                                }
                                
                            }, 50 * i, this, i)
                        })
					}
                }
                switch (e.type) {
                    case 'dragup':
                        dragUpDown(gesture, 'up');
                        break;
                    case 'dragdown':
                        dragUpDown(gesture, 'down');
                        break;
                    case 'release':
                        if (window.direction == 'up') {
                            if (window.slidePercent > 0.2) {
                                swipeUp();
                            }
                            else {
                                active[0] &&
                                active.css({
                                    'transition': 'all 600ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(0%) rotateY(0deg) translateZ(0)'
                                })
                            }
                        }
                        if (window.direction == 'down') {
                            if (window.slidePercent > 0.2) {
                                swipeDown();
                            }
                            else {
                                active.prev()[0] &&
                                active.prev().css({
                                    'transition': 'all 600ms ease',
                                    'transform-origin': 'top center',
                                    'transform': 'translateY(-100%) rotateY(-90deg) translateZ(0)'
                                })
                            }
                        }
                        window.direction = null;
                        window.slidePercent = 0;
                        break;
                    case 'swipeup':
                        swipeUp();
                        break;
                    case 'swipedown':
                        swipeDown();
                        break;
                }
            })
        });
    });
	
})

//微信分享 分享的【图片，链接，标题，内容】设置
$(window).wxShare(location.protocol + '//' + location.host +'/NYC/images/wxShare.jpg', 100, 100, $('title').html(), '不要再担心张柏芝了', window.location.href, window.appId || '', {
    showOptionMenu: true,
    showToolbar: false,
	callback: function(data){

	}
});
