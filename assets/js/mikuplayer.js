/* STUDY WITH MIKU
	CORE FUNCTION
   V1.0.14 2025.04.20 */

var version = "V1.0.14";

$(function () {
	if (window.localStorage) {
		util.init();
	} else {
		$(".ok").fadeOut(300, "linear");
		$("#ng").fadeIn(300, "linear");
	}
});
class valueStore {
	constructor() {
		this.Umami = {};
	}
};
const store = new valueStore();
var util = {
	init: function () {
		$(window).resize(util.videoresize);
		$("#bt_fs").fadeIn(300, "linear");
		$("#scene_top").fadeIn(300, "linear");
		$(".aplayer-icon-lrc").trigger('click');
		util.initTips("hitokoto");
		util.initTips("studytime");
		util.initTips("worldtime");
		util.musicset.init();
		util.initClickEvent();
		util.initStrictMode();
		util.initWorldTimer();
		util.readstoragetime();
		util.initUmami();
		util.initParams();
	},
	initParams: function () {
		if (util.getUrlParams("type")) {
			ufunction.track(util.getUrlParams("type"));
		}
		if (util.getUrlParams("mode") == "study") {
			lauched = 1;
			study();
			ufunction.track('Study');
		} else if (util.getUrlParams("mode") == "strict") {
			lauched = 2;
			util.addVisibilityListener();
			study();
			ufunction.track('Study');
		}
		function study() {
			util.study();
			// setTimeout(function () { $('.aplayer-play').trigger('click'); util.videoresize(); }, 500);
			// setTimeout(function () { $('.aplayer-play').trigger('click'); util.videoresize(); }, 1000);
			// setTimeout(function () { $('.aplayer-play').trigger('click'); util.videoresize(); }, 1500);
			// setTimeout(function () { $('.aplayer-play').trigger('click'); util.videoresize(); }, 2000);
		}
	},
	initClickEvent: function () {
		$("#bt_fs").on('click', function () {
			util.fullscreen();
		});
		$("#btt_strict").on('click', function () {
			util.switchStrictMode();
		});
		$("#btt_start").on('click', function () {
			if (util.checkStrictMode()) {
				util.addVisibilityListener();
			}
			util.study();
		});
		$("#btt_setting").on('click', function () {
			util.menuopen("menu");
		});
		$("#btt_menu_music").on('click', function () {
			util.musicset.open();
		});
		$("#btt_about").on('click', function () {
			util.menuopen("about");
			util.getUmami.GetAll();
		});
		$("#bt_rest").on('click', function () {
			util.timerecord.pause();
			util.menuopen("rest");
			util.getUmami.OnlineUser();
			$('.aplayer-pause').trigger('click');
		});
		$('#bt_restclose').on('click', function () {
			$('.aplayer-play').trigger('click');
			util.timerecord.start();
		});
		$("#bt_musicswitch").on('click', function () {
			$(".aplayer-button").trigger("click");
		});
		$("#about_cover").on('click', function () {
			$("#about").fadeOut(300, "linear");
			$("#about_cover").fadeOut(300, "linear");
			$("#scene_top").fadeIn(300, "linear");
		});
		$("#menu_cover").on('click', function () {
			$("#menu").fadeOut(300, "linear");
			$("#menu_cover").fadeOut(300, "linear");
			$("#scene_top").fadeIn(300, "linear");
		});
	},
	menuopen: function (e) {
		$("#" + e).fadeIn(300, "linear");
		$("#" + e + "_cover").fadeIn(300, "linear");
		$("#bt_" + e + "close").on('click', function () {
			$("#" + e).fadeOut(300, "linear");
			$("#" + e + "_cover").fadeOut(300, "linear");
		});
	},
	getUrlParams: function (key) {
		var url = window.location.search.substr(1);
		if (url == '') {
			return false;
		}
		var paramsArr = url.split('&');
		for (var i = 0; i < paramsArr.length; i++) {
			var combina = paramsArr[i].split("=");
			if (combina[0] == key) {
				return combina[1];
			}
		}
		return false;
	},
	//APlayer START
	readMusicconf: function (n) {
		let stat = localStorage.getItem("conf_music_" + n);
		return stat;
	},
	musicset: {
		init: function () {
			if (util.readMusicconf('platform') == null || util.readMusicconf('id') == null) {
				util.musicset.reset();
			}
			util.musicset.apply();

			$('#btt_platform_netease').on('click', function () {
				localStorage.setItem("conf_music_platform", "netease");
				util.musicset.load();
			});
			$('#btt_platform_tencent').on('click', function () {
				localStorage.setItem("conf_music_platform", "tencent");
				util.musicset.load();
			});
			$('#btt_platform_kugou').on('click', function () {
				localStorage.setItem("conf_music_platform", "kugou");
				util.musicset.load();
			});
			$('#btt_music_reset').on('click', function () { util.musicset.reset(); });
			$('#btt_music_submit').on('click', function () { util.musicset.apply(); });
			$('input').on('input', function () {
				var value = $(this).val().replace(/[^\d]/g, '');
				localStorage.setItem("conf_music_id", value);
				util.musicset.load();
			});
		},
		load: function () {
			$('#musicconf').fadeOut(50, 'linear');
			switch (util.readMusicconf('platform')) {
				case 'netease':
					$('#nowplatform').text('网易云音乐');
					break;
				case 'tencent':
					$('#nowplatform').text('QQ音乐');
					break;
				case 'kugou':
					$('#nowplatform').text('酷狗音乐');
					break;
			}
			$('#nowid').text(util.readMusicconf('id'));
			$('input').attr('value', util.readMusicconf('id'));
			$('input').val(util.readMusicconf('id'));
			$('#musicconf').fadeIn(50, 'linear');
		},
		open: function () {
			$("#music").fadeIn(300, "linear");
			$("#top_cover").fadeIn(300, "linear");
			$("#bt_musicclose").on('click', function () {
				$("#music").fadeOut(300, "linear");
				$("#top_cover").fadeOut(300, "linear");
			});
		},
		reset: function () {
			localStorage.setItem("conf_music_platform", "netease");
			localStorage.setItem("conf_music_id", "8611769328");
			util.musicset.load();
			util.musicset.apply();
		},
		apply: function () {
			util.musicset.load();
			$('meting-js').remove();
			$('#bt_fs').after('<meting-js server="' + util.readMusicconf('platform') + '" type="playlist" id=' + util.readMusicconf('id') + ' fixed="true" theme="#39c5bb" order="random" mutex="true" lrc-type="0"> </meting-js>');
			util.AplayerInteraction();
		}
	},
	AplayerInteraction: async function () {
		if (!$(".aplayer").length) { setTimeout(util.AplayerInteraction, 500); return; }
		$('.aplayer-miniswitcher button').on('click', function () {
			$('.aplayer-list').addClass('aplayer-list-hide');
			if ($('.aplayer').hasClass('aplayer-narrow')) {
				$('#player_back').addClass('show');
			} else {
				$('#player_back').removeClass('show');
			}
		});
		$("#player_back").on('click', function () {
			if (!$('.aplayer-list').hasClass('aplayer-list-hide')) {
				$('.aplayer-list').addClass('aplayer-list-hide');
			} else if (!$('.aplayer').hasClass('aplayer-narrow')) {
				$('.aplayer-miniswitcher button').click();
			}
		});
	},
	//APlayer END
	//Umami START
	getUmami: {
		OnlineUser: async function () {
			// console.log("Get OnlineUser");
			$.get({
				url: store.Umami.apiurl + 'active',
				headers: store.Umami.headers,
				success: function (data) {
					store.Umami.count_online.update(data['x']);
					store.Umami.count_online2.update(data['x']);
				},
				error: function () {
					setTimeout(util.getUmami.OnlineUser, 5000);
				},
				timeout: function () {
					setTimeout(util.getUmami.OnlineUser, 5000);
				}
			});
		},
		GetEvents: async function () {
			// console.log("Get Events");
			let end_time = new Date().getTime();
			$.get({
				url: store.Umami.apiurl + 'metrics' + '?startAt=1691596800000&endAt=' + end_time + '&type=event',
				headers: store.Umami.headers,
				success: function (data) {
					s = 0;
					while (data[s]['x'] != "Study") {
						if (data[s + 1] == null) {
							break;
						}
						s++;
					}
					store.Umami.count_studytimes.update(data[s]['y']);
				},
				error: function () {
					setTimeout(util.getUmami.GetEvents, 5000);
				},
				timeout: function () {
					setTimeout(util.getUmami.GetEvents, 5000);
				}
			});
		},
		GetVV: async function () {
			// console.log("Get VV");
			let end_time = new Date().getTime();
			$.get({
				url: store.Umami.apiurl + 'stats' + '?startAt=1691596800000&endAt=' + end_time,
				headers: store.Umami.headers,
				success: function (data) {
					store.Umami.count_visitor.update(data['visitors']['value']);
				},
				error: function () {
					setTimeout(util.getUmami.GetVV, 5000);
				},
				timeout: function () {
					setTimeout(util.getUmami.GetVV, 5000);
				}
			});
		},
		GetAll: async function () {
			this.OnlineUser();
			this.GetEvents();
			this.GetVV();
		}
	},
	initUmami: async function () {
		const options = {
			useGrouping: false,
		};
		let count_online = new countUp.CountUp('umami_value_onlineuser', 0, options);
		let count_online2 = new countUp.CountUp('umami_value_onlineuser2', 0, options);
		let count_studytimes = new countUp.CountUp('umami_value_studytimes', 0, options);
		let count_visitor = new countUp.CountUp('umami_value_visitors', 0, options);
		const webid = "b91d816b-91e7-4974-ba3d-ccb61dbecfd6",
			apiurl = "https://umami.wenqi.icu/api/websites/" + webid + "/",
			headers = {
				'Authorization': 'Bearer EJfpKblh2tLICYqBUDDs2eA/vd41CeoMtZpsZhrM5W6YkUyCJH/Dg64XEZp83nCVlIqgr8E2+oEeHL8HRSOf0lMsnHTdvsBsn/3rCSPXDI3kDmMBkG1m38JNIArp6Q1gaX6oZWDTph5H6KESaW4tKIhvwo7uaoFrU7OYDgZUG+YA8x41DZq+8HtAkdhJazAGIvyf2HYFRxZEHNb2tCkm2fwxDekKxnp91PYzZvpY0FoRtjKzq6znHmryoE4J42t8OFHv3g6oz/fFNN6RIXsPn9Nvlvr05qNlCNg5k3Iet+b3AkQPrxSpc2oTsvQPkpgctg1C/fYDs53+S8wMB+B4FtPmxn8vtQZnMw==',
				'Access-Control-Allow-Origin': '*'
			};

		Object.defineProperties(store.Umami, {
			count_online: {
				value: count_online
			},
			count_online2: {
				value: count_online2
			},
			count_studytimes: {
				value: count_studytimes
			},
			count_visitor: {
				value: count_visitor
			},
			apiurl: {
				value: apiurl
			},
			headers: {
				value: headers
			}
		});
		this.getUmami.OnlineUser();
		this.getUmami.GetEvents();
		this.getUmami.GetVV();
	},
	//Umami END
	study: function () {
		$('.aplayer-play').trigger('click');
		$("#scene_top").fadeOut(300, "linear");
		$("#scene_learning").fadeIn(300, "linear");
		$("#bt_rest").fadeIn(300, "linear");
		$("video").trigger("play");
		this.videoresize();
		this.Tips.init();
		this.timerecord.start();
		$("#bt_stop").on('click', function () {
			util.timerecord.stop();
			util.Tips.stop();
			$('.aplayer-pause').trigger('click');
			$("#scene_top").fadeIn(300, "linear");
			$("#scene_learning").fadeOut(300, "linear");
			$("#bt_rest").fadeOut(300, "linear");
			$("#rest").fadeOut(300, "linear");
			$("#rest_cover").fadeOut(300, "linear");
			lauched = 0;
		});
	},
	//Timer BEGIN
	timerecord: {
		start: function () {
			clearInterval(time);
			clearInterval(resttime);
			if (!recorded) {
				hour = minutes = seconds = rhour = rminutes = rseconds = 0;
				$('#time').text(seconds + "秒钟了");
				$('#resttime').text(rseconds + "秒钟了");
				recorded = 1;
			}
			util.timer();
		},
		stop: function () {
			clearInterval(time);
			clearInterval(resttime);
			if (recorded) {
				var m = h = 0;
				sumseconds = sumseconds + seconds;
				while (sumseconds >= 60) {
					m++;
					sumseconds = sumseconds - 60;
				}
				summinutes = summinutes + minutes + m;
				while (summinutes >= 60) {
					h++;
					summinutes = summinutes - 60;
				}
				sumhour = sumhour + hour + h;
				recorded = 0;
				util.writestoragetime();
			}
		},
		pause: function () {
			clearInterval(time);
			clearInterval(resttime);
			util.resttimer();
		}
	},
	initWorldTimer: function () {
		wtime = setInterval(function () {
			var myDate = new Date,
				s = m = h = 0;
			h = myDate.getHours();
			m = myDate.getMinutes();
			s = myDate.getSeconds();
			if (myDate.getHours() < 10) {
				h = '0' + myDate.getHours();
			}
			if (myDate.getMinutes() < 10) {
				m = '0' + myDate.getMinutes();
			}
			if (myDate.getSeconds() < 10) {
				s = '0' + myDate.getSeconds();
			}
			$("#worldtime").text(h + "时" + m + "分" + s + "秒");
			if (document.querySelector('video').readyState == 2) {
				$("video").trigger("load");
			}
			if (document.querySelector('video').paused) {
				$("video").trigger("play");
			}

		}, 1000);
	},
	timer: function () {
		var pastsDate = sDate = pastmDate = mDate = pasthDate = hDate = 0;
		time = setInterval(function () {
			var studytime = $("#time"),
				tipstime = $("#studytime"),
				myDate = new Date;
			sDate = myDate.getSeconds();
			mDate = myDate.getMinutes();
			hDate = myDate.getHours();
			if (sDate - pastsDate >= 1 || mDate - pastmDate >= 1 || hDate - pasthDate >= 1) {
				seconds++;
			}
			if (seconds == 60) {
				minutes++;
				seconds = 0;
			}
			if (minutes == 60) {
				hour++;
				minutes = 0;
			}
			if (minutes == '0' && hour == '0') {
				studytime.text(seconds + "秒钟啦！继续加油吧！");
			} else if (hour != '0') {
				studytime.text(hour + "小时" + minutes + "分钟" + seconds + "秒啦！好厉害！！！");
			} else {
				studytime.text(minutes + "分钟" + seconds + "秒啦！超棒！");
			} if (minutes == '0' && hour == '0') {
				tipstime.text(seconds + "秒钟");
			} else if (hour != '0') {
				tipstime.text(hour + "小时" + minutes + "分钟" + seconds + "秒");
			} else {
				tipstime.text(minutes + "分钟" + seconds + "秒");
			}
			pastsDate = sDate;
			pastmDate = mDate;
			pasthDate = hDate;
		}, 1000);
	},
	resttimer: function () {
		var pastsDate = sDate = pastmDate = mDate = pasthDate = hDate = 0;
		resttime = setInterval(function () {
			var resttime = $("#resttime"),
				myDate = new Date;
			sDate = myDate.getSeconds();
			mDate = myDate.getMinutes();
			hDate = myDate.getHours();
			if (sDate - pastsDate >= 1 || mDate - pastmDate >= 1 || hDate - pasthDate >= 1) {
				rseconds++;
			}
			if (rseconds == 60) {
				rminutes++;
				rseconds = 0;
			}
			if (rminutes == 60) {
				rhour++;
				rminutes = 0;
			}
			if (rminutes == '0' && rhour == '0') {
				resttime.text(rseconds + "秒钟了");
			} else if (rhour != '0') {
				resttime.text(rhour + "小时" + rminutes + "分钟" + rseconds + "秒了");
			} else {
				resttime.text(rminutes + "分钟" + rseconds + "秒了");
			}
			pastsDate = sDate;
			pastmDate = mDate;
			pasthDate = hDate;
		}, 1000);
	},
	readstoragetime: function () {
		if (localStorage.getItem("study") == "GetDAZE") {
			sumhour = parseInt("0x" + localStorage.getItem("studyh"));
			summinutes = parseInt("0x" + localStorage.getItem("studym"));
			sumseconds = parseInt("0x" + localStorage.getItem("studys"));
			if (summinutes == '0' && sumhour == '0') {
				$("#sumtime").text(sumseconds + "秒钟了");
			} else if (sumhour != '0') {
				$("#sumtime").text(sumhour + "小时" + summinutes + "分钟" + sumseconds + "秒了");
			} else {
				$("#sumtime").text(summinutes + "分钟" + sumseconds + "秒了");
			}
		}
	},
	writestoragetime: function () {
		localStorage.setItem("study", "GetDAZE");
		localStorage.setItem("studyh", sumhour.toString(16));
		localStorage.setItem("studym", summinutes.toString(16));
		localStorage.setItem("studys", sumseconds.toString(16));
		util.readstoragetime();
	},
	//Timer END
	//StrictMode BEGIN
	addVisibilityListener: function () {
		document.addEventListener('visibilitychange', function () {
			if (recorded && ((util.checkStrictMode() && !lauched) || lauched == 2)) {
				if (document.visibilityState === 'hidden') {
					$('#bt_rest').trigger('click');
					document.title = '摸鱼中...';
				}
				if (document.visibilityState === 'visible') {
					document.title = 'STUDY WITH MIKU';
				}
			}
		});
	},
	checkStrictMode: function () {
		let stat = localStorage.getItem("conf_strict") - '0';
		return stat;
	},
	initStrictMode: function () {
		if (util.checkStrictMode() == null) {
			localStorage.setItem("conf_strict", 0);
		} else if (util.checkStrictMode()) {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 开';
		}
	},
	switchStrictMode: function () {
		if (util.checkStrictMode()) {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 关';
			localStorage.setItem("conf_strict", 0);
		} else {
			$("#btt_strict")[0].innerText = '严格模式(离开页面自动停止): 开';
			localStorage.setItem("conf_strict", 1);
		}
	},
	//StrictMode END
	//Tips BEGIN

	//1:roll display 2:always display 3:no display 
	initTips: function (n) {
		switch (util.readTipsconf(n)) {
			case 1:
				localStorage.setItem("conf_tips_" + n, 1);
				break;
			case 2:
				localStorage.setItem("conf_tips_" + n, 2);
				$("#" + n + "_mode").text("常驻");
				break;
			case 3:
				localStorage.setItem("conf_tips_" + n, 0);
				$("#" + n + "_mode").text("隐藏");
				break;
		}
		$("#btt_mode_" + n).on('click', function () {
			util.switchTipsconf(n);
		});
	},
	readTipsconf: function (n) {
		let stat = localStorage.getItem("conf_tips_" + n) - '0';
		return stat;
	},
	//hitokoto,worldtime,studytime
	switchTipsconf: function (n) {
		if (util.readTipsconf(n) == 3) {
			localStorage.setItem("conf_tips_" + n, 1);
			$("#" + n + "_mode").text("轮换");
		} else if (util.readTipsconf(n) == 1 && n != "hitokoto") {
			localStorage.setItem("conf_tips_" + n, 2);
			$("#" + n + "_mode").text("常驻");
		} else {
			localStorage.setItem("conf_tips_" + n, 3);
			$("#" + n + "_mode").text("隐藏");
		}
	},
	Tips: {
		init: function () {
			$(".tips").html('').prepend('<p class="attention">开始认真学习/工作吧！</p>').append('<p class="hitokoto" style="display: none;">"<hitokoto id="hitokoto">获取一言中...(*/ω＼*)</hitokoto>"</p>');
			if (util.readTipsconf("worldtime") == 2) {
				$(".attention").after('<p class="worldtime" style="display: none;">现在时间是:<text id="worldtime">0分钟</text>...</p>');
				if (util.readTipsconf("studytime") == 2) {
					$(".worldtime").after('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>');
				} else {
					$(".tips").append('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>');
				}
			} else {
				if (util.readTipsconf("studytime") == 2) {
					$(".attention").after('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>');
				} else {
					$(".tips").append('<p class="studytime" style="display: none;">已经学习<text id="studytime">0分钟</text>了呢...</p>');
				}
				$(".tips").append('<p class="worldtime" style="display: none;">现在时间是:<text id="worldtime">0分钟</text>...</p>');
			}
			util.Tips.start();
		},
		start: function () {
			attentionout = setTimeout(function () {
				$(".attention").fadeOut(200, "linear");
				if (util.readTipsconf("hitokoto") == 1) {
					tipsrollnow = "hitokoto";
				} else if (util.readTipsconf("worldtime") == 1) {
					tipsrollnow = "worldtime";
				} else if (util.readTipsconf("studytime") == 1) {
					tipsrollnow = "studytime";
				}
				if (util.readTipsconf("worldtime") == 2) {
					$(".worldtime").fadeIn(300, "linear");
				}
				if (util.readTipsconf("studytime") == 2) {
					$(".studytime").fadeIn(300, "linear");
				}
				util.Tips.roll();
			}, 6000);
		},
		roll: function () {
			if (util.readTipsconf(tipsrollnow) == 1) {
				if (tipsrollnow == "hitokoto") {
					if (util.readTipsconf("worldtime") == 1) {
						tipsrollnow = "worldtime";
					} else if (util.readTipsconf("studytime") == 1) {
						tipsrollnow = "studytime";
					}
					async function fetchHitokoto() {
						const hitokoto = document.querySelector('#hitokoto');
						hitokoto.innerText = "获取一言中...(*/ω＼*)";
						const response = await fetch('https://v1.hitokoto.cn/?c=i&c=k&max_length=10');
						const {
							hitokoto: hitokotoText
						} = await response.json();
						hitokoto.innerText = hitokotoText;
					}
					fetchHitokoto();
					hitokotoin = setTimeout(function () {
						$(".hitokoto").fadeIn(300, "linear");
					}, 1300);
					hitokotoout = setTimeout(function () {
						$(".hitokoto").fadeOut(300, "linear");
					}, 8600);
				} else if (tipsrollnow == "worldtime") {
					if (util.readTipsconf("studytime") == 1) {
						tipsrollnow = "studytime";
					} else if (util.readTipsconf("hitokoto") == 1) {
						tipsrollnow = "hitokoto";
					}
					worldtimein = setTimeout(function () {
						$(".worldtime").fadeIn(300, "linear");
					}, 1300);
					worldtimeout = setTimeout(function () {
						$(".worldtime").fadeOut(300, "linear");
					}, 8600);
				} else {
					if (util.readTipsconf("hitokoto") == 1) {
						tipsrollnow = "hitokoto";
					} else if (util.readTipsconf("worldtime") == 1) {
						tipsrollnow = "worldtime";
					}
					studytimein = setTimeout(function () {
						$(".studytime").fadeIn(300, "linear");
					}, 1300);
					studytimeout = setTimeout(function () {
						$(".studytime").fadeOut(300, "linear");
					}, 8600);
				}
				rolltimeout = setTimeout(function () {
					util.Tips.roll();
				}, 10900);
			}
		},
		stop: function () {
			clearTimeout(rolltimeout);
			clearTimeout(hitokotoin);
			clearTimeout(hitokotoout);
			clearTimeout(worldtimein);
			clearTimeout(worldtimeout);
			clearTimeout(studytimein);
			clearTimeout(studytimeout);
			clearInterval(attentionout);
			$(".studytime").fadeOut(300, "linear");
			$(".hitokoto").fadeOut(300, "linear");
			$(".worldtime").fadeOut(300, "linear");
			setTimeout(function () {
				$(".attention").fadeIn(300, "linear");
			}, 300);
		}
	},

	//Tips END
	videoresize: function () {
		var ww = $(window).width(),
			wh = $(window).height(),
			vw = $("video").width(),
			vh = $("video").height();
		if (ww * 0.5625 >= wh) {
			$("video").css("height", "auto").css("width", ww).css("top", wh / 2 - $("video").height() / 2).css("left", "0");
		} else {
			$("video").css("height", wh).css("width", "auto").css("left", ww / 2 - $("video").width() / 2).css("top", "0");
		}
	},
	fullscreen: function (e) {
		util.checkFullscreen() ? document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen && document.exitFullscreen() : (e ? "string" == typeof e && (e = document.getElementById(e)) : e = document.body, e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.requestFullscreen && e.requestFullscreen());
		util.checkFullscreen() ? $("#bt_fs").text("∷全屏") : $("#bt_fs").text("∷退出全屏");
	},
	checkFullscreen: function () {
		return !!(document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement);
	}
}, hour = minutes = seconds = rhour = rminutes = rseconds = recorded = sumhour = summinutes = sumseconds = tipstype = rolltimeout = worldtimein = worldtimeout = studytimein = studytimeout = hitokotoin = hitokotoout = attentionout = tipsrollnow = lauched = 0;
console.log(`\n %c Study With Miku ${version} %c 在干什么呢(・∀・(・∀・(・∀・*) \n`, `color: #fadfa3; background: #030307; padding:5px 0;`, `background: #fadfa3; padding:5px 0; color: #000`);