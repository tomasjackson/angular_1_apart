function saveViewingPermissions( elem, id, contentType )
{
    var handler = $(elem).attr('href'),
        current_modal = $(elem).closest('.modal'),
        permission = $(current_modal).find('input[name="viewing_permission"]:checked').val();

    var groupsSelected = getTagsGroup(),
        usersSelected = getTagsUser(),
        groups = [],
        users = [];

    $(groupsSelected).each(function(){
        group_id = $(this).attr('data-id');
        group_name = $(this).attr('data-name');

        if ( group_id !== undefined ) {
            groups.push(group_id);
        } else {
            groups.push(group_name);
        }
    });

    $(usersSelected).each(function(){
        users.push($(this).attr('data-id'));
    });

    $.ajax({
        type: "POST",
        url: handler,
        async: true,
        cache: false,
        data: {
            permission: permission,
            users: users,
            groups: groups,
            id: id,
            contentType: contentType
        }
    }).done(function( result ) {
            if (result != '') {
                if ( result.hasOwnProperty("error") && result['error']  ) {
                    var alert_container = $(elem).closest('.modal').find('.alert-error');
                    $(alert_container).removeClass('hide');
                    $(alert_container).text(result['message']);
                } else {
                    if ( result.hasOwnProperty("message") ) {
                        $(current_modal).modal('hide');
                    } else {
                        $('#modal_container #modal_story_details').html(result);
                        $('#modal_container #modal_story_details').modal('show');
                    }

                }
            }
        });
}

function selectPrivacy( type, elem, id, contentType ){

    switch( type ){
        case '0' :
            $('.setting-description').text('Private stories are visible only to you.');
            $('.select-user-priviledges').slideUp('fast');
            $(document).find(".view-count").html('');
            if($('#save-permissions').hasClass('pull-right')){
                $('#save-permissions').removeClass('pull-right');
            }
            break;
        case '1' :
            $('.setting-description').text('Public stories are visible to everyone registered on StoryThat.');
            $('.select-user-priviledges').slideUp('fast');
            $(document).find(".view-count").html('');
            if($('#save-permissions').hasClass('pull-right')){
                $('#save-permissions').removeClass('pull-right');
            }
            break;
        case '2' :
            $('.setting-description').text('The story will only be visible to the users you select.');
            $('.select-user-priviledges').slideDown('fast');

            $('#save-permissions').addClass('pull-right');

            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_get_viewing_permissions'),
                async: true,
                cache: false,
                data: { id: id, contentType: contentType }
            }).done(function( result ) {
                    if (result != '') {
                        if ( result.hasOwnProperty("error") ) {
                            var alert_container = $(elem).closest('.modal').find('.alert-error');
                            $(alert_container).removeClass('hide');
                            $(alert_container).text(result['message']);
                        } else {
                            var crt_modal = $(elem).closest('.modal');
                            $(crt_modal).find('.select-user-priviledges').html(result);
                            $(crt_modal).find('.view-count').text($(crt_modal).find('.count_people_allowed').text()+ ' users can view your story');
                        }
                    }
                });

            break;
    }
}

function getPermissionInfo( elem, id, contentType )
{
    var perm_val = $(elem).find('input[name="viewing_permission"]').val();
    if ( !$(elem).children('input:checkbox').attr('checked') == true ) {
        $('.privacy-select').find('label').removeClass('checked');
        $(elem).find('label').addClass('checked');

        $('.privacy-select').children('input[name="viewing_permission"]').prop('checked', false);
        $(elem).children('input[name="viewing_permission"]').prop('checked', true);

        selectPrivacy(perm_val, elem, id, contentType);
    }

//    $(document).find('.permission_details .perm_info').addClass('hide');
//    $(document).find('.perm_info_'+perm_val).removeClass('hide');

    $(document).find('.btn_save_permission').unbind('click').bind('click', function(e){
        e.preventDefault();
        saveViewingPermissions( this, id, contentType );
    });
}

function viewingPermission() {
    //Manage story viewing permission
    $(document).on('click', '.btn_manage_permission', function(e){
        e.preventDefault();

        var handler = $(this).attr('href'),
            id = $(this).data('id'),
            contentType = $(this).data('content-type'),
            this_elem = this;

        $.ajax({
            type: "GET",
            url: handler,
            async: true,
            cache: false,
            data: { id: id, contentType: contentType }
        }).done(function( result ) {
                if (result != '') {
                    var active_modal = $(document).find('.modal');
                    active_modal.on('hidden.bs.modal', function (e) {
                        // do something…
                        $('#modal_container #modal_story_details').html(result);
                        $('#modal_container #modal_story_details').modal('show');


                        //bind show permission info action
                        var viewingType = $(document).find('.modal .privacy-select');
                        $(viewingType).bind('click', function(){
                            getPermissionInfo( this, id, contentType );
                        });
                        //unbind onclose function of modal
                        $(e.currentTarget).unbind();
                    });
                    active_modal.modal('hide');

                    /*$('#modal_container #modal_story_details').html(result);
                    $('#modal_container #modal_story_details').modal('show');


                    //bind show permission info action
                    var viewingType = $(document).find('.modal .privacy-select');
                    $(viewingType).bind('click', function(){
                        getPermissionInfo( this, id, contentType );
                    });*/
                }
            });
    });
}

/*$(document).on('hover', '.privacy-select', function(){
    $(this).children('.checkbox-edit-profile').addClass('check-grey-icon');
    $(this).children('span').css('color','#4a4a49');
},function(){
    $(this).children('span').css('color','#b0b0b0');
    $(this).children('.checkbox-edit-profile').removeClass('check-grey-icon');
});*/
