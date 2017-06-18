$(document).ready(function() {
    // initialize account
    $('#signin').hide();
    $('#signup-id').hide();
    $('#signup').hide();

    // tabs
    $('ul.tabs').tabs();

    // navbar collapse
    $('.button-collapse').sideNav({
        closeOnClick: true,
        draggable: true
    });
});