var timeout;
$("#header_search").on('keyup',function() {
    if($(this).data('type') == 'users') {
        clearTimeout(timeout);

        timeout = setTimeout(function(){
            run_search($("#header_search").val());
        }, 200);
    }

});

function run_search(keywords) {
    var resultBlock = $('#search-results');
    $.ajax({
        url: Routing.generate('wmds_data_user_autocomplete'),
        context: document.body,
        type: "GET",
        data: {
            q: keywords
        }
    }).done(function(data) {
        var template = $('#searchResultsTmlp').html();
        Mustache.parse(template);   // optional, speeds up future uses
        var rendered = Mustache.render(template, data);
            resultBlock.html(rendered);
            resultBlock.show();
    });
}

$('#form_header_search').on('submit', function(e){
    e.preventDefault();

    var keywords = $('#header_search').val();
    var filterType = $(document).find('.filter_story_method').data('filter');

    browseByDate( keywords, filterType, this, false );
});

function browseByDate( keywords, filterType, elem, filter_group_users ) {

    NProgress.start();

//    var title = pageTitleByPage(filterDate, browseType),
    var title = pageTitleByPage(filterDate, browseType),
        keywords = keywords.match(/\w+/g);

    var browse_by_calendar = $(document).find('.main-content .browse_by_calendar');
    var select_users_container = $(elem).closest('.modal .select_users_container');
    if ( browse_by_calendar.length == 0 && select_users_container.length == 0 ) {
        return;
    }


    $(document).find('body').css('cursor', 'progress');

    if ( filter_group_users ) {
        var handler = $(elem).attr('href'),
//            groupSelector = $(elem).closest('li').find('.wmds_select_group'),
            groupSelector = $(elem).closest('.group-select').find('.wmds_select_group'),
            canSelect = $(elem).closest('.select_users_container').length,
            allSelected = false,
            allowRemoveLinks = $(elem).closest('li').data('id');

        if ( groupSelector.length && $(groupSelector).hasClass('.checked') ) {
            allSelected = true;
        }

//        if ( $(this).closest('li').hasClass('.selected') ) {
        if ( $(elem).closest('li').hasClass('active-group') ) {
            return;
        }

        var date_str = formatDate(filterDate);

        $.ajax({
            type: "POST",
            url: handler,
            async: true,
            cache: false,
            data: {
                filterDate: date_str,
                browseType: browseType,
                keywords: keywords,
                filterType: filterType
            }
        }).done(function( result ) {
                NProgress.set(0.4);

                var html = buildUsersHtml( result, canSelect, allSelected, allowRemoveLinks, 60 );

                $(document).find('.group_users_list_container').html(html);

                $(document).find('body').css('cursor', 'default');
                NProgress.done();
            });
    } else {
        var handler = $('#header-search').data('action'),
            date_str = formatDate(filterDate);

        $.ajax({
            type: "POST",
            url: handler,
            async: true,
            cache: false,
            data: {
                filterDate: date_str,
                browseType: browseType,
                keywords: keywords,
                filterType: filterType
            }
        }).done(function( result ) {
                NProgress.set(0.4);

                if ( result ) {
//                $('.story-listing').html(result);
                    var State = History.getState();
                    var url = handler;

                    var content = $(document).find('#content');
                    if ( content.length > 0 ) {
                        $(content).html($(result).find('#content').html());

                    } else {
                        $('#content').load(State.url);
                    }

                    $(document).find('.browse_by_calendar .browse_by').text(title);
                    $(document).find('.browse_by_calendar .browse_title').append(' - '+title);

                    $(document).find('body').css('cursor', 'default');
                }
                NProgress.done();
            });
    }

}