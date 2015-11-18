(function() {
	if (window.MouseEvent && ! window.tappy){
		var tapInProgress;
		document.addEventListener("click", function(e){
			if(e.isTrusted){
				simulateEvent(e.srcElement, "nontapclick");
			}
		});
		document.addEventListener("touchstart", function(e){
			e.preventDefault();
			var clickDefaultAllowed = simulateEvent(e.srcElement, "click");
			tapInProgress = {
				"el" : e.srcElement,
				"time" : new Date,
				"clickDefaultAllowed" : clickDefaultAllowed
			}
		}, true);

		document.addEventListener("touchend", function(){
			if(tapInProgress && (new Date) - tapInProgress.time <= 200 ){
				simulateEvent(tapInProgress.el, "tap", {
					"clickDefaultAllowed" : tapInProgress.clickDefaultAllowed
				});
				tapInProgress = null;
			} 
		}, true);

		function simulateEvent(el, evType, ext) {
			var event = new MouseEvent(evType, {
				"view": window,
				"bubbles": true,
				"cancelable": true
			}); 
			if(ext){
				_.extend(event, ext);
			}
			return el.dispatchEvent(event);
		}
		window.tappy = true;
	}
})();