$(document).ready(function() {
    // initialize account
    $('.sct-account').hide();
    $('#signup-id').hide();
    $('#signup').hide();
    $('#signup-gp').hide();
    $('#signup-fb').hide();

    // Redirect start page to sign-in page
    $('.sct-start').delay(2000).fadeOut(function() {
        $(this).hide();
        $('.sct-account').show();
        $('#signin').show();
    });

    // Redirect sigin-in page to sign-up id page
    $('.rd-signup-id').click(function() {
        $('#signin').fadeOut(function() {
            $(this).hide();
            $('#signup-id').show();
        });
    });

    // Redirect sign-up page to sign-in page
    $('.rd-signin').click(function() {
        if ($('#signup').is(':hidden')) {
            $('#signup-id').fadeOut(function() {
                $(this).hide();
                $('#signin').show();
            });
        } else if ($('#signup-id').is(':hidden')) {
            $('#signup').fadeOut(function() {
                $(this).hide();
                $('#signin').show();
            });
        }
    });

    // Redirect to passenger sign-up form
    $('#rd-signup-pass').click(function() {
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Add text information
        $('#user-type-gp').val('passenger');
        $('#user-type-fb').val('passenger');
    });

    // Redirect to driver sign-up form
    $('#rd-signup-driver').click(function() {
        $('#signup-id').fadeOut(function() {
            $(this).hide();
            $('#signup').show();
        });
        // Add text information 
        $('#user-type-gp').val('driver');
        $('#user-type-fb').val('driver');
    });
});