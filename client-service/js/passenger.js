$(document).ready(function() {
    // Initialize passenger
    $('#pass-profile').hide();
    //$('#pass-riding-wait').hide();
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
        dismissible: false,
        // Callback for modal close
        complete: function() {
            alert('Closed');
        }
    });

    // Bind passenger riding
    $('.nav-riding').click(function() {
        $('.pass-pages').hide();
        $('#pass-riding').show();
    });

    // Bind passenger profile
    $('.nav-profile').click(function() {
        $('.pass-pages').hide();
        $('#pass-profile').show();
    });

    // Bind passenger monitor
    $('.nav-monitor').click(function() {
        $('.pass-pages').hide();
        $('#pass-riding-wait').show();
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
});

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

// Trigger passenger booking modal
function triggerPassengerBookModal(signal) {
    if (signal == 'match') {
        $('.modal-wait').modal('close');
        $('.modal-succ').modal('open');
    } else if (signal == 'waiting') {
        $('.modal-book').modal('close');
        $('.modal-wait').modal('open');
    }
}

// Add monitor in passenger waiting taxi
function addMonitorPassengerRiding(name, phone) {
    var $newMonitor = $('<li class="collection-item avatar"><img class="circle" src="driver/unknown.png" alt><p class="title user-name">[name]</p><p class="user-phone" id="user-phone">[phone]</p><button class="secondary-content waves-effect waves-green btn">取消監督</button></li>');
    $newMonitor.find('.user-name').text(name);
    $newMonitor.find('.user-phone').text(phone);
    $('#pass-riding-wait-monitor').append($newMonitor);
}