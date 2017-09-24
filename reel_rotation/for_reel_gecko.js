$(function () {
	function for_reel_gecko () {
		// Firefox と 旧Opera における Reel のちらつき対策（背景追加）
		var agent = window.navigator.userAgent || '';
		if (agent.match(/firefox|gecko/i) && !agent.match(/chrome/i) || window.opera) {
			$('div.reel-overlay img.reel').each(function () {
				var $this = $(this);
				if ($this.data('set_reel_gecko')) return;	// 設定済ならスキップ
					$this.data('set_reel_gecko', true);

				$this.css({
					'background-repeat': 'no-repeat',
					'background-size': 'contain',
					'background-image': 'url('+ $this.attr('src') +')'
				});
				$this.on('load', function () {
					var $this = $(this);
					$this.css({
						'background-image': 'url('+ $this.attr('src') +')'
					});
				});
			});
		}
	}

	// 実行
	for_reel_gecko();	// すぐに
	setTimeout(for_reel_gecko, 100);	// 0.1秒後に
	$(window).on('load', for_reel_gecko);	// ページの読み込みが完了した時に
});
