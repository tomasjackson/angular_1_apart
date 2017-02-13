function wmds() {
    //Function for form submit ( prevent page refresh )
    $(document).on('submit', 'form', function(e) {
        /**
         *  Submit new note
         * */
        var formId = $(this).attr('id');
        var storyId = $(this).attr('data-id');
        if ( formId === "newNoteForm" ) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_new_note', {id: storyId }),
                data: $(this).serialize(),
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
            $.ajax({
                type: "POST",
                url: Routing.generate('wmds_reply_note', {id: storyId }),
                data: $(this).serialize(),
                success: function (resp) {
                    if ( resp.success ) {
                        if ( resp.content ) {
                            console.log($("#replyToId").val());
                            $("#mediaReply"+ $("#replyToId").val()).append(resp.content);
                        }
                        $("#noteReplyModal").modal('hide');
                        $("#wmds_adminbundle_notetype_content").val();
                        goToScroll('noteContent' + resp.id);
                    }
                }
            });
        }
    });
}

/**
 * Note edit function
 */
function noteEditAction(noteId) {
    $("#editNoteError").hide();
    $("#editContent").val($("#noteContent"+noteId).html());
    if ( $("#privateNote"+ noteId).val() == "1" ) {
        $("#notePrivate").prop("checked", true);
//        $("#notePrivate").val("1");
    } else {
        $("#notePrivate").prop("checked", false);
//        $("#notePrivate").val("0");
    }
    $("#editNoteButton").attr("onclick", "javascript: editNote('"+ noteId +"');");
}

function editNote(noteId) {
    $.ajax({
        type: "POST",
        url: Routing.generate('wmds_edit_note', {id: noteId }),
        data: $("#editNoteForm").serialize(),
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
        $("#notePublicModal").find('.modal-body h2').html("Make this note public?");
    } else {
        $("#notePublicModal").find('.modal-body h2').html("Make this note private?");
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
                $("#mediaReply" + noteId).parent().parent().slideUp();
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

/**
 * Function to show all notes
 * */
function showAllNotes() {
    $(".media").removeClass("hidden");
    $("#showNotesButton").remove();
}