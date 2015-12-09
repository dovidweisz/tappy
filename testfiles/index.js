(function(){
	
	Array.prototype.forEach.call(document.querySelectorAll(".tapme"), function(domNode, index) {
		new TapMe(domNode, index % 2 === 0);
	});
	function TapMe(domNode, preventDefault) {
		//domNode = domNode;
		this.setActiveStatus = function(active) {
			domNode.innerHTML = (active ? "" : "not ") + "active";
			domNode.innerHTML += "<button>Try Me</button>";
			domNode.className = active ? "tapme active" : "tapme";
		};
		domNode.addEventListener("tap",setActive.bind(this));
		function setActive (e) {
			this.setActiveStatus(true);
			new Tappy.EventOffListener(domNode, "tap", setInactive, this, e);
			if(preventDefault){
				e.preventDefault();
			}
		}
		function setInactive () {
			this.setActiveStatus(false);
		}
	}


})();