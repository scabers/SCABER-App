$(document).ready(function() {
    // Initialize passenger
    $('#pass-profile').hide();

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
});

// Trigger passenger modal
function triggerPassengerModal(signal) {
    if (signal == 'match') {
        $('.modal-wait').modal('close');
        $('.modal-succ').modal('open');
    }
}