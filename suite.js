"use strict";

(function (factory) {
	if (typeof Benchmark !== "undefined") {
		factory(Benchmark);
	} else {
		factory(require("benchmark"));
	}
})(function (Benchmark) {
	var suite = new Benchmark.Suite;

	Benchmark.prototype.setup = function () {
		var breaker = {};
		
		function forEach(list, iterator) {
			var i = 0;
			var current = list;
		
			while (current != null) {
				if (iterator(current, i) == breaker) {
					return;
				}
		
				current = current.next;
				i++;
			}
		}
		
		function toList(list) {
			var out = [];
		
			forEach(list, function(l) {
				out.push(l.val);
			});
		
			return out;
		}
		
		function find2(list, sublist) {
			list = toList(list);
			sublist = toList(sublist);
		
			var ls = list.length;
			var ln = sublist.length;
		
			switch (true){
			case ln == 0:
				return 0
		
			case ln > ls:
				return -1
			}
		
		head:
			for (var i = 0; i < ls && ls-i >= ln; i++) {
				for (var y = 0; y < ln; y++) {
					if (list[i+y] != sublist[y]) {
						continue head
					}
				}
		
				return i
			}
		
			return -1	
		}
		
		function find(list, sublist) {
		    var found = -1;
		
		    forEach(list, function(parent, i) {
		    	var ok = true;
		
		    	forEach(sublist, function(sub) {
		    		if (parent == null) {
		    			return breaker;
		    		}
		
		    		if (parent.val != sub.val) {
		    			ok = false;
		    			return breaker;
		    		}
		
		    		parent = parent.next;
		    	});
		
		    	if (ok) {
		    		found = i;
		    		return breaker;
		    	}
		    });
		    
			return found;
		}
		
		var p = {val:1, next:{val:2,next:{val:3,next:null}}}
		var s = {val:2,next:{val:3,next:null}}
	};


	suite.add("find(p, s)", function () {
		find(p, s)
	});

	suite.add("find2(p,s)", function () {
		find2(p,s)
	});

	suite.on("cycle", function (evt) {
		console.log(" - " + evt.target);
	});

	suite.on("complete", function (evt) {
		console.log(new Array(30).join("-"));

		var results = evt.currentTarget.sort(function (a, b) {
			return b.hz - a.hz;
		});

		results.forEach(function (item) {
			console.log((idx + 1) + ". " + item);
		});
	});

	console.log("Find in linked list");
	console.log(new Array(30).join("-"));
	suite.run();
});