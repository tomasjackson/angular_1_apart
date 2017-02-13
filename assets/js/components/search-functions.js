/**
 * Search possible values
 * @type {{users: {placeholder: string, action: string}, myentries: {placeholder: string, action: string}, media: {placeholder: string, action: string}, profile: {placeholder: string, action: string}, default: {placeholder: string, action: string}}}
 */
var searchMethods = {
    'users' : {
        'placeholder'   : 'Search Users',
        'action'        : Routing.generate('wmds_web_connections'),
        'type'          : 'users'
    },
    'myentries' : {
        'placeholder'   : 'Search stories in My Journal',
        'action'        : Routing.generate('wmds_web_my_journal'),
        'type'          : 'myentries'
    },
    'media' : {
        'placeholder'   : 'Search Photos and Videos',
        'action'        : 'media',
        'type'          : 'media'
    },
    'profile' : {
        'placeholder'   : 'Search %username%\'s Stories',
        'action'        : 'viewed-profile',
        'type'          : 'viewed-profile'
    },
    'default' : {
        'placeholder'   : 'Search Stories',
        'action'        : Routing.generate('wmds_web_shared_stories'),
        'type'          : 'shared-stories'
    }
}

/**
 * Define route vs text for search
 * @type {Array}
 */
var searchBasedOnRoute = [];
searchBasedOnRoute['default']                                                   = searchMethods.default;
searchBasedOnRoute[Routing.generate('wmds_web_connections')]                    = searchMethods.users;
searchBasedOnRoute['gallery']                                                   = searchMethods.media;
searchBasedOnRoute[Routing.generate('wmds_web_my_journal')]                     = searchMethods.myentries;
searchBasedOnRoute['profile']                                                   = searchMethods.profile;

/**
 * Set top search based on route
 */
function alterSearchFieldBasedOnRoute() {
    var path = window.location.pathname;

    var data;
    if(searchBasedOnRoute[path] !== undefined) {
        data = searchBasedOnRoute[path];
    } else {
        if(path.match(/\/user\/\w+$/)) {
            data = searchBasedOnRoute['profile'];
        } else if(path.match(/\/user\/\w+\/gallery$/)) {
            data = searchBasedOnRoute['gallery'];
        } else {
            data = searchBasedOnRoute['default'];
        }

    }
    $('#header_search')
        .attr('placeholder', data.placeholder)
        .attr('data-action',data.action)
        .attr('data-type',data.type);
}