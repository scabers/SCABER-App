$(document).ready(function() {
    // Initialize account tabs
    $('ul.tabs').tabs();
    $('#signin').hide();
    $('#signup-id').hide();
    $('#signup').hide();

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
    });

    // Navbar collapse
    $('.button-collapse').sideNav();
});