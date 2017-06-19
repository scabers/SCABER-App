$(document).ready(function() {
    // initialize passenger
    $('#pass-profile').hide();

    // Bind passenger profile
    $('.nav-profile').click(function() {
        $('.pass-pages').hide();
        $('#pass-profile').show();
    });

    // Bind passenger riding
    $('.nav-riding').click(function() {
        $('.pass-pages').hide();
        $('#pass-riding').show();
    });

    // Bind passenger message
    $('.nav-message').click(function() {
        $('.pass-pages').hide();
        $('#pass-message').show();
    });

    // Bind passenger rating
    $('.nav-rating').click(function() {
        $('.pass-pages').hide();
        $('#pass-rating').show();
    });

    // Bind passenger setting
    $('.nav-setting').click(function() {
        $('.pass-pages').hide();
        $('#pass-setting').show();
    });

    // Bind passenger help
    $('.nav-help').click(function() {
        $('.pass-pages').hide();
        $('#pass-help').show();
    });
});