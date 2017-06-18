$(document).ready(function() {
    // initialize account
    $('#signin').hide();
    $('#signup-id').hide();
    $('#signup').hide();

<<<<<<< HEAD
    // tabs
    $('ul.tabs').tabs();

    // navbar collapse
    $('.button-collapse').sideNav({
        closeOnClick: true,
        draggable: true
=======
    // Load start page animation
    $('.sct-start').delay(2000).fadeOut(function() {
        $(this).hide();
        $('.sct-account').show();
        $('#signin').show();
    });

    $('#start-signup').click(function() {
        $('#signin').fadeOut(function() {
            $(this).hide();
            $('#signup-id').show();
        });
    });

    $('#id-signin').click(function() {
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signin').show();
        });
    });


    $('#start-signin').click(function() {
        $('#signup').fadeOut(function() {
            $(this).hide();
            $('#signin').show();
        });
    });

    $('#signup-pass').click(function() {
        // Passenger Page
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Set the text information of type in Signup page
        $('#user-type-gp').val("passenger");
        $('#user-type-fb').val("passenger");
    });

    $('#signup-driver').click(function() {
        // Driver Page
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Set the text information of type in Signup page
        $('#user-type-gp').val("driver");
        $('#user-type-fb').val("driver");
>>>>>>> 9bbfd7077682a0bca32a4da539cf4281db770dc2
    });
});