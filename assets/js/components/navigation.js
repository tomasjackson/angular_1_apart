/**
 * Navigation handling
 */
$(document).on('click', 'a', function(e) {
    e.preventDefault();

    var url             = $(this).attr('href');
    var allow_ajax      = $(this).data('ajax');
    var allow_history   = $(this).data('history');
    var target          = $(this).attr('target');

    if ( allow_history == false ) {
        return;
    }

    if ( allow_ajax != false ) {
        if ( typeof(url) !== 'undefined' && url != '' && url != '#' && url != window.location.pathname ) {
            NProgress.start();
            History.pushState(null, $(this).text(), url);
            //TODO: check if this has to remain here
            alterSearchFieldBasedOnRoute();
        }
    } else if ( typeof(target) !== 'undefined' ) {
        window.open(url);
    } else {
        window.location = url;
    }
});

/**
 * Initiate history.js navigation
 * @returns {boolean}
 */
function initWebsiteNativation() {
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
        return false;
    }

    if ( typeof History.Adapter !== 'undefined' ) {
        // Bind to StateChange Event
        History.Adapter.bind(window,'statechange',function() {
            var State = History.getState();

            //Change header search field placeholder by page content
            var main_container = $(document).find('.main-content');
            var location_link = window.location.pathname;

            if ( location_link.replace('/', '') === 'my-contacts-and-groups' ) {
                $(document).find('#header_search').attr('placeholder', 'Search Users');
            } else {
                $(document).find('#header_search').attr('placeholder', 'Search Stories');
            }

            $(document).find('body').css('cursor', 'progress');

            var content = $(document).find('#content');
            if ( content.length > 0 ) {
                NProgress.set(0.4);
                $.get(State.url, function(response) {
                    $(content).html($(response).find('#content').html());
                    if ( window.location.pathname === '/register' || window.location.pathname === "/login" || window.location.pathname === '/register/' ) {
                        FB.XFBML.parse();
                    }
                    $(document).find('body').css('cursor', 'default');
                    NProgress.done();

                })
                    .fail(function() {
                        NProgress.done();
                        alert('Error on loading the page');
                    });

            } else {
                $('#content').load(State.url);
                if ( window.location.pathname === '/register' || window.location.pathname === "/login" ) {
                    FB.XFBML.parse();
                }
            }


        });
    }
}