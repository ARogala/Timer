/**
 * JavaScript Timer
 * @authors Andrew Rogala
 * @date    4/10/2018
 * @version 1.0
 */


//get user input and update UI
var UIController = (function() {
	//store html classes and IDs in an object so we can call them elsewhere
	//then if html changes we only need to update here
	var DOMstrings = {
		formInput:        'getTime',
		hoursRemaining:   'hoursRemaining',
		minutesRemaining: 'minutesRemaining',
		secondsRemaining: 'secondsRemaining',
		output: 		  'display',
		input:            'inputContainer',
		resetBtn:         'reset',
		startBtn:         'submit',
		labels: 	      'labelContainer'
	};

	//return public methods to get user input, DOMstrings, and updateUI
	return {
		//this public method returns an objcet containing user input
		getInput: function() {
			return {
				hours:   document.getElementById(DOMstrings.formInput).elements[0].value,
				minutes: document.getElementById(DOMstrings.formInput).elements[1].value,
				seconds: document.getElementById(DOMstrings.formInput).elements[2].value
			};
		},

		//return DOMStrings for use elsewhere
		getDOMstrings: function(){
			return DOMstrings;
		},

		upDateUI: function(totalSeconds) {

			var hoursRemaining, minutesRemaining, secondsRemaining;
			//convert the remaining seconds to hours
			hoursRemaining = Math.floor(totalSeconds/(60*60));
			//take remaining seconds (out of those remainin hours) and convert to remaining minutes
			minutesRemaining = Math.floor((totalSeconds%(60*60))/(60));
			//calculate the remaining seconds
			secondsRemaining = Math.floor(totalSeconds%60);

			//display hours remaining
			if(hoursRemaining < 10) {
				//display trailing 0
				document.getElementById(DOMstrings.hoursRemaining).innerHTML = '0' + hoursRemaining + ':';
			}
			else if(hoursRemaining >= 10) {
				document.getElementById(DOMstrings.hoursRemaining).innerHTML = hoursRemaining + ':';
			}
			//display minutes remaining
			if(minutesRemaining < 10) {
				//display trailing 0
				document.getElementById(DOMstrings.minutesRemaining).innerHTML = '0' + minutesRemaining + ':';
			}
			else if(minutesRemaining >= 10) {
				document.getElementById(DOMstrings.minutesRemaining).innerHTML = minutesRemaining + ':';
			}
			//display seconds remaining
			if(secondsRemaining < 10) {
				document.getElementById(DOMstrings.secondsRemaining).innerHTML = '0'+ secondsRemaining;
			}
			else if(secondsRemaining >= 10) {
				document.getElementById(DOMstrings.secondsRemaining).innerHTML = secondsRemaining;
			}
			//keep for future debug
			//return console.log('secondsRemaining ' + totalSeconds);

		}

	};

})();

//Calculate the time
var TimerCalc = (function(UICtrl) {

	//return a public methods to calculate remaining time
	return {
		totalSeconds: function(hours, minutes,seconds) {
			return (minutes*60)+(hours*60*60)+(seconds);
		},

		timer: function(totalSeconds, audio1, audio2) {
			//only call if totalSeconds not 0
			if(totalSeconds != 0) {
				var intervalID = setInterval(function(){
					totalSeconds--;
					//update ui
					UICtrl.upDateUI(totalSeconds);
					if(totalSeconds === 0){
						clearInterval(intervalID);
						audio1.play();
						//sound alarm until user presses reset 2 sec delay between audio
						var soundIntervalID = setInterval(function(){
							audio2.play();
						},15000);
					}
				},1000);
			}
		}
	};

})(UIController);


//the interface that controls brain and UI
var Controller =(function(UICtrl, TimerCtrl) {
	var DOM = UICtrl.getDOMstrings();
	const output = document.getElementById(DOM.output);
	const input = document.getElementById(DOM.input);
	const resetBtn = document.getElementById(DOM.resetBtn);
	const startBtn = document.getElementById(DOM.startBtn);
	const labels = document.getElementById(DOM.labels);

	var setupEventListeners = function() {
		document.getElementById(DOM.formInput).addEventListener('submit', function(e){
			e.preventDefault();
			/*
			 set up audio here bc/ chrome on android only plays sounds
			 if the user interacts with the DOM first. play then pause was the only
			 way i could think to trick this.
			*/
			let audio1 = new Audio('alarmSound.ogg');
			let audio2 = new Audio('alarmSound.ogg');
			audio1.play();
			audio1.pause();
			audio2.play();
			audio2.pause();
			ctrlTimerAndUI(audio1, audio2);
			input.setAttribute('style', 'display: none;');
			output.setAttribute('style', 'display: block;');
			resetBtn.setAttribute('style', 'display: inline-block;');
			startBtn.setAttribute('style', 'display: none;');
			labels.setAttribute('style', 'display: none;');
		});
		//reset the timer when reset button pressed
		document.getElementById(DOM.formInput).addEventListener('reset', function(){
			window.location.reload(true);
		});

	};


	//control the brain and UI here
	var ctrlTimerAndUI = function(audio1, audio2) {
		//get the user input data
		var input = UICtrl.getInput();
		//parse to integers
		var hours 	= parseInt(input.hours);
		var minutes = parseInt(input.minutes);
		var seconds = parseInt(input.seconds);
		//calculate total seconds
		var totalSeconds = TimerCtrl.totalSeconds(hours, minutes, seconds);
		//display the initial start time
		UICtrl.upDateUI(totalSeconds);
		//start the timer
		TimerCtrl.timer(totalSeconds, audio1, audio2);

	};

	//return an initialization object
	return {
		init: function() {
			output.setAttribute('style', 'display: none;');
			resetBtn.setAttribute('style', 'display: none;');
			setupEventListeners();
		}
	};

})(UIController,TimerCalc);

Controller.init();

