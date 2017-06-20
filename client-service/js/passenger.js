var passenger_page_status = 0;

$(document).ready(function() {
    // Initialize passenger
    $('#pass-profile').hide();
    //$('#pass-riding-wait').hide();
    $('#pass-monitor').hide();
    $('#pass-helper').hide();


    // Initialize passenger modal
    $('.modal').modal({
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%'
    })

    // Initialize passenger waiting modal for not dismiss
    $('.modal-wait').modal({
        dismissible: false
    });

    // Bind passenger riding
    $('.nav-riding').click(function() {
        if(passenger_page_status){
            $('.pass-pages').hide();
            $('#pass-riding-wait').show();
        }
        else{
            $('.pass-pages').hide();
            $('#pass-riding').show();
        }
    });

    // Bind passenger profile
    $('.nav-profile').click(function() {
        $('.pass-pages').hide();
        $('#pass-profile').show();
    });

    // Bind passenger monitor
    $('.nav-monitor').click(function() {
        $('.pass-pages').hide();
        $('#pass-monitor').show();
    });

    // Bind passenger rating
    $('.nav-rating').click(function() {
        $('.pass-pages').hide();
        $('#pass-rating').show();
    });

    // Bind passenger message
    $('.nav-message').click(function() {
        $('.pass-pages').hide();
        $('#pass-message').show();
    });

    // Bind passenger setting
    $('.nav-setting').click(function() {
        $('.pass-pages').hide();
        $('#pass-setting').show();
    });

    // Bind passenger help
    $('.nav-helper').click(function() {
        $('.pass-pages').hide();
        $('#pass-helper').show();
    });

    // Hide this btn first
    $('#startBtn').hide();
});

// Trigger passenger modal
function triggerPassengerBookModal(signal) {
    if (signal == 'match') {
        $('.modal-wait').modal('close');
        $('.modal-succ').modal('open');
    } else if (signal == 'waiting') {
        $('.modal-book').modal('close');
        $('.modal-wait').modal('open');
        passenger_page_status = 1;
    }
}

// Trigger passenger ordering modal
function triggerPassengerOrderModal(signal) {
    if (signal == 'form') {
        $('.modal-order').modal('close');
        $('.modal-form').modal('open');
    } else if (signal == 'waiting') {
        $('.modal-form').modal('close');
        $('.modal-wait').modal('open');
    } else if (signal == 'match') {
        $('.modal-wait').modal('close');
        $('.modal-succ').modal('open');
    }
}

// Emit signal to server to cancel 
function cancel_GAs(GA_name){
    socket.emit('cancel_ga',{
        account: GA_name
    });
}

// Add monitor in passenger waiting taxi
function addMonitorPassengerRiding(name, phone) {
    var $newMonitor = $('<li class="collection-item avatar"><img class="circle" src="driver/unknown.png" alt><p class="title user-name">[name]</p><p class="user-phone" id="user-phone">[phone]</p><button id="user-delete" class="secondary-content waves-effect waves-green btn">取消監督</button></li>');
    $newMonitor.find('.user-name').text(name);
    $newMonitor.find('.user-phone').text(phone);
    $newMonitor.find('.user-delete').click(function(){
        // When click , emit to server need to remove this user from GAs - (the function body in pass-riding.ejs)
        cancel_GAs(name);
    });
    $('#pass-riding-wait-monitor').append($newMonitor);
}

var timer;
// Count-down timer => format "min:sec" (String)
function arrivalTimer(rawString) {
    // Clear first 
    clearInterval(timer);
    // Parsing to get minute and second
    var min = parseInt(rawString.split(":")[0]);
    var sec = parseInt(rawString.split(":")[1]);
    var total = min * 60 + sec;
    // Count down timer start!
    timer = setInterval(function() {
        $('#driver-arrival').html("約剩餘 " + (Math.floor(total / 60) >= 10 ? Math.floor(total / 60).toString() : '0' + Math.floor(total / 60).toString()) + ":" + (total % 60 >= 10 ? total % 60 : '0' + (total % 60).toString()));
        $('#driver-arrival-waiting').html("約剩餘 " + (Math.floor(total / 60) >= 10 ? Math.floor(total / 60).toString() : '0' + Math.floor(total / 60).toString()) + ":" + (total % 60 >= 10 ? total % 60 : '0' + (total % 60).toString()));
        if (total <= 0) {
            // call arrival function (in pass-riding.ejs)
            driver_arrived();
            // clear interval
            clearInterval(timer);
        } else {
            total--;
        }
    }, 1000);
}