// croppie : http://foliotek.github.io/Croppie/

function RG_Thumbnail() {

	this.name = 'Make thumbnail';

	var self = this;
	var app = null;
	var RESIZE_EVENT = 'resize.rgUploader';
	var isMobile = false;
	var resizeInterval = null;

	this.file = null;
	this.croppie = null;
	this.$el = {
		con : null,
		wrap : null,
		bg : null,
		figure : null,
		meta : null,
		btn_close : null,
		btn_done : null
	};
	this.option = {
		width : 640,
		height : 480,
		mobileSize : 640,
		uploadScript : './script/upload_base64.php',
		output : {
			type : 'canvas',
			quality : .3,
			format : 'jpeg',
			size : { width : 150, height : 150 }
		},
		croppie : {
			boundary : { width: 640, height: 480-60 },
			viewport : { width: 150, height: 150, type: 'square' }
		}
	};


	/**
	 * load external vendor files
	 */
	function loadExternalFiles()
	{
		if (window.loadedCroppie) return false;

		var head = document.getElementsByTagName('head')[0];
		var cssEl = document.createElement('link');
		var scriptEl = document.createElement('script');

		cssEl.rel = 'stylesheet';
		cssEl.href = '../vendor/croppie/croppie.css';
		scriptEl.src = '../vendor/croppie/croppie.min.js';

		head.appendChild(cssEl);
		head.appendChild(scriptEl);

		window.loadedCroppie = true;
	}

	/**
	 * create container
	 */
	function createContainer()
	{
		// set elements
		self.$el.con = $('<div class="rg-plugin-thumbnail">' +
			'<span class="bg"></span>' +
			'<div class="wrap">' +
			'<div class="img-wrap"><figure></figure></div>' +
			'<div class="body">' +
			'<div class="meta"><p>message</p></div>' +
			'<nav>' +
			'<button type="button" class="btn-done"><i class="material-icons">done</i></button>' +
			'<button type="button" class="btn-close"><i class="material-icons">close</i></button>' +
			'</nav>' +
			'</div>' +
			'</div>' +
			'</div>');
		self.$el.wrap = self.$el.con.children('.wrap');
		self.$el.bg = self.$el.con.children('.bg');
		self.$el.figure = self.$el.con.find('.img-wrap figure');
		self.$el.meta = self.$el.con.find('.meta > p');
		self.$el.btn_done = self.$el.con.find('.btn-done');
		self.$el.btn_close = self.$el.con.find('.btn-close');

		// insert element
		$('body').append(self.$el.con);
	}

	/**
	 * init events
	 */
	function initEvents()
	{
		// close in background
		self.$el.bg.on('click', function(){
			self.close();
		});

		// close in close button
		self.$el.btn_close.on('click', function(){
			self.close();
		});

		// done
		self.$el.btn_done.on('click', done);

		// init resize event
		$(window).on(RESIZE_EVENT, resize);
	}

	/**
	 * change mobile
	 */
	function actMobile(pass)
	{
		if (!pass && isMobile) return false;

		// set isMobile
		isMobile = true;

		// change window size
		self.$el.wrap
			.width('100%').height('100%')
			.css({ marginLeft : 0, marginTop : 0, left: 0, top: 0 });

		// rebuild croppie
		if (self.croppie)
		{
			rebuildCroppie(true);
		}
	}

	/**
	 * change desktop
	 */
	function actDesktop(pass)
	{
		if (!pass && !isMobile) return false;

		// set isMobile
		isMobile = false;

		// change window size
		self.$el.wrap
			.width(self.option.width).height(self.option.height)
			.css({
				marginLeft : (0 - self.option.width * 0.5) + 'px',
				marginTop : (0 - self.option.height * 0.5) + 'px',
				left: '50%',
				top: '50%'
			});

		// rebuild croppie
		if (self.croppie)
		{
			rebuildCroppie(true);
		}
	}

	/**
	 * resize event
	 *
	 * @Param {Object} e
	 */
	function resize(e)
	{
		var $win = $(window);

		if (!self.croppie)
		{
			clearTimeout(resizeInterval);
			return false;
		}

		if (resizeInterval)
		{
			clearTimeout(resizeInterval);
		}

		resizeInterval = setTimeout(function(){
			// 계속 모바일 사이즈상태일때 실행
			if (isMobile && ($win.width() < 640))
			{
				actMobile(true);
				return false;
			}
			if ($win.width() < 640)
			{
				actMobile(true);
			}
			else if ($win.width() > 640)
			{
				actDesktop(true);
			}
		}, 300);
	}

	/**
	 * rebuild croppie
	 *
	 * @Param {Boolean} isResize
	 */
	function rebuildCroppie(isResize)
	{
		// save option
		var save = (isResize) ? self.croppie.get() : {};

		// destroy croppie
		destroyCroppie();

		// build croppie
		self.option.croppie.boundary = {
			width : (self.option.mobileSize > $(window).width()) ? $(window).width() : self.option.width,
			height : ((self.option.mobileSize > $(window).width()) ? $(window).height() : self.option.height)-60
		};
		self.croppie = new Croppie(self.$el.figure.get(0), self.option.croppie);

		// bind croppie
		if (isResize)
		{
			self.croppie.bind({
				url : self.file.src,
				points : save.points
			});
			self.croppie.setZoom(save.zoom);
		}
	}

	/**
	 * destroy croppie
	 */
	function destroyCroppie()
	{
		if (self.croppie)
		{
			self.croppie.destroy();
			self.croppie = null;
		}
	}

	/**
	 * done event
	 *
	 * @Param {Object} e
	 */
	function done(e)
	{
		// result
		self.croppie.result(self.option.output).then(function(res){
			if (self.option.uploadScript)
			{
				$.post(
					self.option.uploadScript,
					{
						name : self.file.name,
						image : res,
						id : app.util.getUniqueNumber()
					},
					function(res){
						try {
							res = JSON.parse(res);
						} catch (e) {
							alert('parse error');
							return false;
						}
						if (res.state == 'error')
						{
							alert(res.response.message);
							return false;
						}

						// import thumnail
						app.queue.import([res.response]);
					});
			}
			else
			{
				app.queue.import([{
					id : app.util.getUniqueNumber(),
					name : 'thumb-' + self.file.name,
					src : res,
					type : 'image/' + self.option.output.format,
					size : 0
				}]);
			}

			// close
			self.close();
		});
	}


	/**
	 * init
	 *
	 * @Param {Object} parent
	 */
	this.init = function(parent)
	{
		app = parent;

		// load files
		loadExternalFiles();

		// create container
		createContainer();

		// init events
		initEvents();
	};

	/**
	 * open window
	 *
	 * @Param {Object} obj
	 */
	this.open = function(obj)
	{
		// show window
		this.$el.con.addClass('show');
		$('html').addClass('rg-popup');

		// set file value
		this.file = obj;

		// act pc & mobile
		if ($(window).width() < this.option.mobileSize)
		{
			actMobile(true);
		}
		else
		{
			actDesktop(true);
		}

		// rebuild croppie
		rebuildCroppie();
		// bind image
		this.croppie.bind({ url : this.file.src });

		// input state
		this.$el.meta.text('output size: ' + this.option.output.size.width + '*' + this.option.output.size.height);
	};

	/**
	 * close window
	 */
	this.close = function()
	{
		destroyCroppie();
		this.file = null;
		this.$el.con.removeClass('show');
		$('html').removeClass('rg-popup');
	};

	/**
	 * assignOption
	 *
	 * @Param {Object} obj
	 */
	this.assignOption = function(obj)
	{
		this.option = $.extend({}, this.option, obj);
	}
}