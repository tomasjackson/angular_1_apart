noteMediafiles = [];
//noteMediafilesEdit = [];

$(document).ready(function() {
    NProgress.done();
   $(document).on('click','#sidebar .nav a', function() {
       $('#sidebar .nav li').removeClass('active');
       $(this).parent().addClass('active');
   });
});

function changeNoteView( confirm )
{
    confirm = confirm || false;
    var current_modal = getNoteActionModal(noteAction),
        note_textarea = $(current_modal).find('#wmds_adminbundle_notetype_content'),
        btn_action = $(current_modal).find('.btn.story-action span:eq(2)');

    if ( confirm ) {
        $(note_textarea).hide();
        $(current_modal).find('.modal-title .title-text').text('Your Note');
        $(current_modal).find('.modal-header .note-description').text($(note_textarea).val());
        $(btn_action).html('&nbsp; Add More Photo(s) / Video(s) &nbsp; ');
    } else {
        $(note_textarea).show();
        $(current_modal).find('.modal-title .title-text').text('Add Note');
        $(current_modal).find('.modal-header .note-description').text('');
        $(btn_action).html('&nbsp; Add Photo/ Video &nbsp; ');
    }
}

function addMFDirectLink(elem)
{
    var input_elem = $(document).find('input.from_direct_link');
    var direct_link = $(input_elem).val();
    var alert_container = $(document).find('#modal_mfs_from .alert');

    $(alert_container).text('').attr('class', 'alert hide');

    if ( !validUrl(direct_link) ) {
        $(alert_container).attr('class', 'alert alert-danger').text('The url is invalid. Please enter the url of an image or Youtube/Vimeo video.').removeClass('hide');
        return;
    }

    //ajax - save mediafile
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_mediafile_direct_link'),
        async: true,
        cache: false,
        data: { direct_link: direct_link, isNoteMF: 1 }
    }).done(function( result ) {
            if ( result.hasOwnProperty("error") ) {
                $(alert_container).text(result['message']).attr('class', 'alert alert-danger');
            } else {
//                $(input_elem).closest('.modal').modal('hide');
                $(input_elem).val('');
                noteMediafiles.push(result['mediaFile_id']);

                var current_modal = getNoteActionModal(noteAction);
                var mf_html = getSelectedMfHtml(result['mediaFile_id'], result['mediaFile_path']);

                $(current_modal).find('.note_mfs_container').append(mf_html);

                $(alert_container).text('The media file was successully added to the note').attr('class', 'alert alert-success');

                if ( $(elem).hasClass('btn_note_next') ) {
                    $(elem).closest('.modal').modal('hide');
                }
            }
        });
}

function getNoteActionModal(note_action)
{
    if ( note_action == 'new' ) {
        var current_modal = $('#noteModal');
    } else if ( note_action == 'reply' ) {
        var current_modal = $('#noteReplyModal');
    } else {
        var current_modal = $('#editNoteModal');
    }

    return current_modal;
}

function getSelectedMfHtml( mf_id, img_src )
{
    return '<div class="col-xs-3 note_mf mf_item" date-mediafile-id="'+mf_id+'">' +
                '<div class="removable-picture">' +
                    '<button type="button" class="close-small-icon remove-picture remove_mf_from_story"></button>' +
                    '<img width="100" height="100" src="'+img_src+'">' +
                    '<div class="clear"></div>' +
                '</div>' +
            '</div>';
}

function hideCountMFNoteModal( elem )
{
    var count_mfs = $(elem).find('.count_mfs');
    $(count_mfs).text(0);
    $(count_mfs).parent().addClass('hide');
}

function showCountMFNoteModal( elem, nr_mfs )
{
    var count_mfs = $(elem).find('.count_mfs');
    $(count_mfs).text(nr_mfs);
    $(count_mfs).parent().removeClass('hide');
}

/**
 * Function to load facebook Photos
 * */
function displayFacebookPhotos() {
    $(".facebookAlbumTitle").click(function(){
        var dataId = $(this).attr("id");

        if ( $("#albumPhotos" + dataId).html() == "" ) {
            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_facebook_photos', {id: dataId }),
                data: { data: newStoryMediaFilesFacebook },
                success: function (resp) {
                    if ( resp.content ) {
                        $("#albumPhotos" + dataId).html(resp.content);
                        $("#" + dataId).hide();
                    }
                }
            });
        }

    });
}

/**
 * Note edit function
 */
function noteEditAction(noteId)
{
    //init modal
    $("#editNoteError").hide();
    $("#editContent").val("");

    var questionId = $("#questionIdVal").val(),
        preloader_elem = $('#editNoteModal').find('.preload_image'),
        mfs_container = $('#editNoteModal .note_mfs_container');

    $(preloader_elem).show();
    $(mfs_container).hide();
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_edit_note_values', {id: noteId, questionId: questionId }),
        success: function (resp) {
            if ( resp.success ) {
                $("#editContent").val(resp.content);

                var html = "";
                noteMediafiles.length = 0;

                if ( resp.mediafiles ) {
                    html = '';

                    $.each(resp.mediafiles, function () {
                        noteMediafiles.push(this.id);
                        html += getSelectedMfHtml( this.id, this.thumb );
                    });

                    $('#modal_mfs_from .btn_mf_array_updated').attr('data-target', '#editNoteModal');
                    var nr_mfs = noteMediafiles.length;

                    //show/hide number of added mediafiles container
                    $(preloader_elem).hide();
                    if ( nr_mfs > 0 ) {
                        showCountMFNoteModal($('#editNoteModal'), nr_mfs);
                        $(mfs_container).show();
                    } else {
                        hideCountMFNoteModal($('#editNoteModal'));
                    }

                    $('#editNoteModal').find('.note_mfs_container').html(html);
                }

                if ( resp.private ) {
                    $("#notePrivate").prop("checked", true);
                } else {
                    $("#notePrivate").prop("checked", false);
                }

                $("#editNoteButton").attr("onclick", "javascript: editNote('"+ noteId +"');");
            }
        }
    });
}

function editNote(noteId) {
    var data = $("#editNoteForm").serializeArray();
    data.push({name: "noteMediafiles", value: noteMediafiles});

    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_edit_note', {id: noteId }),
        data: data,
        success: function (resp) {
            if ( resp.success ) {
                $("#noteContent" + noteId).html(resp.content);
                $("#editNoteModal").modal('hide');

                if ( resp.private ) {
                    $("#privateNote_" + noteId).html('<i class="fa fa-unlock-alt"></i>Make it public');
                    $("#privateNote_" + noteId).attr("onclick", "javascript: privateNote('"+ noteId +"', 'public');");
                    $("#privateNote"+ noteId).val("1");
                } else {
                    $("#privateNote_" + noteId).html('<i class="fa fa-lock"></i>Make it private');
                    $("#privateNote_" + noteId).attr("onclick", "javascript: privateNote('"+ noteId +"', 'private');");
                    $("#privateNote"+ noteId).val("0");
                }

                //Add mediafiles to note container
                var mf_html = '';
                $(resp.mediafiles).each(function(){
                    mf_html +=  '<li class="attachment save-ready" data-mediafile-id="'+this.id+'">' +
                                    '<div class="attachment-preview type-image subtype-jpeg landscape">' +
                                        '<div class="thumbnail">' +
                                            '<div class="centered">' +
                                                '<img width="100" alt="" src="'+this.src+'">' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</li>';
                });

                $('#mediaContent'+noteId+' .notesMediafiles').html(mf_html);
            } else {
                $("#editNoteError").html(resp.error);
                $("#editNoteError").show();
            }
        }
    });
}

/**
 *  Function to set the replay form values
 * */
function setReplyId(noteId) {
    $("#noteReplyForm").find('textarea').val('');
    $("#noteReplyForm").find('.checkboxPrivate').prop('checked', false);
    $("#replyToId").val(noteId);
}

/**
 * Function to set note private/public
 * type private/public
 * */
function privateNote(noteId, type) {
    $("#buttonNotePrivate").attr("onclick", "javascript: setPrivateNote('"+ noteId +"', '"+ type +"')");
    if ( type == "public" ) {
        $("#notePublicModal").find('.modal-body').html("<h4>Make this note public?</h4>");
    } else {
        $("#notePublicModal").find('.modal-body').html("<h4>Make this note private?</h4>");
    }
    $("#notePublicModal").modal('show');
}

/**
 * Function to set note status
 * */
function setPrivateNote(noteId, type) {
    var storyId = $("#notePublicModal").attr('data-id');
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_status_note', {id: storyId }),
        data: {noteId: noteId, type: type},
        success: function (resp) {
            if ( resp.success ) {
                if ( type == "private" ) {
                    $("#privateNote_" + noteId).html('<i class="fa fa-unlock-alt"></i>Make it public');
                    $("#privateNote_" + noteId).attr("onclick", "javascript: privateNote('"+ noteId +"', 'public');");
                    $("#privateNote"+ noteId).val("1");
                } else {
                    $("#privateNote_" + noteId).html('<i class="fa fa-lock"></i>Make it private');
                    $("#privateNote_" + noteId).attr("onclick", "javascript: privateNote('"+ noteId +"', 'private');");
                    $("#privateNote"+ noteId).val("0");
                }
            }
            $("#notePublicModal").modal('hide');
        }
    });
}

/**
 *  Set the note delete params
 * */
function noteDeleteAction(noteId) {
    $("#buttonNoteDelete").attr("onclick", "javascript: deleteNote('"+ noteId +"');");
}

/**
 * Function to delete the note
 * */
function deleteNote(noteId) {
    var storyId = $("#deleteNoteModal").attr('data-id');
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_delete_note', {id: storyId }),
        data: { noteId: noteId },
        success: function (resp) {
            if ( resp.success ) {
                $("#mediaReply" + noteId).closest('.note_item').slideUp();
            }
            $("#deleteNoteModal").modal('hide');
        }
    });
}

/**
 *  Function to scroll to current anchor
 */
function goToScroll(id){
    $('html,body').animate({scrollTop: $("#"+id).offset().top -60 },'slow');
}

/**
 *  Function to validate the note form
 * */
function validateNoteForm(id) {
    $(id).validate({
        rules: {
            'wmds_adminbundle_notetype[content]': {
                required: true
            }
        },
        messages: {
            'wmds_adminbundle_notetype[content]': {
                required: "Field required."
            }
        }
    });
}

//Add mediafiles from different sources (Gallery)
$(document).on('click', '.btn_note_link_from', function(e){
    e.preventDefault();
    var handler = $(this).data('handler');
    var this_elem = this;

    $.ajax({
        type: "POST",
        url: handler,
        async: true,
        cache: false
    }).done(function( result ) {
            if (result != '') {
                $(this_elem).closest('.modal').modal('hide');
                var current_modal = $('#modal_note_mf_gallery');
                $(current_modal).html(result);
//                    $(document).find('.btn_story_back').attr('data-target', '#modal_story');

                $(noteMediafiles).each(function(){
                   $(current_modal).find('.entity_mediafiles .attachment[data-mediafile-id="'+this+'"]').addClass('mf_selected');
                });

                $(newStoryMediaFilesFacebook).each(function(){
                    $(current_modal).find('.entity_mediafiles_facebook .attachment[data-mediafile-id="'+this+'"]').addClass('noteModal');
                });


                $('#modal_note_mf_gallery').modal('show');

//                    removeLoading();
//
//                    /**
//                     * Facebook login button
//                     * */
//                    FB.XFBML.parse();
            }
        });
});

//Add mediafiles from different sources (Direct Link)
    $(document).on('click', '#modal_mfs_from .btn_note_next', function(){
        var direct_link = $('#modal_mfs_from .from_direct_link').val();
        if ( direct_link != '' ) {
            addMFDirectLink(this);
        }
    });

    $(document).on('keyup', '#modal_mfs_from .from_direct_link', function(e){
        var code = (e.keyCode ? e.keyCode : e.which);

        if( code == 13 ) {
            addMFDirectLink(this);
        }
    });

//$(document).ready(function(){
    /**
     * Show all notes
     * */
    $("#showNotesButton").click(function(){
        $(".media").removeClass("hidden");
        $("#showNotesButton").remove();
    });

//Actions done when show add note
    $("#noteModal, #noteReplyModal").on('show.bs.modal', function (e) {
        var rt = e.relatedTarget;

        if ( $(this).attr('id') == 'noteModal' ) {
            noteAction = 'new';
            //modify next modal data-target to come back here
            $('#modal_mfs_from .btn_mf_array_updated').attr('data-target', '#noteModal');
        } else {
            noteAction = 'reply';
            //modify next modal data-target to come back here
            $('#modal_mfs_from .btn_mf_array_updated').attr('data-target', '#noteReplyModal');
        }

        if ( !$(rt).hasClass('btn_mf_array_updated') ) {
            noteMediafiles = [];
            var modalAction = getNoteActionModal(noteAction);
            $(modalAction).find('.note_mfs_container').html('');
            $(modalAction).find('textarea').val('');

            hideCountMFNoteModal(this);

            changeNoteView(false);
        } else {
            var nr_mfs = noteMediafiles.length;

            if ( nr_mfs > 0 ) {
                showCountMFNoteModal(this, nr_mfs);
            } else {
                hideCountMFNoteModal(this);
            }

            changeNoteView(true);
        }
    });

//Actions done when hide edit note
    $('#editNoteModal').on('hidden.bs.modal', function(){
        hideCountMFNoteModal(this);
        //hide media files from previous note
//        $(this).find('.note_mfs_container').hide();
    });

//Actions done when show edit note
    $("#editNoteModal").on('show.bs.modal', function (e) {
        var rt = e.relatedTarget;
        noteAction = 'edit';

        //show media files if modal of this note, was already displayed
        if ( $(rt).hasClass('btn_mf_array_updated') ) {
            var modalAction = getNoteActionModal(noteAction);
            $(modalAction).find('.note_mfs_container').show();
        }

        //modify next modal data-target to come back here
//        $('#modal_mfs_from .btn_mf_array_updated').attr('data-target', '#editNoteModal');
//
        var nr_mfs = noteMediafiles.length;

        //show/hide number of added mediafiles container
        if ( nr_mfs > 0 ) {
            showCountMFNoteModal( this, nr_mfs );
        } else {
            hideCountMFNoteModal(this);
        }
    });
//});

//Select Media Files from Gallery
$(document).on('click', '#modal_note_mf_gallery .entity_mediafiles .attachment', function(){
    if( typeof(noteAction) === 'undefined' ) {
        return;
    }

    var modalAction = getNoteActionModal(noteAction);
    var mf_id = $(this).data('mediafile-id');
    var mf_counter = $(this).closest('.modal').find('.selection-count span');
    var nr = parseInt($(mf_counter).text()) ? parseInt($(mf_counter).text()) : 0;

    if ( $(this).hasClass('mf_selected') ) {
        $(this).removeClass('mf_selected');

        //decrement mediafiles counter
        if ( nr > 0 ) {
            $(mf_counter).text(nr - 1);
        }

        for( var i = noteMediafiles.length; i--; ) {
            if(noteMediafiles[i] == mf_id) {
                noteMediafiles.splice(i, 1);
            }
        }

        //remove from noteModal
        $(modalAction).find('.note_mfs_container').remove('.note_mf[data-mediafile-id="'+mf_id+'"]');

        for( var i = newStoryMediaFilesFacebook.length; i--; ) {
            if(newStoryMediaFilesFacebook[i] == mf_id) {
                newStoryMediaFilesFacebook.splice(i, 1);
            }
        }

    } else {
        $(this).addClass('mf_selected');
        noteMediafiles.push(mf_id);

        //increment mediafiles counter
        $(mf_counter).text(nr + 1);

        //add to noteModal
        var img_src = $(this).find('img').attr('src');
        var mf_html = getSelectedMfHtml(mf_id, img_src);
        $(modalAction).find('.note_mfs_container').append(mf_html);
    }
});

$(document).on('click', '.btn_note_add_mfs', function(e){
//    e.preventDefault();
    var note_descr = $(this).closest('form').find('textarea').val();

    if ( $(this).closest('form').valid() ) {
        $(this).closest('.modal').modal('hide');
        $(document).find('#modal_mfs_from').modal('show');
    }
});

//Note Forms submit ( prevent page refresh )
$(document).on('submit', 'form', function(e) {
    /**
     *  Submit new note
     * */
    var formId = $(this).attr('id');
    var storyId = $(this).attr('data-id');
    if ( formId === "newNoteForm" ) {
        e.preventDefault();

        var note_text = $(this).find('textarea').val();
        if ( note_text == '' ) {
            return;
        }

        var data = $(this).serializeArray();
        data.push({name: "noteMediafiles", value: noteMediafiles});

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_new_note', {id: storyId }),
            data: data,
            success: function (resp) {
                if ( resp.success ) {
                    if ( resp.content ) {
                        $("#notesContainer").find('.media-list').first().prepend(resp.content);
                    }
                    $("#noteModal").modal('hide');
                    $("#wmds_adminbundle_notetype_content").val();
                    goToScroll('noteContent' + resp.id);
                }
            }
        });
    }

    /**
     * Submit reply
     * */
    if ( formId === "noteReplyForm" ) {
        e.preventDefault();
        var data = $(this).serializeArray(),
            parent_id = $(this).find("#replyToId").val(),
            parent = $(document).find('.note_item[data-id="'+parent_id+'"]'),
            parent_level = $(parent).data('level');

//        var note_text = $(this).find('textarea').val();
//        if ( note_text == '' ) {
//            return;
//        }

        parent_level = parent_level !== undefined && parent_level != '' ? parseInt(parent_level) + 1 : 1;

        data.push({name: "level", value: parent_level});
        data.push({name: "noteMediafiles", value: noteMediafiles});

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_reply_note', {id: storyId }),
            data: data,
            success: function (resp) {
                if ( resp.success ) {
                    if ( resp.content ) {
                        $("#mediaReply"+ parent_id).prepend(resp.content);
                    }
                    $("#noteReplyModal").modal('hide');
                    $("#wmds_adminbundle_notetype_content").val();
                    goToScroll('noteContent' + resp.id);
                }
            }
        });
    }
});

$(document).on('click', '#filesContainer .attachment', function(e){
    var mf_id = $(this).data('mediafile-id');
    var mf_counter = $(this).closest('.modal').find('.selection-count span');
    var nr = parseInt($(mf_counter).text()) ? parseInt($(mf_counter).text()) : 0;

    if ( $(this).hasClass('mf_selected') ) {
        $(this).removeClass('mf_selected');

        //decrement mediafiles counter
        if ( nr > 0 ) {
            $(mf_counter).text(nr - 1);
        }

        for( var i = noteMediafiles.length; i--; ) {
            if(noteMediafiles[i] == mf_id) {
                noteMediafiles.splice(i, 1);
            }
        }
    } else {
        $(this).addClass('mf_selected');

        //increment mediafiles counter
        $(mf_counter).text(nr + 1);

        if ( noteMediafiles.indexOf(mf_id) < 0 ) {
            noteMediafiles.push(mf_id);
        }
    }
});


//$(document).on('click', '#notesMediaFiles ul li', function(e){
//
//    var mf_id = $(this).data('mediafile-id');
//
//    if ( $(this).hasClass('mf_selected') ) {
//
//        $(this).removeClass('mf_selected');
//        for( var i = noteMediafilesEdit.length; i--; ) {
//            if(noteMediafilesEdit[i] == mf_id) {
//                noteMediafilesEdit.splice(i, 1);
//            }
//        }
//
//    } else {
//
//        $(this).addClass('mf_selected');
//
//        if ( noteMediafilesEdit.indexOf(mf_id) < 0 ) {
//            noteMediafilesEdit.push(mf_id);
//        }
//    }
//    console.log(noteMediafilesEdit);
//});

