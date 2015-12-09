(function() {
	
	// tapInProgress handle can be shared between instances as they 
	var tapInProgress,
		TAPTIME = 300;

	function Tappy (node) {
		if (window.MouseEvent){
			this.init(node);
			this.node = node;
		}
	}

	Tappy.prototype.init = function(node) {
		node.addEventListener("touchstart", touchStartEvent, true);
		node.addEventListener("touchend", touchEndEvent, true);
		node.addEventListener("click", clickEvent, true);
	};

	Tappy.prototype.destroy = function() {
		this.node.removeEventListener("touchstart", touchStartEvent, true);
		this.node.removeEventListener("touchend", touchEndEvent, true);
		this.node.removeEventListener("click", clickEvent, true);
	};

	function touchStartEvent(e){
		// check for tapInProgress make sure it's not a double
		if(! tapInProgress || tapInProgress.el !== e.srcElement){
			tapInProgress = {
				"el" : e.srcElement,
				"startTime" : new Date
			}
		}
	}
	function touchEndEvent(e){
		//                   Check for double again
		if( tapActive() && ! tapInProgress.tapEvent){
			var tapEvent = simulateEvent(tapInProgress.el, "tap");
			tapInProgress.tapEvent = tapEvent;
		} 
	}
	function clickEvent (e) {
		if( tapActive() && tapInProgress.tapEvent ){
			var tapEvent = tapInProgress.tapEvent;
			e.tapEvent = tapEvent;
			if(! tapEvent.dispatchReturnValue){
				if(tapEvent.defaultPrevented){
					e.preventDefault();
				}else{
					e.stopPropagation();
				}
			}
			tapInProgress = null;
		}else{
			simulateEvent(e.srcElement, "nontapclick");
		}
	}
	
	function tapActive(){
		if(tapInProgress){
			if((new Date) - tapInProgress.startTime <= TAPTIME){
				return true;
			}
			tapInProgress = null;
		}
		return false;
	}

	function simulateEvent(el, evType) {
		var event = new MouseEvent(evType, {
			"view": window,
			"bubbles": true,
			"cancelable": true
		}); 
		event.dispatchReturnValue = el.dispatchEvent(event);
		return event;
	}


	function EventOffListener (node, eventName, callBack, callBackContext) {
		this.node = node;
		this.eventName = eventName;
		this.cb = callBack;
		this.cbContext = callBackContext;
		this.eventID = BH.utils.uuid();

		this.nodeEvent = _nodeEvent.bind(this);
		node.addEventListener(this.eventName, this.nodeEvent);

		this.documentEvent = _documentEvent.bind(this);
		document.addEventListener(this.eventName, this.documentEvent);

	}
	EventOffListener.prototype.destroy = function() {
		this.node.removeEventListener(this.eventName, this.nodeEvent);
		document.removeEventListener(this.eventName, this.documentEvent);
	};

	function _nodeEvent (e) {
		e.nodeEventID = this.eventID;
	}

	function _documentEvent (e) {
		if(e.nodeEventID !== this.eventID){
			this.cb.apply(this.cbContext, arguments);
			this.destroy();
		}
	}

	Tappy.EventOffListener = EventOffListener;

	if(! window.Tappy){
		window.Tappy = Tappy;
		Tappy.documentInstance = new Tappy(document);
	}

})();