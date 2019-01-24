var stompClient = null;


var app = new Vue({
	
	
	  el: '#app',
	  name: 'Timer',
	  data() {
		  return {
			  message: 0,
			  dif : 0,
			  startTime : 0,
			  offset: 0,
		}
	  },
	  mounted(){
		  this.$options.interval = setInterval(this.updateTimer,100);
		  this.connect();
	  },
	  beforeDestroy(){
		  clearInterval(this.$options.interval);
	  },
	  methods :{
		  updateTimer(){
			  let now = new Date().getTime() + this.offset;
           	console.log('sad ' + this.offset);

			  this.dif = now - this.startTime;
		  },
		  connect() {
			    var socket = new SockJS('/catan-timer');
			    stompClient = Stomp.over(socket);
			    stompClient.connect({}, function (frame) {
			        setConnected(true);
			        //console.log('Connected: ' + frame);
			        stompClient.subscribe('/topic/greetings', function (greeting) {
			            //showGreeting(JSON.parse(greeting.body).content);
			        	clientTime = new Date().getTime();
			        	serverTime = new Date(greeting.body).getTime();
			        	
			        	app.offset = serverTime - clientTime;
			        	app.updateTimer();
			        });
			    });
			}
	  }
})

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

//function connect() {
//    var socket = new SockJS('/catan-timer');
//    stompClient = Stomp.over(socket);
//    stompClient.connect({}, function (frame) {
//        setConnected(true);
//        console.log('Connected: ' + frame);
//        stompClient.subscribe('/topic/greetings', function (greeting) {
//            //showGreeting(JSON.parse(greeting.body).content);
//            $("#greetings").append("<tr><td>" + greeting.body + "</td></tr>");
//        });
//    });
//}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

