/*
	・読み込むスクリプトファイルのパスを src="～" の部分に書いていきます。
	・使用するファイルはまとめて適当な場所に置いてください。
	・jquery.min.js は、HTMLから直接読み込んでください。

	※HTML に書くときはこんな感じ
	------------------------------------------------
	<script type="text/javascript" src="http://example.com/js/jquery.min.js"></script>
	<script type="text/javascript" src="http://example.com/js/req_reel.js"></script>
	------------------------------------------------
*/

// Reel のデフォルトオプション設定
call_reel.defaults = {
		opening: 2.66,	// 開いたときだけアニメーションするなら、その間の秒数
		entry:   0.75,	// "opening"で開いたときの周波数："2"なら1秒間に2回転

//		speed:   0.4,	// 周波数：数字を入れると自動で動く。"2"なら1秒間に2回転
//		delay:   1.0,	// 最初の待ち時間

		preloader: 15,	// Loading 状況のバーの高さ（px）
		cw: true,	// false: →ドラッグで順方向、true: ←ドラッグで順方向
'':''};

// myZoom のデフォルトオプション設定
call_reel.zoom_defaults = {
	def: 1,	// デフォルトのズーム
	max: 3.2,	// ズームの最大値
	min: 1,	// ズームの最小値
	up:   1.25,	// 拡大率
	down: 0.8,	// 縮小率
	xup:    0,	// ダブルクリックの時の拡大率（0: upと同じ）
	xdown:  0,	// 右クリックの時の拡大率（0: downと同じ）
	def_x: 0,	// デフォルトの拡大率（def）を指定した時のX基準点（0:自動・中心）
	def_y: 0,	// デフォルトの拡大率（def）を指定した時のY基準点（0:自動・上1/8）
'':''};

// スクリプトファイルのフォルダ
var jsDir = './';

// jquery.mousewheel.min.js (マウスホイールイベント用スクリプト)
document.write('<script type="text/javascript" src="'+ jsDir +'jquery_mousewheel.js"><'+'\/script>\n');

// jquery.reel.js (画像360度回転用スクリプト)
document.write('<script type="text/javascript" src="'+ jsDir +'jquery_reel.js"><'+'\/script>\n');

// jquery.myzoom.js (画像ズーム用スクリプト)
document.write('<script type="text/javascript" src="'+ jsDir +'jquery_myzoom.js"><'+'\/script>\n');

// myreel.css (画像360度回転用スタイルシート)
document.write('<link rel="stylesheet" type="text/css" href="'+ jsDir +'myreel.css" media="all" />\n');

// reel 呼び出し用のスクリプトの説明
/*
	HTMLから↓こんな感じで呼び出し（ブログに貼るときは 1行にしてもOK）

	●連番の画像の場合
	--------------------------------
	<script type="text/javascript">
		ready_reel('#image_id', 60, 'http://example.com/images/image_###.jpg');
	</script>
	--------------------------------
	※ready_reel('任意の画像の要素のID', frames[フレーム数（数字で）], images[連番の画像のURLの表現か配列]

	●連結した画像の場合
	--------------------------------
	<script type="text/javascript">
		ready_reel('#image_id', 60, 10);
	</script>
	--------------------------------
	※ready_reel('任意の画像の要素のID', frames[フレーム数（数字で）], footage（連結した画像の 1行の枚数を数字で)

	●その他の reel のオプションを指定したいとき
	--------------------------------
	<script type="text/javascript">
		ready_reel('#image_id', 60, 10, { opening: 2, entry: 0.5 });
	</script>
	--------------------------------
	※ready_reel('任意の画像の要素のID', (略), (略), { reel のオプション設定 });

	●同時にズームを使いたいとき
	--------------------------------
	<script type="text/javascript">
		ready_reel_zoom('#image_id', 60, './image_###.jpg');
	</script>
	--------------------------------
	※"ready_reel" の部分を "ready_reel_zoom" にすれば OK です。
	※ズームが使えるのは、連番の画像の場合に限ります。

	●ズームのオプションを指定したいとき
	--------------------------------
	<script type="text/javascript">
		ready_reel('#image_id', 60, './image_###.jpg', {}, { def: 2, max: 10, min: 1 });
	</script>
	--------------------------------
	※ready_reel('任意の画像の要素のID', (略), (略), { reel のオプション設定 }, { zoom のオプション設定 });
	※オプションを指定する場合は "ready_reel" でも "ready_reel_zoom" でも OK です。

	●その場ですぐ reel を呼び出したいとき
	--------------------------------
	<script type="text/javascript">
		call_reel('#image_id', 60, 10);
	</script>
	--------------------------------
	※"ready_reel" は $(document).ready(function () { call_reel(～) }) をしているだけです。
*/

// reel を呼び出し
function call_reel (selector, _frames, _images, options, zoom_options) {
	// 画像要素
	var $obj = selector && $(selector);
	if (!$obj || $obj.length == 0) return;

	// 既定のオプション（reel）
	var defaults = {
//		opening: 2.66,	// 開いたときだけアニメーションするなら、その間の秒数
//		entry:   0.75,	// "opening"で開いたときの周波数："2"なら1秒間に2回転
//		speed:   0.4,	// 周波数：数字を入れると自動で動く。"2"なら1秒間に2回転
//		delay:   1.0,	// 最初の待ち時間
//		preloader: 5,	// Loading 状況のバーの高さ（px）
//		cw: true,	// false: →ドラッグで順方向、true: ←ドラッグで順方向

//		wheelable: false,	// マウスホイールでリールするか
//		steppable: false,	// マウスクリックでリールするか
//		frames: 36,	// フレーム数＝画像の枚数。
//		images: 'image_###.jpg' // 画像のパス
			// ※"###"は連番の数字が入る、桁数のワイルドカード。連番は 1 からスタート
	'':''};

	// 既定のオプション（myzoom）
	var zoom_defaults = {
//		def: 1,	// デフォルトのズーム
//		max: 4,	// ズームの最大値
//		min: 1,	// ズームの最小値
//		width:  0,	// 画像の横幅のサイズ（0: 自動取得）
//		height: 0,	// 画像の高さのサイズ（0: 自動取得）
	'':''};

	// 設定
	var op      = $.extend({},      defaults, call_reel.defaults,           options || {});
	var zoom_op = $.extend({}, zoom_defaults, call_reel.zoom_defaults, zoom_options || {});

	// 同時にズームを使うか
	var is_zoom = !!zoom_options;
	if (is_zoom) {	// ズーム時の強制設定
		op.wheelable = false;	// マウスホイールでリールしない
		op.steppable = false;	// マウスクリックでリールしない
	}

	// frames, images, footage を上書き
	if (_frames) op.frames = _frames;
	if (_images) {
		if (typeof _images == 'number') op.footage = _images;	// footage
		else op.images = _images;	// images
	}

	// reel を呼び出し
	$obj.reel(op);

	// myZoom を呼び出し
	if (is_zoom) $obj.myZoom(zoom_op);

	// Firefox と 旧Opera における Reel のちらつき対策
	var agent = window.navigator.userAgent || '';
	if ((agent.match(/firefox|gecko/i) && !agent.match(/chrome/i) || window.opera) && (op.image || op.images)) {
		$obj.each(function () {
			var $this = $(this);
			$this.css({
				'background-repeat': 'no-repeat',
				'background-size': 'contain',
				'background-image': 'url('+ $this.attr('src') +')'
			});
		}).on('load', function () {
			var $this = $(this);
			$this.css({
				'background-image': 'url('+ $this.attr('src') +')'
			});
		});
	}
}

// ズーム付きで呼び出し
// .. 単にズーム用オプションを空にしないだけ
function call_reel_zoom (selector, _frames, _images, options, zoom_options) {
	call_reel.call(this, selector, _frames, _images, options, zoom_options || {});
}

// 読み込み完了時に call_reel を呼び出し
function ready_reel (selector, _frames, _images, options, zoom_options) {
	$(function () { call_reel.call(this, selector, _frames, _images, options, zoom_options); });
}

// 読み込み完了時に call_reel_zoom を呼び出し
function ready_reel_zoom (selector, _frames, _images, options, zoom_options) {
	$(function () { call_reel.call(this, selector, _frames, _images, options, zoom_options || {}); });
}
