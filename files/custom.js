//$(document).on('page:fetch',   function() { NProgress.start(); });
//$(document).on('page:change',  function() { NProgress.done(); });
//$(document).on('page:restore', function() { NProgress.remove(); });

var newStoryMediaFilesFacebook = [];

var filterDate = '',
    browseType = 'day';

function verifyAddStory( f1 )
{

    var f2 = formatDate(filterDate),
        showStory = f2 == '';

    switch( browseType ) {
        case 'day':
            return showStory || f1 == f2;
            break;
        case 'month':
            return showStory || f1.slice(-6) == f2.slice(-6);
            break;
        case 'year':
            return showStory || f1.slice(-4) == f2.slice(-4);
            break;
    }

    return showStory;
}

function buildMfCropped( id, src )
{

}

function buildMfSelectableHtml( id, src )
{
    return '<div class="col-xs-2 attachment facebook-photo mf_item mf_selected" data-mediafile-id="'+id+'">' +
                '<p><span class="glyphicon glyphicon-ok"></span></p>' +
                '<img src="'+src+'" width="165" height="145"/>' +
                '<div class="clear"></div>' +
            '</div>';
}

function getJournalStoryHtml( story_id, journal_container )
{
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_get_single_journal_story', {'id' : story_id}),
        async: true,
        cache: false
    }).done(function( result ) {
            if (result != '') {
                var no_stories = $(journal_container).find('.no_stories');
                if ( no_stories.length > 0 ) {
                    $(no_stories).remove();
                }

                $(journal_container).prepend(result);
            }
        });
}

function buildAddToGroupHtml( elem, html, groups )
{
    var groupsToSelect = '<div class="upper-public-profile-tooltip"></div>' +
                            '<div class="public-profile-drop">';

    if ( html ) {
        groupsToSelect += $(elem).closest('.dropdown-add-user-to-group').find('.add-to-group-popup-content').html();
    } else {
        $(groups).each(function(){
            group_id = $(this).data('id');
            if ( group_id !== undefined && group_id != '' ) {
                group_name = $(this).find('.group_name').text();
                groupsToSelect += '<div class="group_select_to_add_user tooltip-li" data-id="'+group_id+'"><i class="close-x-icon pull-left"></i>'+group_name+'</div>';
            }
        });
    }

    groupsToSelect +=       '<button class="btn btn-default btn_popover_add_to_group add-to-group-btn">Add To Group</button>' +
                        '</div>';

    return groupsToSelect;
}

function buildUsersHtml( result, canSelect, allSelected, allowRemoveLinks, avatar_size )
{
    var html = '';
    if ( result.length == 0 ) {
        //return message
        html += '<p>No users found.</p>';
    } else {
        var tagUsers = getTagsUser();

        $(result).each(function(){
            var elem = this;
            src = this.avatar ? this.avatar : 'http://placehold.it/50x50';

            var isUserSelected = false;
            if ( canSelect ) {
                if ( allSelected ) {
//                                isUserSelected = true;
                } else if ( tagUsers.length > 0 ) {
                    isUserSelected = verifyUserSelected( this.username, tagUsers );
                }
            }

            checked = isUserSelected ? 'checked' : '';
            hoverable = canSelect ? 'group-hoverable' : '';
            avatar_class = canSelect ? 'group-avatar' : 'contact-avatar';

            html += '<div class="col-xs-6 site-member user_item '+checked+' '+hoverable+'" data-id="'+this.id+'">' +
                        '<div class="'+avatar_class+'">';

            if ( canSelect ) {
                html +=     '<div class="img-mask"><span class="glyphicon glyphicon-ok"></span></div>';
            }

            html +=         '<img  class="img-circle" src="'+src+'" width="'+avatar_size+'" height="'+avatar_size+'" alt="" />' +
                        '</div>' +
                        '<div class="contactInfo">' +
                            '<h2 class="username">' +
                                '<a href="'+this.public_profile_url+'" data-ajax="false" target="profile_'+this.username+'">'+this.username+'</a>' +
                            '</h2>';
            if ( allowRemoveLinks !== undefined && allowRemoveLinks != '' && !canSelect ) {
                html +=     '<button class="btn btn-default unstar-member remove_user_from_group" data-history="false">Remove</button>';
            }

            if ( canSelect ) {
                html +=     '<span>Group name ???</span>';
            }

            html +=      '</div>' +
                    '</div>';
        });
    }

    return html;
}

function buildUsersSelectableHtml(result)
{
    var html = '';
    if ( result.length == 0 ) {
        //return message
        html += '<p>No users found.</p>';
    } else {
        html += '<h3>Most Contacted</h3>';
        var tagUsers = getTagsUser();

        $(result).each(function(){
            var elem = this;
            src = this.avatar ? this.avatar : 'http://placehold.it/45x45';

            var isUserSelected = false;
            if ( tagUsers.length > 0 ) {
                isUserSelected = verifyUserSelected( this.username, tagUsers );
            }

            checked = isUserSelected ? 'checked ' : '';
            active = isUserSelected ? 'active ' : '';

            /*html += '<div class="col-xs-6 site-member user_item group-hoverable '+checked+'" data-id="'+this.id+'">' +
                        '<div class="group-avatar">' +
                            '<div class="img-mask"><span class="glyphicon glyphicon-ok"></span></div>' +
                            '<img  class="img-circle" src="'+src+'" width="45" height="45" alt="" />' +
                        '</div>' +
                        '<div class="contactInfo">' +
                            '<h2 class="username">' +
//                                '<a href="'+this.public_profile_url+'" data-ajax="false" target="profile_'+this.username+'">'+
                                    this.username +
//                                '</a>' +
                            '</h2>' +
                            '<span>Group name ???</span>' +
                        '</div>' +
                    '</div>';*/
            html += '<div class="contact-hoverable ' + active + '" data-id="'+ this.id +'">' +
                        '<div class="contact-avatar">' +
                            '<div class="img-mask"><span class="glyphicon glyphicon-ok"></span></div>' +
                            '<img class="img-circle" src="'+ src +'" width="45" height="45" alt="">' +
                            '</div>' +
                            '<div class="contactInfo">' +
                            '<h2>'+ this.username +'</h2>' +
                            '<span>Stars received !?</span>' +
                        '</div>' +
                    '</div>';
            bindUserItem();
        });
    }

    return html;
}

function getStoryActionHandler(elem) {
    var story_container = $(document).find('#story_show_page');
    if ( story_container.length > 0 ) {
        var story_id = $(story_container).data('story-id');
        return handler = Routing.generate('wmds_get_selected_mediafiles', { id: story_id });
    } else {
        return handler = $(elem).data('handler');
    }
}

function getEditStoryPage( elem ) {
    var handler = $(elem).attr('href');
    console.log('cusotm.js 196');
    $.ajax({
        type: "POST",
        url: handler,
        async: true,
        cache: false
    }).done(function( result ) {
            if (result != '') {
//                    $('#modal_container').find('#modal_story_select_mf').modal('hide');
                $('#modal_container #modal_story_details').html(result);
                $('#modal_container').find('#modal_story_details').modal('show');
            }
        });
}

function refreshStoryDetails( story_container, story_details ) {
    for ( var key in story_details ) {
        $(story_container).find('.story_'+key).text(story_details[key]);
        if ( key == 'location' ) {
            if ( story_details[key] != '' ) {
                $(story_container).find('.story_'+key).parent().removeClass('hide');
            } else {
                $(story_container).find('.story_'+key).parent().addClass('hide');
            }
        }
    }
}

function ImageLoaded(elem) {
    $(elem).closest('.frame').find('.preload_image').css('display', 'none');
    $(elem).removeClass('hide');
}

function getTagsUser() {
    return $(document).find('.tagsinput .tag.tag_user');
}

function getTagsGroup() {
    return $(document).find('.tagsinput .tag.tag_group');
}

function verifyUserSelected( username, tagsUser ) {
    var found = false;

    $(tagsUser).each(function(){
        if ( username == $(this).data('username') ) {
            found = true;
            return false;
        }
    });

    return found;
}

function getSelectUsersBlock( contentType, id, action ){
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_get_select_users'),
        async: true,
        cache: false,
        data: { contentType: contentType, id: id, action: action }
    }).done(function( result ) {
            $('#modal_container #modal_share_content').modal('hide');
            $('#modal_container #modal_select_users .select_users_container').html(result);
            $('#modal_container #modal_select_users').modal('show');
        });
}

function reloadImage( selector, src ){
    var timestamp = new Date().getTime();

    $(selector).attr('src', src+"?random=" + timestamp);
}

function updateCropCoords(c){
    var form = $(document).find('#form_crop_photo');
    $(form).find('.alert-danger').addClass('hide');

    $(form).find('#x').val(c.x);
    $(form).find('#y').val(c.y);
    $(form).find('#w').val(c.w);
    $(form).find('#h').val(c.h);
}



function addContact( handler, action, elem ) {
    $.ajax({
        type: "POST",
        url: handler,
        async: true,
        cache: false
    }).done(function( result ) {
            if (result != '') {
                if ( result['error'] ) {
                    alert(result['message']);
                } else {
                    if ( action == 'add' ) {
                        $(elem).html('<i class="PublicProfile-add-hover"></i> <span class="pull-right hidden pp-actions-text">Remove Contact</span>');
                        $(elem).data('action', 'remove');
                    } else {
                        if ( $(elem).hasClass('no-text') ) {
                            $(elem).closest('li').remove();
                        } else {
                            $(elem).html('<i class="PublicProfile-add"></i> <span class="pull-right hidden pp-actions-text">Add Contact</span>');
                        }
                        $(elem).data('action', 'add');
                    }
                }
            }
        });
}

function isUrlExternal (url) {
    var current_domain = location.href;
    current_domain = current_domain.replace('http://','').replace('https://','').split('/')[0];
    var url_domain = url.replace('http://','').replace('https://','').split('/')[0];

//    console.log(domain(location.href));
//    console.log(domain(url));
//    console.log(domain(location.href) !== domain(url));return false;

//    if ( typeof(url) === undefined || url == '' || url == '#' || domain(location.href) !== domain(url) ) {
//        return true;
//    }

    return url_domain !== current_domain;
}

function addTagForm(collectionHolder) {
    // Get the data-prototype explained earlier
    var prototype = collectionHolder.data('prototype');

    // get the new index
    var index = collectionHolder.data('index');

    // Replace '__name__' in the prototype's HTML to
    // instead be a number based on how many items we have
    var newForm = prototype.replace(/__name__/g, index);

    // increase the index with one for the next item
    collectionHolder.data('index', index + 1);

    // Display the form in the page in an li, before the "Add a tag" link li
    var $newFormLi = $('<li></li>').append(newForm);
    collectionHolder.append($newFormLi);
}

function formatDate( date ) {

    if ( date === undefined || date == '' || Object.prototype.toString.call(date) !== "[object Date]" || isNaN(date.getTime()) ) {
        return '';
    }

    var day = date.getDate();
    day = day+"";
    day = day.length == 1 ? '0'+day : day;

    var month = date.getMonth() + 1;
    month = month+"";
    month = month.length == 1 ? '0'+month : month;

    var year = date.getFullYear();

    return date_str = day + '/' + month + '/' + year;
}

function pageTitleByPage(date, type) {
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' );

    if ( date === undefined || date == '' || ( Object.prototype.toString.call(date) === '[object Date]' && !isFinite(date) ) ) {
        return 'All';
    }

    if ( type == 'day' ) {
        var day = date.getDate();
        day = day + "";
        day = day.length == 1 ? '0'+day : day;
//        console.log(day + ' ' + months[date.getMonth()] + ' ' + date.getFullYear());

        return day + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    } else if ( type == 'month' ) {
        return months[date.getMonth()] + ' ' + date.getFullYear();
    } else if ( type == 'year' ) {
        return date.getFullYear();
    } else {
        return '';
    }
}

function validUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

function goToNextStep( handler, create_type, back_target ) {
    $.ajax({
        type: "POST",
        url: handler,
        async: true,
        cache: false,
        data: { mediaFiles: newStoryMediaFiles, create_type: create_type, mediaFilesFacebook: newStoryMediaFilesFacebook }
    }).done(function( result ) {
            if (result != '') {
                $('#modal_container').find('#modal_story_select_mf').modal('hide');
                $('#modal_container #modal_story_details').html(result);
                $('#modal_container #modal_story_details .btn_story_back').attr('data-target', back_target);
                $('#modal_container').find('#modal_story_details').modal('show');
            }
        });
}

function customJS() {
    $(document).ready(function(){

        $('#calendar').datepicker({
            multidate: false,
            todayHighlight: true,
            templates: {
                leftArrow: '<span class="left-cal-nav"></span>',
                rightArrow: '<span class="right-cal-nav"></span>'
            },
            weekStart: 1
        }).on('changeDate', function(e){
                var keywords = $(document).find('#header_search').val();
                var filterType = $(document).find('.filter_story_method').data('filter');

                filterDate = e.date;
                browseType = 'day';

                browseByDate(keywords, filterType, this, false );
        }).on('changeMonth', function(e){
                var keywords = $(document).find('#header_search').val();
                var filterType = $(document).find('.filter_story_method').data('filter');

                filterDate = e.date;
                browseType = 'month';

                browseByDate(keywords, filterType, this, false );
        }).on('changeYear', function(e){
                var keywords = $(document).find('#header_search').val();
                var filterType = $(document).find('.filter_story_method').data('filter');

                filterDate = e.date;
                browseType = 'year';

                browseByDate(keywords, filterType, this, false );
        });

        $(window).on('load', function() {
            $('#calendar .day:not(.old):not(.new)').each(function() {
               if ($(this).html() == '2' || $(this).html() == '19' || $(this).html() == '23')
                    $(this).addClass('has-story');
            });
        });

    //Ajax actions
        $(document).on('click', '.link_ajax_action', function(e){
            e.preventDefault();
            var handler = $(this).attr('href');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                console.log('custom.js 459');
                if ( result['message'] ) {
                    //Star/Unstar Story
                    if ( $(this_elem).hasClass('star_action') ) {
                        if ( result.error == true ) {
                            var modal_alert = $(document).find('.modal#modal_alert');
                            $(modal_alert).find('.modal-body').html(result['message']);
                            $(modal_alert).modal('show');
                        }
                        var nr_stars_container = $(document).find('.story_nr_stars');
                        var nr_stars = $(nr_stars_container).text();
                        nr_stars = parseInt(nr_stars);
                        if ( result['starred'] ) {
                            $(this_elem).html('<span class="story-icon unstar"></span> Unstar');
                            nr_stars = nr_stars + 1;
                        } else {
                            $(this_elem).html('<span class="story-icon star"></span> Star');
                            nr_stars = nr_stars - 1;
                        }
                        $(nr_stars_container).text(nr_stars + ' Stars');
                    //Star/Unstar MediaFile
                    } else if ( $(this_elem).hasClass('star_mediafile') ) {
                        if ( result['starred'] ) {
                            $(this_elem).find('i').removeClass('my-journal-star').addClass('my-journal-star-hover');
                        } else {
                            $(this_elem).find('i').removeClass('my-journal-star-hover').addClass('my-journal-star');
                        }
                    } else {
                        var modal_alert = $(document).find('.modal#modal_alert');
                        $(modal_alert).find('.modal-body').html(result['message']);
                        $(modal_alert).modal('show');
                    }

                }
            });
        });

    //Submit Forms
        $(document).on('click', '.btn_submit_form', function(){
            var form = $(this).closest('form');
            var handler = $(form).attr('action');
            var reason = $('#wmds_adminbundle_reporttype_reason').val();
            var this_elem = this;
            var data = $(form).serializeArray();

            if ( reason == '' ) {
                $('#wmds_adminbundle_reporttype_reason').focus();
                return;
            }

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false,
                data: data
            }).done(function( result ) {
                    if ( result['message'] ) {
                        if ( result['error'] ) {
                            $(form).find('.alert').removeClass('hide').addClass('alert-danger').text(result['message']);
                        } else {
                            $(form).find('.alert').removeClass('hide').addClass('alert-success').text(result['message']);
                        }

                    }
                });
        });

    //Delete avatar
        $(document).on('click', '#btn_delete_avatar', function(){
            var handler = $(this).data('handler');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( result['error'] ) {
                            alert(result['msg']);
                        } else {
                            $(document).find('.view_avatar img').attr('src', 'http://www.placehold.it/150x150');
                            $(document).find('.navbar-avatar img').attr('src', 'http://www.placehold.it/50x50');
                            $(this_elem).addClass('hide');
                        }
                    }
                });
        });

        $(document).on('click', '.btn_add_story, .btn_add_story_mf', function(){
            newStoryMediaFiles = [];
            newStoryMediaFilesFacebook = [];
        });

        //Link MediaFiles from
        $(document).on('click', '.btn_link_from', function(){
            var handler = $(this).data('handler');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        $('#modal_container').find('#modal_story').modal('hide');
                        var current_modal = $('#modal_container #modal_story_select_mf');
                        $(current_modal).html(result);
                        $(document).find('.btn_story_back').attr('data-target', '#modal_story');

                        $(newStoryMediaFiles).each(function(){
                            $(current_modal).find('.entity_mediafiles .attachment[data-mediafile-id="'+this+'"]').addClass('mf_selected');
                        });

                        $(newStoryMediaFilesFacebook).each(function(){
                            $(current_modal).find('.entity_mediafiles_facebook .attachment[data-mediafile-id="'+this+'"]').addClass('mf_selected');
                        });


                        $('#modal_container').find('#modal_story_select_mf').modal('show');

    ///                   removeLoading();
                    }
                });
        });

        /**
         * Load more data from facebook
         * */
        $(document).on('click', '.loadMoreData', function(){

            var mf_facebook_container = $(document).find('#modal_story_select_mf ul.entity_mediafiles_facebook li.mf_selected');
            if ( mf_facebook_container.length ) {
                $(mf_facebook_container).each(function(){
                    var mf_id = $(this).data('mediafile-id');
                    if ( newStoryMediaFilesFacebook.indexOf(mf_id) < 0 ) {
                        newStoryMediaFilesFacebook.push(mf_id);
                    }
                });
            }


            var data = $(this).attr('data');
            var albumId = $(this).attr('data-id');
            var type = $(this).attr('data-type');
            var selected = "";

            $.ajax({
                type: "GET",
                url: data,
                dataType: 'json',
                success: function (resp) {
                    if ( resp.data ) {
                        var html = "";
                        var pagination = "";

                        if ( type == "photo" ) {

                            /**
                             * More photos
                             * */

                            $( resp.data ).each(function(  ) {
                                selected = "";

                                if ( newStoryMediaFilesFacebook.indexOf(parseInt(this.id)) != -1 ) {
                                    selected = "mf_selected";
                                }

                                html += '<li class="attachment save-ready '+ selected +'" data-mediafile-id="'+ this.id +'">\n\
                                        <div class="attachment-preview type-image subtype-jpeg landscape">\n\
                                            <div class="thumbnail">\n\
                                                <div class="centered">\n\
                                                    <img class="img-responsive img" width="120" src="'+ this.picture +'"/>\n\
                                                </div>\n\
                                            </div>\n\
                                            <a title="Deselect" href="#" class="check"><div class="media-modal-icon"></div></a>\n\
                                        </div>\n\
                                     </li>';
                            });

                            if ( resp.paging ) {
                                if ( resp.paging.previous ) {
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.previous +'" data-id="'+ albumId +'" data-type="photo">Previous</a>';
                                }
                                if ( resp.paging.next ) {
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.next +'" data-id="'+ albumId +'" data-type="photo">Next</a>';
                                }
                            }

                            $(".photosList" + albumId).html(html + '<div class="clearfix"></div>');
                            $("#loadMorePhotos" + albumId).html(pagination);

                        }
                        if ( type == "album" ) {

                             var albumCovers = [];
                             if ( resp.data ) {
                                $( resp.data).each(function(){

                                    html += '<div class="facebookAlbum">\n\
                                                <div class="facebookAlbumTitle" id="'+ this.id +'">\n\
                                                    <div class="col-md-2">\n\
                                                        <img class="img img-responsive" id="albumCover'+ this.id +'" width="190" src="" alt="album cover"/>\n\
                                                    </div>\n\
                                                    <div class="col-md-10">\n\
                                                        <b>' + this.name + '</b>\n\
                                                    </div>\n\
                                                </div>\n\
                                                <div class="clearfix"></div>\n\
                                                <div id="albumPhotos'+ this.id +'"></div>\n\
                                            </div>';
                                    albumCovers.push({'albumId': this.id, 'coverId': this.cover_photo});
                                });

                                 $("#facebookAlbums").html(html+ '<div class="clearfix"></div>');
                                 displayFacebookPhotos();
                            }

                            if ( resp.paging ) {
                                if ( resp.paging.previous ) {
                                    //<a href="#" class="loadMoreData" data="{{ albums['paging']['next'] }}" data-type="album">Next</a>
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.previous +'" data-type="album">Previous</a>';
                                }
                                if ( resp.paging.next ) {
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.next +'" data-type="album">Next</a>';
                                }
                            }
                            $("#facebookAlbums").append('<div id="albumsPagination">' + pagination + '</div>');

                            /**
                             * Get album covers here
                             * */
                            $.ajax({
                                type: "POST",
                                url: Routing.generate('wmds_facebook_album_covers'),
                                data: {data: albumCovers},
                                success: function (resp) {
                                    if ( resp.success ) {
                                        $( resp.covers).each(function(){
                                            if ( this.cover ) {
                                                $("#albumCover" + this.albumId).attr("src", this.cover.picture);
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        /**
                         * Videos pagination
                         * */
                        if ( type == "video" ) {

                            $( resp.data ).each(function(  ) {
                                selected = "";

                                if ( newStoryMediaFilesFacebook.indexOf(parseInt(this.id)) != -1 ) {
                                    selected = "mf_selected";
                                }

                                html += '<li class="attachment save-ready '+ selected +'" data-mediafile-id="'+ this.id +'">\n\
                                        <div class="attachment-preview type-image subtype-jpeg landscape">\n\
                                            <div class="thumbnail">\n\
                                                <div class="centered">\n\
                                                    <img class="img-responsive img" width="120" src="'+ this.picture +'"/>\n\
                                                </div>\n\
                                            </div>\n\
                                            <a title="Deselect" href="#" class="check"><div class="media-modal-icon"></div></a>\n\
                                        </div>\n\
                                     </li>';
                            });

                            if ( resp.paging ) {
                                if ( resp.paging.previous ) {
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.previous +'" data-type="video">Previous</a>';
                                }
                                if ( resp.paging.next ) {
                                    pagination += '<a href="#" class="loadMoreData" data="'+ resp.paging.next +'" data-type="video">Next</a>';
                                }
                            }

                            $("#facebookVideos").html(html + '<div class="clearfix"></div>');
                            $("#loadMoreVideos").html(pagination);

                        }
                    }
                }
            });
        });

        //Select Media Files from Gallery
        $(document).on('click', '#modal_story_select_mf .attachment', function(){
            var mf_counter = $(this).closest('.modal').find('.selection-count span');
            var nr = parseInt($(mf_counter).text()) ? parseInt($(mf_counter).text()) : 0;

            if ( $(this).hasClass('mf_selected') ) {
                $(this).removeClass('mf_selected');

                //decrement mediafiles counter
                if ( nr > 0 ) {
                    $(mf_counter).text(nr - 1);
                }

                var mf_id = $(this).data('mediafile-id');

                for( var i = newStoryMediaFiles.length; i--; ) {
                    if(newStoryMediaFiles[i] == mf_id) {
                        newStoryMediaFiles.splice(i, 1);
                    }
                }

                for( var i = newStoryMediaFilesFacebook.length; i--; ) {
                    if(newStoryMediaFilesFacebook[i] == mf_id) {
                        newStoryMediaFilesFacebook.splice(i, 1);
                    }
                }

            } else {
                $(this).addClass('mf_selected');

                //increment mediafiles counter
                $(mf_counter).text(nr + 1);
            }
        });

        //Add Story - next popup
        $(document).on('click', '.btn_story_next', function(e){
            e.preventDefault();

            //get next popup handler depending on story action(add/edit)
            var handler = getStoryActionHandler(this);
            var mf_container = $(document).find('#modal_story_select_mf .entity_mediafiles .mf_selected');
            var create_type = $(this).hasClass('no_mfs') ? 0 : 1;

            //add selected mediafiles to newStoryMediaFiles array
            if ( mf_container.length ) {
                $(mf_container).each(function(){
                    var mf_id = $(this).data('mediafile-id');
                    if ( newStoryMediaFiles.indexOf(mf_id) < 0 ) {
                        newStoryMediaFiles.push(mf_id);
                    }
                });
            }

            var mf_facebook_container = $(document).find('#modal_story_select_mf .entity_mediafiles_facebook .mf_selected');
            if ( mf_facebook_container.length ) {
                $(mf_facebook_container).each(function(){
                    var mf_id = $(this).data('mediafile-id');
                    if ( newStoryMediaFilesFacebook.indexOf(mf_id) < 0 ) {
                        newStoryMediaFilesFacebook.push(mf_id);
                    }
                });
            }

            goToNextStep(handler, create_type, '#modal_story_select_mf');
        });

    //Add medifile with direct link
        $(document).on('keyup', '.modal#modal_story #direct_link', function(e){
            var code = (e.keyCode ? e.keyCode : e.which);
            var direct_link = $(this).val();
            var alert_container = $(document).find('.modal#modal_story .alert');
            var this_elem = this;

            if( code == 13 ) {
                if ( !validUrl(direct_link) ) {
                    $(alert_container).text('The url is invalid. Please enter the url of an image or Youtube/Vimeo video.').removeClass('hide');
                    return;
                }

                //ajax - save mediafile
                $.ajax({
                    type: "POST",
                    url: Routing.generate('wmds_mediafile_direct_link'),
                    async: true,
                    cache: false,
                    data: { direct_link: direct_link, isNoteMF: 0 }
                }).done(function( result ) {
                        if ( result.hasOwnProperty("error") ) {
                            $(alert_container).text(result['message']).removeClass('hide');
                        } else {
                            $(alert_container).text('').addClass('hide');
                            $(this).closest('.modal#modal_story').modal('hide');
                            $(this_elem).val('');
                            newStoryMediaFiles.push(result['mediaFile_id']);
                            goToNextStep(result['next_link'], 1, '#modal_story');
                        }
                    });
            }
        });

    //Remove mediaFile from new story selected mediaFiles
        $(document).on('click', '.remove_mf_from_story', function(e){
            e.preventDefault();

            var mf_elem = $(this).closest('.mf_item');
            var mf_id = $(mf_elem).data('mediafile-id');

            if ( $(this).closest('ul').hasClass('from_social') ) {
                for( var i = newStoryMediaFilesFacebook.length; i--; ) {
                    if ( newStoryMediaFilesFacebook[i] == mf_id ) {
                        newStoryMediaFilesFacebook.splice(i, 1);
                    }
                }
            } else if ( $(this).closest('.gallery_listing').hasClass('note_mfs_container') ) {
                for( var i = noteMediafiles.length; i--; ) {
                    if ( noteMediafiles[i] == mf_id ) {
                        noteMediafiles.splice(i, 1);
                    }
                }
            } else {
                for( var i = newStoryMediaFiles.length; i--; ) {
                    if ( newStoryMediaFiles[i] == mf_id ) {
                        newStoryMediaFiles.splice(i, 1);
                    }
                }
            }

           $(mf_elem).remove();
        });

    //Edit Story
        $(document).on('click', '.btn_edit_story', function(e){
            e.preventDefault();

            $(this).closest('.modal').modal('hide');
            getEditStoryPage(this);
        });

    //Submit Edit Story form
        $(document).on('submit', 'form#form_edit_story', function (e) {
            e.preventDefault();

            var handler = $(this).attr('action');
            var data = $(this).serializeArray();
            var this_elem = this;
            var alert_container = $(this).find('.alert-error');
            var current_modal = $(this).closest('.modal');

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false,
                data: data
            }).done(function( result ) {
                    if (result != '') {
                        if ( result.hasOwnProperty("error") ) {
                            if ( result['error'] ) {
                                var alert_container = $(this_elem).closest('.modal').find('.alert-error');
                                $(alert_container).removeClass('hide');
                                $(alert_container).text(result['message']);
                            } else {
                                var story_container = $(document).find('#story_show_page');
                                if ( story_container.length == 0 ) {
                                    story_container = $(document).find('.one-story-listed[data-id="'+result['story']['id']+'"]');
                                    if ( result['story']['location'] == '' ) {
                                        $(story_container).find('.story_location').closest('li.story-date').addClass('hide');
                                    } else {
                                        $(story_container).find('.story_location').closest('li.story-date').removeClass('hide');
                                    }
                                }
                                refreshStoryDetails(story_container, result['story']);
                                $(current_modal).modal('hide');
                            }

                        } else {
                            $('#modal_container #modal_story_details').html(result);
                        }
                    }
                });
        });

    //Send To Edit Story Page
        $(document).on( 'click', '.btn_send_to_edit', function(e){
            e.preventDefault();

            var handler = $(this).attr('href');
            $('.modal').modal('hide');
        } );

    //Add media files to existing story
        $(document).on('click', '.btn_story_add_mfs', function(){
            var story_container = $(document).find('#story_show_page');

            if ( story_container.length == 0 ) {
                return;
            }

            var story_id = $(story_container).data('story-id')
            var handler = Routing.generate('wmds_story_add_mediafiles', { id: story_id });
            var data = $(this).serializeArray();
            data.push({name: "mediaFiles", value: newStoryMediaFiles}, { name:"mediaFilesFacebook", value: newStoryMediaFilesFacebook });

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false,
                data: data
            }).done(function( result ) {
                    if (result != '') {
                        $('#modal_container .modal').modal('hide');
                    }
                });
        });

    //Submit new story form
        $(document).on('submit', 'form#form_new_story', function (e) {
            e.preventDefault();

            var handler = $(this).attr('action');
            var data = $(this).serializeArray();
            data.push({name: "mediaFiles", value: newStoryMediaFiles}, { name:"mediaFilesFacebook", value: newStoryMediaFilesFacebook });

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false,
                data: data
            }).done(function( result ) {
                    if (result != '') {
    //                    $('#modal_container').find('#modal_story_select_mf').modal('hide');
                        $('#modal_container #modal_story_details').html(result);
                        $('#modal_container').find('#modal_story_details').modal('show');
                    }
                });
        });

        $(document).on('click', '.btn_story_back', function(){
            var back_target = $(this).data('target');
            $('.modal').modal('hide');
            $(back_target).modal('show');
        });

    //Star / Unstar User
        $(document).on('click', '.star_user_action', function(e){
            e.preventDefault();
            var handler = $(this).attr('href');
            var action = $(this).data('action');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( result['error'] ) {
                            alert(result['message']);
                        } else {
                            if ( action == 'star' ) {
                                if ( $(this_elem).hasClass('no-text') ) {
                                    //$(this_elem).html('<i class="PublicProfile-star PublicProfile-star-hover quick-star"></i>');
                                    $(this_elem).attr('title', 'UnStar');
                                    $(this_elem).addClass('starred');
                                    $(this_elem).data('action', 'unstar');
                                } else {
                                    $(this_elem).html('<i class="PublicProfile-star-hover"></i> <span class="pull-right hidden pp-actions-text">UnStar User</span>');
                                }
                                $(this_elem).data('action', 'unstar');
                            } else {
                                if ( $(this_elem).hasClass('no-text') ) {
                                    //$(this_elem).html('<i class="PublicProfile-star quick-star"></i>');
                                    //$(this_elem).attr('title', 'Star');
                                    $(this_elem).attr('title', 'Star');
                                    $(this_elem).removeClass('starred');
                                    $(this_elem).data('action', 'star');
                                } else {
                                    $(this_elem).html('<i class="PublicProfile-star"></i> <span class="pull-right hidden pp-actions-text">Star User</span>');
                                    $(this_elem).closest('.contact').slideUp(function(){
                                        $(this).remove();
                                    });
                                }
                                $(this_elem).data('action', 'star');
                            }
                        }
                    }
                });
        });

    //Show modal to confirm remove user from contacts
    //Add contact
        $(document).on('click', '.add_user_action', function(e){
            e.preventDefault();

            var handler = $(this).attr('href');
            var action = $(this).data('action');
            var this_elem = this;

            if ( action == 'remove' ) {
                //show modal
                var username = $(this).closest('li').find('.username a').text();
                var modal_confirm_action = $(document).find('.modal#modal_confirm_action');
                var btn_action = $(modal_confirm_action).find('.btn_action_confirmed');

                if ( username != '' ) {
                    $(modal_confirm_action).find('.modal-body').text('Do you want to remove "'+username+'" from your contacts?');
                } else {
                    $(modal_confirm_action).find('.modal-body').text('Are you sure you want to remove this user from your contacts?');
                }

                $(btn_action).data('handler', handler);
                $(btn_action).data('action', 'remove_contact');
                $(modal_confirm_action).modal('show');
            } else {
                addContact( handler, action, this_elem );
            }
        });

    //Block / UnBlock User
        $(document).on('click', '.block_user_action', function(e){
            e.preventDefault();
            var handler = $(this).attr('href');
            var action = $(this).data('action');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( result['error'] ) {
                            alert(result['message']);
                        } else {
                            if ( action == 'block' ) {
                                if ( $(this_elem).hasClass('no-text') ) {
                                    $(this_elem).html('<i class="PublicProfile-delete-hover smallAction"></i>');
                                    $(this_elem).attr('title', 'Unblock');
                                } else {
                                    $(this_elem).html('<i class="PublicProfile-delete-hover smallAction"></i> <span class="pull-right hidden pp-actions-text">Unblock User</span>');
                                }

                                $(this_elem).data('action', 'unblock');
                            } else {
                                if ( $(this_elem).hasClass('no-text') ) {
                                    $(this_elem).html('<i class="PublicProfile-delete smallAction"></i>');
                                } else {
                                    $(this_elem).html('<i class="PublicProfile-delete smallAction"></i> <span class="pull-right hidden pp-actions-text">Block User</span>');
                                    $(this_elem).attr('title', 'Block');
                                }

                                $(this_elem).data('action', 'block');
                            }
                        }
                    }
                });
        });

    //Show / Hide Full Gallery
        $(document).on('click', '.btn_show_full_gallery', function(e){
            e.preventDefault();

            var handler = $(this).attr('href');
            var this_elem = this;
            var btn_text = '';

            if ( $(this_elem).text() != 'Show Full Gallery' ) {
                btn_text = 'Show Full Gallery';
            } else {
                btn_text = 'Hide Full Gallery';
            }

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( result['error'] ) {
                            alert(result['message']);
                        } else {
                            var mediaFiles = '';

                            $( result['mediaFiles']).each(function(){
                                var starred = this['starred'] ? 'glyphicon-star' : 'glyphicon-star-empty';

                                mediaFiles += '<li class="attachment save-ready show_single_mediafile" data-mediafile-id="'+this['id']+'" data-show-handler="'+this['link_show']+'">' +
                                                '<div class="attachment-preview type-image subtype-jpeg landscape">' +
                                                    '<div class="thumbnail">' +
                                                        '<div class="centered">' +
                                                            '<img src="'+this['src']+'" alt="" width="100"/>' +
                                                        '</div>' +
                                                    '</div>' +

                                                    '<div class="mf_actions_container">' +
                                                        '<div class="mf_actions_bg"></div>' +
                                                        '<div class="mf_actions_icons">' +
                                                            '<a href="#" class="mf_action_icon"><i class="glyphicon glyphicon-plus"></i></a>' +
                                                            '<a href="#" class="mf_action_icon"><i class="glyphicon glyphicon-share-alt"></i></a>' +
                                                            '<a href="' + this['link_star'] + '" title="" class="mf_action_icon link_ajax_action star_mediafile" data-history="false"><i class="glyphicon '+starred+'"></i></a>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</li>';

                            });

                            $(this_elem).closest('.profile_section').find('ul').html(mediaFiles);
                            $(this_elem).text(btn_text);
                            $(this_elem).attr('href', result['url']);
                        }
                    }
                });
        });

    //Show / Hide Full Description
        $(document).on('click', '.btn_story_show_more', function(e){
            e.preventDefault();

            var handler = $(this).attr('href');
            var action = $(this).data('action');
            var this_elem = this;
            var btn_icon = '';
            var btn_action = '';

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( result['error'] ) {
                            alert(result['message']);
                        } else {
                            if ( action == 'hide' ) {
                                btn_icon = '<i class="glyphicon glyphicon-chevron-down"></i>';
                                btn_action = 'show';
                            } else {
                                btn_icon = '<i class="glyphicon glyphicon-chevron-up"></i>';
                                btn_action = 'hide';
                            }

                            $(this_elem).closest('.story_container').find('.story_description').html( result['message'] );
                            $(this_elem).html(btn_icon);
                            $(this_elem).attr('href', result['url']);
                            $(this_elem).data('action', btn_action);
                        }
                    }
                });
        });

        $('#modal_delete_story').on('show.bs.modal', function(e){
            var rt = e.relatedTarget,
                handler = $(rt).attr('data-handler'),
                title = '',
                this_modal = this;
    console.log('rt',rt);
            //Add text to delete story modal
            //from story list
            if ( $(rt).hasClass('delete_story_from_list') ) {
                title = $(rt).closest('.story').find('.story-title').text();
                console.log('here');
            //from Single Page
            } else {
                console.log('por here');
                title = $(document).find('.single-story-title').text();
            }
            console.log('title',title);
            $(this).find('.modal-title span.storyTitle').text(title);

            $('.btn_delete_confirmed').unbind('click').bind('click', function(e){
                e.preventDefault();

                $.ajax({
                    type: "POST",
                    url: handler,
                    async: true,
                    cache: false
                }).done(function( result ) {
                        if (result != '') {
                            if ( result['error'] ) {
                                //alert error message
                                $('#modal_alert_message .alert').attr('class', 'alert alert-danger').text(result['message']);
                                $('#modal_alert_message').modal('show');
                            } else {
                                if ( $(rt).hasClass('delete_story_from_list') ) {
                                    var story = $(document).find('.one-story-listed[data-id="'+result['id']+'"]');
                                    $(story).remove();
                                    $(this_modal).modal('hide');
                                } else {
                                    window.location = result['redirect'];
                                }

                            }
                        }
                    });
            })
        });

        $(document).on('click', '.btn_delete_confirmed', function(e){
            e.preventDefault();

    //        var form_delete = $(document).find('form#form_delete_story');
    //        if ( form_delete.length ) {
    //            $(form_delete).submit();
    //        }
        });

        $(document).on('hide.bs.modal', '#modal_confirm_delete_mf', function(e){
            $(this).find('.btn_delete_mf_confirmed').unbind('click');
        });

        $(document).on( 'show.bs.modal', '#modal_confirm_delete_mf', function(e){
            var rt = e.relatedTarget,
                back_modal = $(rt).closest('.modal').attr('id'),
                mf_elem,
                mf_id,
                this_modal = this;

            if ( typeof back_modal !== 'undefined' && back_modal == 'modal_show_mediafile' ) {
                mf_id = $(rt).attr('data-mediafile-id');
                mf_elem = $(document).find('.container .entity_mediafiles .attachment[data-mediafile-id="'+mf_id+'"]');
            } else {
                mf_elem = $(rt).closest('.attachment');
                mf_id = $(mf_elem).attr('data-mediafile-id');
            }

            $(this).find('.btn_delete_mf_confirmed').bind('click', function(event){
                event.preventDefault();

                $.ajax({
                    type: "POST",
                    url: Routing.generate('wmds_web_mediafile_delete', {'id': mf_id}),
                    async: true,
                    cache: false
    //                data: {id: mf_id}
                }).done(function( result ) {
                        if (result != '') {
                            if ( result['error'] ) {
                                //alert error message
                                $('#modal_alert_message .alert').attr('class', 'alert alert-danger').text(result['message']);
                                $('#modal_alert_message').modal('show');
                            } else {
                                //remove mediafile html element from list
                                $(mf_elem).remove();
                            }
                        }
                    });
            });
        });

        $(document).on('click', '.mf_action_icon', function(e){
            e.preventDefault();

            var action = $(this).data('action');

            if ( action == 'edit' ) {

            }
        });

        $(document).on('click', '.add_social_link', function(e){
            e.preventDefault();

            var collectionHolder = $('ul.userSocials');
            collectionHolder.data('index', collectionHolder.find('li').length);

            addTagForm(collectionHolder);
        });

        $(document).on('click', '.btn_create_story', function(e){
            e.preventDefault();

            $('.story-action-create').popover('destroy');
            var content = $('.capture_content').html();
    //        var content = '<button type="button" class="btn btn-default btn-lg btn-block btn_capture">Capture your Thoughts</button>';
    //        content += '<button type="button" class="btn btn-default btn-lg btn-block btn_capture">Add your Photo/Video moments</button>';
            $(this).popover({
                content: content,
                html: true,
                placement: 'bottom'
            });
            $(this).popover('show');

            $('.story-action-create').not(this).popover('hide');
        });

    //Show modal for Create New Group
        $(document).on('click', '.btn_group_popup', function(e){
            e.preventDefault();
            var handler = $(this).data('handler');

            $.ajax({
                type: "GET",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        $('.modal').modal('hide');
                        $('#modal_container #modal_new_group').html(result);
                        $('#modal_container #modal_new_group').modal('show');
                    }
                });
        });

    //Submit group form
        $(document).on('click', '.btn_submit_group_form', function(){
            $(this).closest('form').submit();
        });

    //Submit group form
        $(document).on('submit', 'form.form_group', function (e) {
            e.preventDefault();

            var handler = $(this).attr('action');
            var data = $(this).serializeArray();
            var group_name = $('#form_name').val();
            var form_id = $(this).attr('id');

            //get selected users to add to the new group
            var group_users = [];
            var selected_users = $(this).find('.found_users_list ul li.selected');
            $(selected_users).each(function(){
                group_users.push(($(this).find('span').text()));
            });

            data.push({name: "users", value: group_users});
            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false,
                data: data
            }).done(function( result ) {
                    if (result != '') {
                        var modal_group = $('#modal_container #modal_new_group');
                        if ( result.hasOwnProperty("error") ) {
                            var alert_container = $(modal_group).find('.alert');
                            if ( result['error'] ) {
                                $(alert_container).removeClass('hide');
                                $(alert_container).text(result['message']);
                            } else {
                                $(alert_container).addClass('hide');
                                $(modal_group).modal('hide');

                                var group_elem;
                                if ( form_id == 'form_edit_group' ) {
                                    group_elem = $(document).find('.group_listings li[data-id="'+result['id']+'"]');

                                    if ( group_elem.length == 1 ) {
                                        $(group_elem).find('.group_name').text(result['name']).attr('href', result['users_link']);
                                        $(group_elem).find('.group_edit').attr('data-handler', result['edit_link']);
                                        $(group_elem).find('.group_delete').attr('href', result['delete_link']);
                                    }
                                } else {
                                    var new_group = '<li data-id="'+result['id']+'">' +
                                        '<a data-history="false" href="'+result['users_link']+'" class="group_name">'+result['name']+'</a>&nbsp;' +
                                        '<a data-history="false" href="'+result['edit_link']+'" class="group-edit btn_group_popup"><i class="glyphicon glyphicon-pencil"></i></a>' +
                                        '<a data-history="false" data-toggle="modal" data-target="#modal_confirm_action" title="Delete Group" href="'+result['delete_link']+'" class="group_delete"><i class="glyphicon glyphicon-remove"></i></a>' +
                                        '</li>';

                                    var new_group = '<li data-id="'+result['id']+'">' +
                                                        '<a class="group_name" href="'+result['users_link']+'" data-history="false">'+result['name']+'</a>' +
                                                        '<button class="group-edit btn_group_popup pen-icon" data-handler="'+result['edit_link']+'" data-history="false"></button>' +
                                                    '</li>';

                                    $(document).find('.group_listings').append(new_group);

                                    group_elem = $(document).find('.group_listings li[data-id="'+result['id']+'"]');
                                }

                                //Show this group users
                                $(group_elem).find('.group_name').click();
                            }
                        } else {
    //                        $('#modal_container').find('#modal_story_select_mf').modal('hide');
                            $('#modal_container #modal_new_group').html(result);
                            $('#modal_container #modal_new_group').modal('show');
                        }
                    }
                });
        });

    //Show users in group filtered
        $(document).on('click', '.group_listings li .group_name', function(e){
            e.preventDefault();

            var
    //            filterDate = $('#calendar').datepicker('getDate'),
                keywords = $('#header_search').val(),
                filterType = $(document).find('.filter_story_method').data('filter');

            browseByDate( keywords, filterType, this, true );

    //        $(this).closest('.group_listings').find('li').removeClass('selected');
            $(this).closest('.group_listings').find('li').removeClass('active-group');
    //        $(this).closest('li').addClass('selected');
            $(this).closest('li').addClass('active-group');
        });

    //Sort contacts
        $(document).on('click', '.sort_by a', function(e){
            e.preventDefault();
        });

        $(document).on('click', '.sort_method_option', function(){

            var selected_option = $(this).text();
            var sort_method = $(document).find('.sort_method');

            $(this).text($(sort_method).text());
            $(sort_method).text(selected_option);
            var handler = $(sort_method).closest('a').attr('href');

            $.ajax({
                type: "GET",
                url: handler,
                async: true,
                cache: false,
                data: { sort: selected_option }
            }).done(function( result ) {
                    if (result != '') {

                    }
                });
        });

    //My Journal - filter stories
        $(document).on('click', '.filter_stories a', function(e){
            e.preventDefault();
        });

        $(document).on('click', '.filter_story_method_option', function(e){
            e.preventDefault();

            var selected_option = $(this).text();
            var filterType = $(this).data('filter');
            var filter_story_method = $(document).find('.filter_story_method');

            $(this).text($(filter_story_method).text());
            $(this).attr('data-filter', $(filter_story_method).data('filter'));

            $(filter_story_method).text(selected_option);
            $(filter_story_method).attr('data-filter', filterType);

            var handler = $(filter_story_method).closest('a').attr('href');

    //        var filterDate = $('#calendar').datepicker('getDate');
            var keywords = $('#header_search').val();

            browseByDate( keywords, filterType, this, false );
        });

    //Show modal to confirm group deletion
        $(document).on('click', '.group_listings .group_delete', function(e){
            e.preventDefault();

            var handler = $(this).attr('href');
            var group_id = $(this).attr('data-group-id');
            var group_name = $(this).closest('li').find('a.group_name').text();
            var modal_confirm_action = $(document).find('.modal#modal_confirm_action');
            var btn_action = $(modal_confirm_action).find('.btn_action_confirmed');

            $(modal_confirm_action).find('.modal-body').text('Are you sure you want to delete Group "'+group_name+'" ?');
            $(btn_action).data('handler', handler);
            $(btn_action).data('group-id', group_id);
            $(btn_action).data('action', 'delete_group');
            $(modal_confirm_action).modal('show');
        });

        $(document).on('click', '.modal#modal_confirm_action .btn_action_confirmed', function(){
            var handler = $(this).data('handler');
            var group_id = $(this).data('group-id');
            var action = $(this).data('action');
            var this_elem = this;

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result != '') {
                        if ( !result['error'] ) {
                            if ( action == 'delete_group' ) {
                                $(document).find('.group_listings li[data-id="'+result['id']+'"]').remove();
                                $(this_elem).closest('.modal').modal('hide');
                            } else if ( action == 'remove_contact' ) {
                                var user_elem = $(document).find('.contacts_container .contact[data-id="'+result['id']+'"]');

                                if ( user_elem.length > 0 ) {
                                    $(user_elem).remove();
                                } else {
                                    var elem = $(document).find('.public-profile-actions .add_user_action');
                                    $(elem).html('<i class="PublicProfile-add"></i> <span class="pull-right hidden pp-actions-text">Add Contact</span>');
                                    $(elem).data('action', 'add');
                                }

                                $(this_elem).closest('.modal').modal('hide');
                            }
                        } else {
                            var modal_alert = $(document).find('.modal#modal_alert');
                            $(modal_alert).find('.modal-body').html(result['message']);
                            $(modal_alert).modal('show');
                        }
                    }
                });
        });

    //Search users
        $(document).on('keyup', '.wmds_search_user', function(e){
            var code = (e.keyCode ? e.keyCode : e.which);
            var search = $(this).val();

            if( code == 13 && search != '' ) {
                $.ajax({
                    type: "POST",
                    url: Routing.generate('wmds_user_search'),
                    async: true,
                    cache: false,
                    data: { search: search },
                    dataType: 'json'
                }).done(function( result ) {
                        if (result) {
                            var found_user = '';
                            for ( var i in result ) {
                                if ( result.hasOwnProperty(i) ) {
                                    found_user += '<li class="user_item col-md-4" data-id="'+i+'">' +
                                                    '<img height="50" alt="" src="'+result[i].avatar+'">' +
                                                    '<span class="username">' + result[i].username + '</span>' +
                                                    '<div class="wmds_select_user"></div>' +
                                                   '</li>';
                                }
                            }
                            var found_users_list = $(document).find('.found_users_list ul');
                            var old_users_found = $(found_users_list).find('li:not(.checked)');
                            $(old_users_found).each(function(){
    //                            if ( !$(this).hasClass('checked') ) {
                                    $(this).remove();
    //                            }
                            });
                            $(found_users_list).prepend(found_user);
                        }
                    });
            }
        });

    //Select users
            $(document).on('click', '.found_users_list ul li', function(){
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
        });

    //MediaFile Actions
        $(document).on('click', '.gallery_listing .show_single_mediafile', function(e){
            e.preventDefault();
            var handler = $(this).data('show-handler');

            $.ajax({
                type: "POST",
                url: handler,
                async: true,
                cache: false
            }).done(function( result ) {
                    if (result) {
                        if ( !result['error'] ) {
                            var modal_mf = $('#modal_container').find('#modal_show_mediafile');
                            $(modal_mf).html(result);
                            $(modal_mf).modal('show');
                        }
                    }
                });
        });

    $(document).on('click', '.gallery-actions a', function(e){
        e.stopPropagation();
    });


    //Show/Hide MediaFile actions
        $(document).on('mouseenter', 'ul.gallery_listing li', function(){
            $(this).find('.mf_actions_container').show();
        });

        $(document).on('mouseleave', 'ul.gallery_listing li', function(){
            $(this).find('.mf_actions_container').hide();
        });

    //Search from header
        $('#btn_header_search').on('click', function(e){
            e.preventDefault();
            $('#form_header_search').submit();
        });



        $(document).on('hidden.bs.modal', '#modal_show_mediafile', function () {
            $(this).find('iframe').attr('src', '');
        })

    //Hide popover on focus out
        $(document).on('click', '.popover', function(){
            $(this).popover('destroy');
        });

    //Add User to Group
        $(document).on('click', '.add_user_to_group_action', function(e){
            e.preventDefault();

            $(document).find('.add_user_to_group_action').popover('destroy');
            var groups = $(document).find('.container ul.group_listings li'),
                group_id = 0,
                group_name = '',
    //            groupsToSelect = '<ul class="groups_selection">';
                groupsToSelect = '';

            if ( $(this).hasClass('single-user-add-to-group') ) {
                //action triggered in Public Profile Page
                groupsToSelect = buildAddToGroupHtml(this, true, groups);
            } else {
                //action triggered in My contacts & Groups Page
                groupsToSelect = buildAddToGroupHtml(this, false, groups);
            }

            $(this).popover({
                content: groupsToSelect,
                html: true,
                placement: 'bottom',
                title: ''
            });
            $(this).popover('show');
        });

    //Select Group to add User in it
        $(document).on('click', '.group_select_to_add_user', function(){
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');

            } else {
                $(this).addClass('selected');
            }
        });

    //Add User to Group Action
        $(document).on('click', '.btn_popover_add_to_group', function(){
    //        var user_id = $(this).closest('.contacts_container .container').data('id'),
            var user_id = $(this).closest('.contacts_container .contact').data('id'),
                groups = $(this).closest('.popover').find('.group_select_to_add_user.selected'),
                group_id,
                groupsSelected = [];

            if ( groups.length == 0 ) {
                return;
            }

            $(groups).each(function(){
                group_id = $(this).data('id');
                if ( group_id !== undefined && group_id != '' ) {
                    groupsSelected.push(group_id);
                }
            });

            //if action was triggered from Public Profile Page
            if ( user_id === undefined && user_id == '' ) {
                user_id = $(this).closest('.dropdown-add-user-to-group').data('id');
            }

            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_add_user_to_group', { id: user_id }),
                async: true,
                cache: false,
                data: { groups: groupsSelected }
            }).done(function( result ) {
                    $(document).find('.add_user_to_group_action').popover('destroy');
                    var first_group = $('.container').find('.group_listings li[data-id="'+$(groups[0]).data('id')+'"] .group_name');
                    if ( first_group.length ) {
                        $(first_group).click();
                    }
                });
        });

    //Remove User from Group
        $(document).on('click', '.remove_user_from_group', function(){
            var user_id = $(this).closest('.user_item').data('id'),
    //            group_id = $(this).closest('.groups_data_section').find('.group_listings li.selected').data('id'),
                group_id = $(this).closest('.groups_data_section').find('.group_listings li.active-group').data('id'),
                this_elem = this;

            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_remove_user_from_group', { id: user_id, group_id: group_id }),
                async: true,
                cache: false
            }).done(function( result ) {
                    $(this_elem).closest('.user_item').remove();
                });
        });


        /* NEW JS - Aleksandar Tosic */
        // $('.shared-stories-page .story-author').click(function(e){
        //     e.stopImmediatePropagation();
        //     if(!$(this).parents('.story-inner').hasClass('expanded')){
        //         $(this).closest('.story-footer').find('.story-footer-date').css('display', 'none');
        //         $(this).closest('.story-footer').find('.story-footer-options').css('display', 'block');
        //         $(this).parents('.story-inner').addClass('expanded');

        //         $(this).parents('.story-inner').find('.story-footer-date').css('display', 'none');
        //         $(this).parents('.story-inner').find('.story-footer-options').css('display', 'block');
        //     }else{
        //         $(this).closest('.story-footer').find('.story-footer-date').css('display', 'block');
        //         $(this).closest('.story-footer').find('.story-footer-options').css('display', 'none');
        //         $(this).parents('.story-inner').removeClass('expanded');
        //         $(this).parents('.story-inner').find('.story-footer-date').css('display', 'block');
        //         $(this).parents('.story-inner').find('.story-footer-options').css('display', 'none');

        //     }

        // });
        // $('.story-wrapper .story-open-options ').on('click', function(e) {
        //     e.preventDefault();
        //     if ($(this).closest('.story-footer').find('.story-footer-options').css('display') == 'none') {
        //         $(this).closest('.story-footer').find('.story-footer-date').css('display', 'none');
        //         $(this).closest('.story-footer').find('.story-footer-options').css('display', 'block');
        //         $(this).parents('.story-inner').addClass('expanded');
        //     }
        // });

        // $(document).on('click', function(e) {
        //     if (!$(e.target).closest('.story-footer').length) {
        //         $('.story-footer-options').each(function() {
        //             if ($(this).css('display') != 'none') {
        //                 $(this).closest('.story-footer').find('.story-footer-date').css('display', 'block');
        //                 $(this).css('display', 'none');
        //                 $(this).parents('.story-inner').removeClass('expanded');
        //             }
        //         });
        //     }
        //     else {
        //         $('.story-footer-options').not($(e.target).closest('.story-footer').find('.story-footer-options')).each(function() {
        //             if ($(this).css('display') != 'none') {
        //                 $(this).closest('.story-footer').find('.story-footer-date').css('display', 'block');
        //                 $(this).css('display', 'none');
        //             }
        //         });
        //     }
        // });

        $('.story-footer-options a').tooltip();

        // $(document).on('click', '.journal-story-open-options, .journal-story .story-heading', function() {

        //     alert('asdfasdf');
        //     if ($(this).closest('.journal-story').find('.story-options').css('display') == 'none') {
        //         $(this).closest('.journal-story').find('.story-options').css('display', 'block');
        //         $(this).closest('.journal-story').find('.story-content').addClass('gradient-bottom');
        //         $(this).closest('.journal-story').find('.story-inner').addClass('options-open');
        //     }
        //     else {
        //         $(this).closest('.journal-story').find('.story-options').css('display', 'none');
        //         $(this).closest('.journal-story').find('.story-content').removeClass('gradient-bottom');
        //         $(this).closest('.journal-story').find('.story-inner').removeClass('options-open');
        //     }
        // });

        //$(document).on('click', '.filter-elements', function() {
        //
        //    var filter_text =  ($('.my-gallery-page').length) ? $(this).text().substring($(this).text().lenght , $(this).text().length-3) : $(this).text() ;
        //   $(this).closest('.drop-filter').find('.dropdown-toggle-label').text(filter_text.replace(/[0-9]/g, ''));
        //
        //   $('.filter-wrapper > *').addClass('hide');
        //   $('.filter-wrapper > *' + $(this).attr('data-filter')).removeClass('hide');
        //
        //    $('.filter-elements').removeClass('current-filter');
        //    $(this).addClass('current-filter');
        //});


        $('.my-gallery-page')

        $('.modal').modal({show: false});
        $('.contacts-button i').tooltip();

        $(document).on('click', '.contacts-add-group', function() {

           $('#modal-add-group').find('.modal-username').text($(this).closest('.contact').find('.contact-name').text());
        });

        $(document).on('click', '.contacts-favourite', function() {

            if (!$(this).hasClass('favourited')) {
                $(this).addClass('favourited');
                $(this).find('i').attr('data-original-title', 'Unfavourite');
                $(this).attr('data-target', '#modal-unfavourite');
                $('#modal-favourite').find('.modal-username').text($(this).closest('.contact').find('.contact-name').text());
            }
            else {
                $('#modal-unfavourite').find('.modal-username').text($(this).closest('.contact').find('.contact-name').text());
            }
        });

        $(document).on('click', '#modal-unfavourite .modal-yes', function() {

            var contactButton = $('.contact[data-name="' + $('#modal-unfavourite').find('.modal-username').text() + '"').find('.contacts-favourite');

            contactButton.removeClass('favourited');
            contactButton.find('i').attr('data-original-title', 'Favourite');
            contactButton.attr('data-target', '#modal-favourite');
        });

        $(document).on('click', '.contacts-delete', function() {

           $('#modal-delete-contact').find('.modal-username').text($(this).closest('.contact').find('.contact-name').text());
        });

        $(document).on('click', '#modal-delete-contact .modal-yes', function() {

            var contact = $('.contact[data-name="' + $('#modal-delete-contact').find('.modal-username').text() + '"');
            contact.remove();
        });

        $(document).on('click', '.sort-elements', function() {

            $('.sort-elements').removeClass('hide');
            $(this).closest('.drop-filter').find('.dropdown-toggle-label').text($(this).text().replace(/[0-9]/g, ''));
            $(this).addClass('hide');

            var elements = new Array();
            $('.sort-wrapper > *').each(function() { elements.push($(this)); });
            var sortBy = $(this).attr('data-sort');
            var orderBy = $(this).attr('data-order');

            for (var i = 0; i < elements.length - 1; i++) {
                for (var j = i + 1; j < elements.length; j++) {
                    if (orderBy == 'asc' && elements[i].attr(sortBy) > elements[j].attr(sortBy) ||
                        orderBy == 'desc' && elements[i].attr(sortBy) < elements[j].attr(sortBy)) {

                        var smth = elements[i];
                        elements[i] = elements[j];
                        elements[j] = smth;
                    }
                }
            }

            for (var i = 0; i < elements.length; i++)
                elements[i].detach().appendTo('.sort-wrapper');
        });

        //$('#create-new-story #date-input').datepicker({format: "DD, MM dd yyyy"});
        //$('#create-new-story #time-input-picker').timepicker({step: 1, timeFormat: 'H:i'});
    });

//Download Content
    $(document).on('click', '.btn_download_content', function(e){
        e.preventDefault();

        var handler = $(this).attr('href');

        location.href = handler;

//        $.ajax({
//            url: Routing.generate('wmds_remove_user_from_group', { id: user_id, group_id: group_id }),
//            type: "POST",
//            dataType: "json",
//            success: function(result){
//                console.log(resp);
//                if ( result.hasOwnProperty("error") ) {
//                    alert(result['error']);
//                } else {
//
//                }
//            },
//            error: function(x, y, z){
//                //console.log( x );
//            }
//        });
    });

    //On hover checkbox
    $(document).on('mouseenter', '.single-checkbox', function(){
        $(this).addClass('check-grey-icon');
    })

    $(document).on('mouseout', '.single-checkbox', function(){
        $(this).removeClass('check-grey-icon');
    })

    //On click verify if the related input is checked
    $('.single-checkbox').click(function(){
        var checkboxId = '#'+ $(this).attr('for');
        if($(checkboxId).is(':checked') ){
            $(this).addClass('check-blue-icon');
        }else{
            $(this).removeClass('check-blue-icon');
        }
    });
}

// Function to add loading to button
function loadingButton() {
    $(".loadingButton").click(function() {
        if ( $(this).attr('data-loading-text') != undefined) {
            $(this).button('loading');
        }
    });
}

// Function to remove the loading state from the button
function removeLoading() {
    $('.loadingButton').button('reset');
}
