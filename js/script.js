(function($){
	// Settings
	var repeat = localStorage.repeat || 0,
		shuffle = localStorage.shuffle || 'false',
		continous = true,
		autoplay = true,
		playlist = [
		{
title: '海阔天空',
artist: 'Beyond',
album: '海阔天空是黄家驹为BEYOND 成立十周年而作的，刻划着他们十年来的心路历程。',
cover: 'http://wmkjinc.qiniudn.com/hktk.jpg',
mp3: 'http://wmkjinc.qiniudn.com/hktk.mp3',
ogg: 'http://wmkjinc.qiniudn.com/hktk.mp3'
},

{
title: '光辉岁月',
artist: 'Beyond',
album: '不因岁月流逝而改变。每次听到，或许会热泪盈眶，但决不颓废。',
cover: 'http://wmkjinc.qiniudn.com/ghsy.jpg',
mp3: 'http://wmkjinc.qiniudn.com/ghsy.mp3',
ogg: 'http://wmkjinc.qiniudn.com/ghsy.mp3'
},

{
title: '吻别',
artist: '张学友',
album: '二十年。偶尔听听还是挺有感觉. 现在的歌找不到这种感觉了。',
cover: 'http://wmkjinc.qiniudn.com/wb.jpg',
mp3: 'http://wmkjinc.qiniudn.com/wb.mp3',
ogg: 'http://wmkjinc.qiniudn.com/wb.mp3'
},

{
title: 'Price Tag',
artist: 'B.o.B/Jessie J',
album: '歌词很catchy，旋律也很轻快，听一遍就能跟着哼哼几句。',
cover: 'http://wmkjinc.qiniudn.com/pt.jpg',
mp3: 'http://wmkjinc.qiniudn.com/pt.mp3',
ogg: 'http://wmkjinc.qiniudn.com/pt.mp3'
},

{
title: '不要说话',
artist: '陈奕迅',
album: '很平静又很温暖，歌词上虽没有什么特别之处，却也是朴实真切的写出了暗恋的那份情愫。',
cover: 'http://wmkjinc.qiniudn.com/bysh.jpg',
mp3: 'http://wmkjinc.qiniudn.com/bysh.mp3',
ogg: 'http://wmkjinc.qiniudn.com/bysh.mp3'
},

{
title: '红豆',
artist: '王菲',
album: '相聚离开都有时候，没有什么会永垂不朽.',
cover: 'http://wmkjinc.qiniudn.com/hd.jpg',
mp3: 'http://wmkjinc.qiniudn.com/hd.mp3',
ogg: 'http://wmkjinc.qiniudn.com/hd.mp3'
},

{
title: '说谎',
artist: '林宥嘉',
album: '台湾新生代著名歌手、迷幻王子林宥嘉演唱的一首情歌，也是其最经典的情歌代表作之一。',
cover: 'http://wmkjinc.qiniudn.com/sh.jpg',
mp3: 'http://wmkjinc.qiniudn.com/sh.mp3',
ogg: 'http://wmkjinc.qiniudn.com/sh.mp3'
},

{
title: '走狗',
artist: '周柏豪',
album: '一个男人内心的呼唤。卖力讨好你令我变了你的狗，若我走，终于忍够。',
cover: 'http://wmkjinc.qiniudn.com/zg.jpg',
mp3: 'http://wmkjinc.qiniudn.com/zg.mp3',
ogg: 'http://wmkjinc.qiniudn.com/zg.mp3'
},

{
title: '听海',
artist: '张惠妹',
album: '风靡一时的伤感流行情歌，现在每逢听起来还是那么有味道。',
cover: 'http://wmkjinc.qiniudn.com/th.jpg',
mp3: 'http://wmkjinc.qiniudn.com/th.mp3',
ogg: 'http://wmkjinc.qiniudn.com/th.mp3'
},

{
title: '领悟',
artist: '辛晓琪',
album: '每将这首歌翻出来听时，才发现，曾经这首歌离自己很近很近......',
cover: 'http://wmkjinc.qiniudn.com/lw.jpg',
mp3: 'http://wmkjinc.qiniudn.com/lw.mp3',
ogg: 'http://wmkjinc.qiniudn.com/lw.mp3'
},


];

	// Load playlist
	for (var i=0; i<playlist.length; i++){
		var item = playlist[i];
		$('#playlist').append('<li>'+item.artist+' - '+item.title+'</li>');
	}

	var time = new Date(),
		currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
		trigger = false,
		audio, timeout, isPlaying, playCounts;

	var play = function(){
		audio.play();
		$('.playback').addClass('playing');
		timeout = setInterval(updateProgress, 500);
		isPlaying = true;
	}

	var pause = function(){
		audio.pause();
		$('.playback').removeClass('playing');
		clearInterval(updateProgress);
		isPlaying = false;
	}

	// Update progress
	var setProgress = function(value){
		var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
			ratio = value / audio.duration * 100;

		$('.timer').html(parseInt(value/60)+':'+currentSec);
		$('.progress .pace').css('width', ratio + '%');
		$('.progress .slider a').css('left', ratio + '%');
	}

	var updateProgress = function(){
		setProgress(audio.currentTime);
	}

	// Progress slider
	$('.progress .slider').slider({step: 0.1, slide: function(event, ui){
		$(this).addClass('enable');
		setProgress(audio.duration * ui.value / 100);
		clearInterval(timeout);
	}, stop: function(event, ui){
		audio.currentTime = audio.duration * ui.value / 100;
		$(this).removeClass('enable');
		timeout = setInterval(updateProgress, 500);
	}});

	// Volume slider
	var setVolume = function(value){
		audio.volume = localStorage.volume = value;
		$('.volume .pace').css('width', value * 100 + '%');
		$('.volume .slider a').css('left', value * 100 + '%');
	}

	var volume = localStorage.volume || 0.5;
	$('.volume .slider').slider({max: 1, min: 0, step: 0.01, value: volume, slide: function(event, ui){
		setVolume(ui.value);
		$(this).addClass('enable');
		$('.mute').removeClass('enable');
	}, stop: function(){
		$(this).removeClass('enable');
	}}).children('.pace').css('width', volume * 100 + '%');

	$('.mute').click(function(){
		if ($(this).hasClass('enable')){
			setVolume($(this).data('volume'));
			$(this).removeClass('enable');
		} else {
			$(this).data('volume', audio.volume).addClass('enable');
			setVolume(0);
		}
	});

	// Switch track
	var switchTrack = function(i){
		if (i < 0){
			track = currentTrack = playlist.length - 1;
		} else if (i >= playlist.length){
			track = currentTrack = 0;
		} else {
			track = i;
		}

		$('audio').remove();
		loadMusic(track);
		if (isPlaying == true) play();
	}

	// Shuffle
	var shufflePlay = function(){
		var time = new Date(),
			lastTrack = currentTrack;
		currentTrack = time.getTime() % playlist.length;
		if (lastTrack == currentTrack) ++currentTrack;
		switchTrack(currentTrack);
	}

	// Fire when track ended
	var ended = function(){
		pause();
		audio.currentTime = 0;
		playCounts++;
		if (continous == true) isPlaying = true;
		if (repeat == 1){
			play();
		} else {
			if (shuffle === 'true'){
				shufflePlay();
			} else {
				if (repeat == 2){
					switchTrack(++currentTrack);
				} else {
					if (currentTrack < playlist.length) switchTrack(++currentTrack);
				}
			}
		}
	}

	var beforeLoad = function(){
		var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
		$('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
	}

	// Fire when track loaded completely
	var afterLoad = function(){
		if (autoplay == true) play();
	}

	// Load track
	var loadMusic = function(i){
		var item = playlist[i],
			newaudio = $('<audio>').html('<source src="'+item.mp3+'"><source src="'+item.ogg+'">').appendTo('#player');
		
		$('.cover').html('<img src="'+item.cover+'" alt="'+item.album+'">');
		$('.tag').html('<strong>'+item.title+'</strong><span class="artist">'+item.artist+'</span><span class="album">'+item.album+'</span>');
		$('#playlist li').removeClass('playing').eq(i).addClass('playing');
		audio = newaudio[0];
		audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
		audio.addEventListener('progress', beforeLoad, false);
		audio.addEventListener('durationchange', beforeLoad, false);
		audio.addEventListener('canplay', afterLoad, false);
		audio.addEventListener('ended', ended, false);
	}

	loadMusic(currentTrack);
	$('.playback').on('click', function(){
		if ($(this).hasClass('playing')){
			pause();
		} else {
			play();
		}
	});
	$('.rewind').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(--currentTrack);
		}
	});
	$('.fastforward').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(++currentTrack);
		}
	});
	$('#playlist li').each(function(i){
		var _i = i;
		$(this).on('click', function(){
			switchTrack(_i);
		});
	});

	if (shuffle === 'true') $('.shuffle').addClass('enable');
	if (repeat == 1){
		$('.repeat').addClass('once');
	} else if (repeat == 2){
		$('.repeat').addClass('all');
	}

	$('.repeat').on('click', function(){
		if ($(this).hasClass('once')){
			repeat = localStorage.repeat = 2;
			$(this).removeClass('once').addClass('all');
		} else if ($(this).hasClass('all')){
			repeat = localStorage.repeat = 0;
			$(this).removeClass('all');
		} else {
			repeat = localStorage.repeat = 1;
			$(this).addClass('once');
		}
	});

	$('.shuffle').on('click', function(){
		if ($(this).hasClass('enable')){
			shuffle = localStorage.shuffle = 'false';
			$(this).removeClass('enable');
		} else {
			shuffle = localStorage.shuffle = 'true';
			$(this).addClass('enable');
		}
	});
})(jQuery);