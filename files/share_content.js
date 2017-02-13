
function shareNextStep( id, contentType ) {
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_share_content_details'),
        async: true,
        cache: false,
        data: { contentType: contentType, id: id }
    }).done(function( result ) {
            if (result != '' && !result['error']) {
                $('#modal_select_users').modal('hide');
                $('#modal_share_details').html(result);
                $('#modal_share_details').modal('show');
            }
        });
}

function verifySharePermission( elem, id, contentType )
{
    var handler = $(this).attr('href'),
        action = '';

    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_verify_sharing_permission'),
        async: true,
        cache: false,
        data: { id: id, contentType: contentType }
    }).done(function( result ) {
            if ( result['error'] ) {
                $('#modal_share_content').modal('hide');
                $('#modal_alert_message .alert').text(result['message']).addClass('alert-danger').removeClass('hide');
                $('#modal_alert_message').modal('show');
            } else {
//                    allowShare = true;
                if ( !$(elem).hasClass('btn_share_type') ) {
                    $('#modal_container #modal_story_details').modal('hide');
                    $('#modal_container #modal_share_content').modal('show');
                } else {
                    //switch between shareType:
                    var shareType = $(elem).text();
                    var shareLink = '';

                    switch( shareType ) {
                        case 'Facebook':
                            FB.ui({
                                method: 'feed',
                                link: result['url'],
                                caption: result['title']
                            }, function(response){});
                            break;
                        case 'Twitter':
                            shareLink = 'http://twitter.com/home?status='+result['url'];
                            break;
                        case 'Google+':
                            shareLink = 'https://plus.google.com/share?url='+result['url'];
                            break;
                        case 'Users':
                            //show modal to select users
                            getSelectUsersBlock( contentType, id, action );
                            var fSContainer = $('#modal_share_details .further_share_container');
                            if ( !result['furtherSharing'] ) {
                                if ( $(fSContainer).find('.further_sharing_option:contains("No")').hasClass('checked') ) {
                                    $(fSContainer).find('.further_sharing_option:contains("Yes")').removeClass('checked');
                                    $(fSContainer).find('.further_sharing_option:contains("No")').addClass('checked');
                                }
                            } else {
                                if ( $(fSContainer).find('.further_sharing_option:contains("Yes")').hasClass('checked') ) {
                                    $(fSContainer).find('.further_sharing_option:contains("No")').removeClass('checked');
                                    $(fSContainer).find('.further_sharing_option:contains("Yes")').addClass('checked');
                                }
                            }

                            //Bind share next action
                            var btn_share = $(elem).find('.btn_share_next');
                            $(btn_share).unbind('click');
                            $(btn_share).bind('click', function(){
                                shareNextStep( id, contentType );
                            });

                            break;
                        case 'Email':
                            //show modal to add emails
                            break;
                    }

                    if ( shareLink != '' ) {
                        window.open( shareLink, 'sharer', 'toolbar=0,status=0,width=548,height=325');
                    }
                }
            }
        });
}

function shareContent() {
    $('#modal_share_content').on('shown.bs.modal', function(e){
        var rt = e.relatedTarget,
            prev_modal = $(rt).closest('.modal');

        var contentType = $(rt).data('content-type'),
            id = $(rt).data('id');

    //    $(this).data('content-type', contentType);
    //    $(this).data('id', id);

        if ( prev_modal.length > 0 ) {
            var target_id = $(prev_modal).attr('id');

            if ( typeof target_id !== 'undefined' ) {
                $('#'+target_id).modal('hide');
                var back_btn = '<button class="btn btn-default pull-left btn_story_back" data-target="#'+target_id+'" type="button">' +
                    '<i class="glyphicon glyphicon-chevron-left"></i> Back' +
                    '</button>';
            }

            $('#modal_share_content .modal-footer').removeClass('hide');
            $('#modal_share_content .modal-footer').html(back_btn);
        } else {
            //remove back btn
            $('#modal_share_content .modal-footer').addClass('hide');
            $('#modal_share_content .modal-footer').find('.btn_story_back').remove();
        }

        //Bind share action
    //    var share_type_btn = $(this).find('.verify_share_permission_action');
    //    $(share_type_btn).unbind('click').bind('click', function(e){
    //        e.preventDefault();
    //        verifySharePermission( this, id, contentType );
    //    });
    });

    //Share Content
    $(document).on('click', '.btn_share_content', function(e){
        e.preventDefault();

        var contentType = $(this).data('content-type'),
            id = $(this).data('id');

        $('#modal_share_content').attr('data-content-type', contentType);
        $('#modal_share_content').attr('data-id', id);
    //    $('#modal_select_users').attr('data-content-type', contentType);
    //    $('#modal_select_users').attr('data-id', id);
    //    $('#modal_share_details').attr('data-id', id);
    //    $('#modal_share_details').attr('data-content-type', contentType);

    });

    $(document).on('click', '.verify_share_permission_action', function(e){
        e.preventDefault();

        var handler = $(this).attr('href'),
            this_elem = this,
            contentType = $('#modal_share_content').attr('data-content-type'),
            id = $('#modal_share_content').attr('data-id'),
            action = '';

        if ( $(this_elem).hasClass('btn_share_type') ) {
            action = 'share';
        }

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_verify_sharing_permission'),
            async: true,
            cache: false,
            data: { id: id, contentType: contentType }
        }).done(function( result ) {
                if ( result['error'] ) {
                    $('#modal_container #modal_share_content').modal('hide');
                    $('#modal_container #modal_alert_message .alert').text(result['message']).addClass('alert-danger').removeClass('hide');
                    $('#modal_container #modal_alert_message').modal('show');
                } else {
    //                    allowShare = true;
                    if ( !$(this_elem).hasClass('btn_share_type') ) {
                        $('#modal_container #modal_story_details').modal('hide');
                        $('#modal_container #modal_share_content').modal('show');
                    } else {
                        //switch between shareType:
                        var shareType = $(this_elem).text();
                        var shareLink = '';

                        switch( shareType ) {
                            case 'Facebook':
                                FB.ui({
                                    method: 'feed',
                                    link: result['url'],
                                    caption: result['title']
                                }, function(response){});
                                break;
                            case 'Twitter':
                                shareLink = 'http://twitter.com/home?status='+result['url'];
                                break;
                            case 'Google+':
                                shareLink = 'https://plus.google.com/share?url='+result['url'];
                                break;
                            case 'Users':
                                //show modal to select users
                                getSelectUsersBlock( contentType, id, action );
                                var fSContainer = $('#modal_share_details .further_share_container');
                                if ( !result['furtherSharing'] ) {
                                    if ( $(fSContainer).find('.further_sharing_option:contains("No")').hasClass('checked') ) {
                                        $(fSContainer).find('.further_sharing_option:contains("Yes")').removeClass('checked');
                                        $(fSContainer).find('.further_sharing_option:contains("No")').addClass('checked');
                                    }
                                } else {
                                    if ( $(fSContainer).find('.further_sharing_option:contains("Yes")').hasClass('checked') ) {
                                        $(fSContainer).find('.further_sharing_option:contains("No")').removeClass('checked');
                                        $(fSContainer).find('.further_sharing_option:contains("Yes")').addClass('checked');
                                    }
                                }
                                break;
                            case 'Email':
                                //show modal to add emails
                                break;
                        }

                        if ( shareLink != '' ) {
                            window.open( shareLink, 'sharer', 'toolbar=0,status=0,width=548,height=325');
                        }
                    }
                }
            });
    });

    //Share Next action
    $(document).on('click', '.btn_share_next', function(){
        var contentType = $('#modal_share_content').attr('data-content-type'),
            id = $('#modal_share_content').attr('data-id');

        shareNextStep( id, contentType );
    });

    $(document).on('click', '.further_sharing_option', function(){
        var furtherSharing = $(this).text(),
            contentType = $('#modal_share_content').attr('data-content-type'),
            id = $('#modal_share_content').attr('data-id'),
            this_elem = this;

        $('.further_sharing_option').removeClass('checked');
        $(this).addClass('checked');

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_change_further_sharing'),
            async: true,
            cache: false,
            data: {
                id: id,
                contentType: contentType,
                furtherSharing: furtherSharing.toLowerCase()
            }
        }).done(function( result ) {
                if ( result['error'] ) {
                    $(this_elem).closest('.modal').find('.alert').addClass('alert-danger').removeClass('hide').text(result['message']);
                } else {
                    $(this_elem).closest('.modal').find('.alert').addClass('alert-success').removeClass('hide').text(result['message']);
                }
            });
    });

    $(document).on('click', '.btn_share_action', function(){
        var crt_modal = $(this).closest('.modal'),
            contentType = $('#modal_share_content').attr('data-content-type'),
            id = $('#modal_share_content').attr('data-id'),
            this_elem = this,
            furtherSharing = $(this).closest('.modal').find('.further_sharing_option.checked').text(),
            sharingText = $(crt_modal).find('input[name="sharing_text"]').val();

        var groupsSelected = getTagsGroup(),
            usersSelected = getTagsUser(),
            groups = [],
            users = [];

        $(groupsSelected).each(function(){
            group_id = $(this).attr('data-id');
            group_name = $(this).attr('data-name');

            if ( group_id != 'undefined' ) {
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
            url: Routing.generate('wmds_share_content'),
            async: true,
            cache: false,
            data: {
                id: id,
                contentType: contentType,
                furtherSharing: furtherSharing.toLowerCase(),
                groups: groups,
                users: users,
                sharingText: sharingText
            }
        }).done(function( result ) {
                if ( result['error'] ) {
                    $(this_elem).closest('.modal').find('.alert').addClass('alert-danger').removeClass('hide').text(result['message']);
                } else {
                    $(this_elem).closest('.modal').find('.alert').addClass('alert-success').removeClass('hide').text(result['message']);
                }
            });
    });
}