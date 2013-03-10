/**
* Plugin PhotoChooser
*
* 
*
* Copyright (C) 2012  Starfield Studio (www.starfieldstudio.pl)
*
*
* @package     PhotoChooser
* @author      Starfield Studio
* @copyright   2012 Starfield Studio
* @link        http://www.starfieldstudio.pl
* @version     1.0 
*/

(function($) {
    $.fn.friendChooser = function(options) {
	
		var selected_friends = 0;
		
		var settings = $.extend( {
		  scope	:	'',
		  limit	:	3,
		  afterChoice	:	null,
		  beforeShowPopup	:	null,
		  afterClosePopup	:	null,
		  lang	: {
			'header' : 'Facebook Friend Chooser',
			'close' : 'Close x',
			'legend'	:	'Select your Facebook friends.',
			'search_placeholder'	:	'Search friend by name: ',
			'ok'	: 'Ok',
			'cancel'	:	'Cancel'
		  }
		}, options);
         
        
        $(this).click(function() {
			
			methods._createHtml();
			
			if(settings.beforeShowPopup != null) {
				eval(settings.beforeShowPopup + '()');
			} else {
				methods._beforeShowPopup();
			}			
			
			methods.initPopup();
            
            return false;
        })
		
		$('#friendChooser .btn_cancel, #friendChooser .close').live('click', function() {
			
			methods.hidePopup();
			
			if(settings.afterClosePopup != null) {
				eval(settings.afterClosePopup + '()');
			} else {
				methods._afterClosePopup();
			}	
            
            return false;
        })
        
		
		$('.search').live('keyup', function(response) {
			var keyword = $(this).val().toLowerCase();
			
			if(keyword == '') {
				$('#friendChooser .fb-friend').show();
			} else {
				$('#friendChooser .fb-friend').hide();
				$('#friendChooser .fb-friend[first_name^="' + keyword + '"]').show();
				$('#friendChooser .fb-friend[last_name^="' + keyword + '"]').show();
			}
		});
        
		
		$('.fb-friend').live('click', function() {
		
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				if($('.selected_friends').text() < settings.limit) {
					$(this).addClass('active');
					$('#friendChooser .btn_submit').removeClass('disabled');
				}
			}
		
			$('.selected_friends').text($('.fb-friend.active').length);
			
			return false;
		});
        
		
		$('#friendChooser .btn_submit').live('click', function() {
		
			var photoPath = $(this).attr('rel');
			
			if(!$(this).hasClass('disabled')) {
				//alert(photoPath);
				if(settings.afterChoice != null) {
					eval(settings.afterChoice + '(photoPath)');
				} else {
					methods._afterChoice(photoPath);
				}
			}
		
			methods.hidePopup();
		
			return false;
		});
        
		
		$('#friendChooser .wrapper').live('click', function() {
		
			$('.fb-photo').removeClass('active');
			$('#friendChooser .btn_submit').addClass('disabled');
		
			return false;
		});
        
        //metody publiczne
        var methods = {
			initPopup: function() {
				methods._facebookConnect();
				
				$('#friendChooser').fadeIn();
			},
			hidePopup: function() {
				$('#friendChooser').fadeOut();
			},
            /*
             * Load all photos from choosen album (album_id)
             */
            getFriends: function(album_id) {
				$('#friendChooser .wrapper ul').text('');
				
				FB.api('/me/friends',  function(resp) {
					for (var i=0, l=resp.data.length; i<l; i++){
						var name = resp.data[i].name.split(' ');
						var html = 	'<li first_name="' + name[0].toLowerCase() + '" last_name="' + name[1].toLowerCase() + '" id="friend_' + resp.data[i].id + '"  class="fb-friend" ><div class="cover"><img src="https://graph.facebook.com/' + resp.data[i].id + '/picture?type=square" alt="" /></div><div class="username">' + resp.data[i].name + '</div></li>';
						$('#friendChooser .wrapper ul').append(html);
					}
				});
            },
            /*
             * Connect with Facebook
             */
            _facebookConnect: function() {

				FB.getLoginStatus(function(response) {
					if(response.status == 'connected') {
							methods.getFriends();
					} else {
						FB.login(function(response) {
							if (response.authResponse) {
								methods.getFriends();
							}
						}, {scope: settings.scope, display: 'dialog' });
					}
				});
            },
			/*
			 * Create and inject into <body> html of photo chooser popup
			 */
			_createHtml: function() {
				var html = '<div id="friendChooser">';
					html += '<div class="header">' + settings.lang['header'] + '<a href="" class="close">' + settings.lang['close'] + '</a></div>';
					html += '<div class="content">';
					html += '<div class="legend"><span>' + settings.lang['legend'] + '</span><input type="text" name="search" class="search" value="" placeholder="' + settings.lang['search_placeholder'] + '" /></div><div class="wrapper"><ul></ul></div>';
					html += '<div class="footer"><div class="limit">Selected <span class="selected_friends">0</span> of ' + settings.limit + '</div>';
					html += '<a href="" class="btn_cancel"><span>' + settings.lang['cancel'] + '</span></a><a href="" class="btn_submit disabled" rel="">';
					html += '<span>' + settings.lang['ok'] + '</span></a></div>';
					html += '</div></div>';
					
					$('body').append(html);
			},
			_beforeShowPopup: function() {
				// execute before show photo chooser popup
			},
			_afterChoice: function(photoPath) {
				alert(photoPath);
			},
			_afterClosePopup: function() {
				// execute after cancel or close popup
			}
        }; 
    }
})(jQuery); 