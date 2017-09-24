// jQuery Zoom with mousewheel
/*
	画像のサイズを変えてズームっぽくするスクリプト。
	別途 jquery.mousewheel.js が必要です。

	・拡大： マウスホイール↑、ダブルクリック
	・縮小： マウスホイール↓、右クリック
	・移動： クリック（X座標が同じ場合）
*/

// コンストラクタ
$.fn.myZoom = function (options) {
	// プロパティ変数
	var defaults = {
		def: 1,	// ズームの既定値
		max: 4,	// ズームの最大値
		min: 1,	// ズームの最小値
		up:   1.25,	// 拡大率
		down: 0.8,	// 縮小率
		xup:    0,	// ダブルクリックの時の拡大率（0: upと同じ）
		xdown:  0,	// 右クリックの時の拡大率（0: downと同じ）
		width:  0,	// 画像の横幅のサイズ（0: 自動取得）
		height: 0,	// 画像の高さのサイズ（0: 自動取得）
		def_x: 0,	// デフォルトの拡大率（def）を指定した時のX基準点（0:自動・中心）
		def_y: 0,	// デフォルトの拡大率（def）を指定した時のY基準点（0:自動・上1/8）
	'':''};
	var op = $.extend({}, defaults, options);
	var $this = $(this);
		$this.data('zoom_options', op);

	// イベントをセット
	$this.on('mousedown', function (e) {
		// マウスを押したときに座標フラグを設定
		var $this = $(this);
		$this.data('x', e.pageX);
	}).on('mouseup', function (e) {
		// マウスを離したときに、座標が同じだったらその方向に移動
		var $this = $(this);
		if (e.pageX != $this.data('x')) return;
		$.fn.myZoom.scaler.call(this, e, 1);
	}).on('mousewheel', function (e, delta) {
		// ホイールしたとき、↑なら拡大、↓なら縮小
		$.fn.myZoom.scaler.call(this, e, delta < 0 ? op.down : delta > 0 ? op.up : 1);
		return false;
	}).on('dblclick', function (e, delta) {
		// ダブルクリックしたとき、拡大
		$.fn.myZoom.scaler.call(this, e, op.xup || op.up);
		return false;
	}).on('contextmenu', function (e, delta) {
		// 右クリックしたとき、縮小
		$.fn.myZoom.scaler.call(this, e, op.xdown || op.down);
		return false;
	});

	// デフォルトの倍率
	if (op.def && op.def != 1) {
		$this.each(function () {
			$.fn.myZoom.scaler.call(this, null, op.def);
		});
	}
};

// サイズ変更関数
$.fn.myZoom.scaler = function (e, rate) {
	var $this = $(this);
	var op = $this.data('zoom_options');

	// 画像サイズの初期値
	var  def_width  = $this.data('width');
	if (!def_width)   $this.data('width',  def_width  = $this.width()  || op.width);
	var  def_height = $this.data('height');
	if (!def_height)  $this.data('height', def_height = $this.height() || op.height);

	// スケール倍率
	var prev_scale = $this.data('scale') || op.def;
	var scale = prev_scale * rate;
	if (scale > op.max) scale = op.max;
	if (scale < op.min) scale = op.min;
	$this.data('scale', scale);

	// 新しい画像サイズ
	width  = Math.round(def_width  * scale);
	height = Math.round(def_height * scale);

	// position
	var diff = 1 - scale;
	var prev_left = parseInt( $this.data('left') || $this.css('left') ) || 0;
	var prev_top  = parseInt( $this.data('top')  || $this.css('top')  ) || 0;
	var x = e ? e.offsetX || (e.pageX - $this.offset().left) || 0 : op.def_x || Math.floor(width  / 2);
	var y = e ? e.offsetY || (e.pageY - $this.offset().top ) || 0 : op.def_y || Math.floor(height / 8);

	// 原点を中心に拡大/縮小
	var left = Math.round( x / prev_scale * diff );
	var top  = Math.round( y / prev_scale * diff );

	// マウスカーソルを中心に拡大/縮小
	if (scale != prev_scale) {
		left = Math.round( (x + prev_left) - (x / prev_scale * scale) );
		top  = Math.round( (y + prev_top)  - (y / prev_scale * scale) );
	}

	// ポジションオーバー
	if (left > 0) left = 0;  if (left < def_width  - width)  left = def_width  - width;
	if (top  > 0) top  = 0;  if (top  < def_height - height) top  = def_height - height;

	// 念のため今の値を保存
	$this.data('left', left).data('top', top);

	// スタイルを変更
	$this.stop().css({ position:'relative' })
		.animate({ left: left, top: top, width: width, height: height }, 250);

	return false;
};
