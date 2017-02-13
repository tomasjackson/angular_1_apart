$(document).ready(function(){
    $(document).on('click', '.group_listings .wmds_select_group', function(e){
        e.preventDefault();

        var group_elem = $(this).closest('.group-select'),
            group_id = $(group_elem).data('id'),
            group_name = $(group_elem).find('.group_name').text(),
            crt_modal = $(this).closest('.modal');

        if ( $(this).hasClass('checked') ) {
            $(this).removeClass('checked').removeClass('check-blue-icon');

            //remove from list
            var group_tag;
            if ( group_id ) {
                group_tag = $(this).closest('.select_users_container').find('.tag_group[data-id="'+group_id+'"]');
            } else {
                group_tag = $(this).closest('.select_users_container').find('.tag_group[data-name="'+group_name+'"]');
            }

            $(group_tag).remove();

//            for( var i = groupsSelected.length; i--; ) {
//                if( groupsSelected[i] == group_id ) {
//                    groupsSelected.splice(i, 1);
//                }
//            }
        } else {
            $(this).addClass('checked').addClass('check-blue-icon');
            //add to list
            var tag_text = $(group_elem).find('.group_name').text();
            var tag_html = '<span class="tag tag_group" data-id="'+group_id+'" data-name="'+group_name+'">' +
                                '<span class="group-mini-icon-light pull-left"></span>' +
                                '<span class="pull-left">&nbsp;&nbsp;'+tag_text+'&nbsp;&nbsp;</span>' +
                                '<a class="close-small-icon remove_tag" href="#" title="Removing group"></a>' +
                            '</span>';

            $(tag_html).insertBefore($(crt_modal).find('.tagsinput #tags_addTag'));
        }
    });

    $(document).on('click', '.user_item', bindUserItem());

    function bindUserItem(){
        $(document).on('click', '.user_item', function(e){
            e.preventDefault();

            if ( $(this).closest('.group_users_list_container').hasClass('no_checking_users') ) {
                return;
            }

            var username = $(this).find('.contactInfo h2').text(),
                id = $(this).attr('data-id'),
                crt_modal = $(this).closest('.modal'),
                people_selected = $(crt_modal).find('.people_selected span');

            if ( $(this).hasClass('active') ) {
                $(this).removeClass('active');

                //remove from list
                var user_tag = $(this).closest('.select_users_container').find('.tag_user[data-username="'+username+'"]');
                $(user_tag).remove();

                //decrease people selected
                if ( people_selected.length ) {
                    var nr = parseInt($(people_selected).text());
                    $(people_selected).text(nr - 1);
                }
            } else {
                $(this).addClass('active');
                //add to list
                var tag_html = '<span class="tag tag_user" data-username="'+username+'" data-id="'+id+'">' +
                                    '<span class="pull-left">'+username+'&nbsp;&nbsp;</span>' +
                                    '<a class="close-small-icon remove_tag" href="#" title="Removing user"></a>' +
                                '</span>';

                $(tag_html).insertBefore($(crt_modal).find('.tagsinput #tags_addTag'));

                //increase people selected
                if ( people_selected.length ) {
                    var nr = parseInt($(people_selected).text());
                    $(people_selected).text(nr + 1);
                }
            }
        });
    }

    $(document).on('click', '.remove_tag', function(e){
        e.preventDefault();

        var tag_elem = $(this).closest('.tag');
        var crt_modal = $(this).closest('.modal');

        //Remove Group
        if ( $(tag_elem).hasClass('tag_group') ) {
            var group_id = $(tag_elem).data('id'),
                group_name = $(tag_elem).data('name'),
                group_elem;

            if ( typeof group_id === 'undefined' ) {
//                group_elem = $(crt_modal).find('.group_listings li[data-id="'+group_id+'"]');
                group_elem = $(crt_modal).find('.group_listings .group-select[data-id="'+group_id+'"]');
            } else {
//                group_elems = $(crt_modal).find('.group_listings li');
                group_elems = $(crt_modal).find('.group_listings .group-select');
                $(group_elems).each(function(){
                    if ( $(this).find('.group_name').text() == group_name ) {
                        group_elem = $(this);
                        return false;
                    }
                });
            }

            $(group_elem).find('.wmds_select_group').removeClass('checked');
        //Remove User
        } else if ( $(tag_elem).hasClass('tag_user') ) {
            var user_item = $(crt_modal).find('.user_item .username a');
            var username = $(tag_elem).data('username');

            $(user_item).each(function(){
                if ( $(this).text() == username ) {
                    $(this).closest('.user_item').removeClass('checked');
                    return false;
                }
            });
        }

        $(this).closest('.tag').remove();
    });

    $(document).on('click', '.group-select a', function(e){
        e.preventDefault();

        $(document).find('body').css('cursor', 'progress');

        var handler = $(this).attr('href'),
            groupSelector = $(this).closest('.group-select').find('.wmds_select_group'),
            canSelect = $(this).closest('.select_users_container').length,
            allSelected = false,
            allowRemoveLinks = $(this).closest('.group-select').data('id');

        if ( groupSelector.length && $(groupSelector).hasClass('.checked') ) {
            allSelected = true;
        }

        if ( $(this).closest('li').hasClass('.selected') ) {
//        if ( $(elem).closest('li').hasClass('active-group') ) {
            return;
        }

        $.ajax({
            type: "POST",
            url: handler,
            async: true,
            cache: false
        }).done(function( result ) {
                var html = buildUsersSelectableHtml( result );
                $(document).find('.group_users_list_container').html(html);
                $(document).find('body').css('cursor', 'default');
            });

        $(this).closest('.group-select').find('.group').removeClass('active');
        $(this).closest('.group').addClass('active');
    });

    $(document).on('mouseenter', '.wmds_select_group', function(){
        $(this).addClass('check-grey-icon');
    });

    $(document).on('mouseout', '.wmds_select_group', function(){
        $(this).removeClass('check-grey-icon');
    });
});