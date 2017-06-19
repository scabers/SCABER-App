$(document).ready(function() {
    // navbar collapse
    $('.button-collapse').sideNav({
        closeOnClick: true,
        draggable: true
    });

    // tabs
    $('ul.tabs').tabs();

    // modal
    $('.modal').modal();
});