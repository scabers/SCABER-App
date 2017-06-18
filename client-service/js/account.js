$(document).ready(function() {
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
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Add text information 
        $('#user-type-gp').val("passenger");
        $('#user-type-fb').val("passenger");
    });

    $('#signup-driver').click(function() {
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Add text information 
        $('#user-type-gp').val("driver");
        $('#user-type-fb').val("driver");
    });
});