function cropImage() {
    //Show crop image area
    $(document).on('click', '.btn_crop_image, .btn_edit_mf', function(){
    console.log(this);
        var modal_back = $(this).closest('.modal').attr('id'),
            mf_elem = (typeof modal_back !== 'undefined' && modal_back == 'modal_show_mediafile') ? this : $(this).closest('.attachment'),
            mf_id = $(mf_elem).data('mediafile-id'),
            mf_filter = $(mf_elem).data('filter');

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_get_crop_container'),
            async: true,
            cache: false,
            data: { id: mf_id, filter: mf_filter }
        }).done(function( result ) {
                if ( result != '' ) {
                    $('#'+modal_back).modal('hide');

                    $('#modal_crop_photo').html(result);
                    $('#modal_crop_photo').attr('data-photo-id', mf_id);
                    $('#modal_crop_photo').attr('data-filter', mf_filter);
                    $('#modal_crop_photo').modal('show');

                    //Set back modal
                    var btn_back = $('#modal_crop_photo').find('.btn_story_back');
                    if ( typeof modal_back !== 'undefined' ) {
                        $(btn_back).show();
                        $(btn_back).attr('data-target', '#'+modal_back);
                    } else {
                        $(btn_back).hide();
                        $(btn_back).attr('data-target', '');
                    }
                }
            });
    });

    $(document).on('shown.bs.modal', '#modal_crop_photo', function(e){
        WmdsCropObj = $('.frame img').Jcrop({
            'boxWidth': $('#modal_container #modal_crop_photo .frame').width(),
            'boxheight': $('#modal_container #modal_crop_photo .frame').height(),
            'onChange': updateCropCoords,
            'onSelect': updateCropCoords
        });
    });

    //Apply Crop
    $(document).on('click', '.btn_apply_crop', function(){
        var crt_modal = $(this).closest('.modal'),
            mf_id = $(crt_modal).attr('data-photo-id'),
            filter = $(crt_modal).attr('data-filter'),
            data = $(crt_modal).find('#form_crop_photo').serializeArray(),
            selected = true,
            back_modal = $(crt_modal).find('.btn_story_back').attr('data-target');


        $(data).each(function(){
            if ( (this.name == 'w' || this.name == 'h') && ( this.value == 0 || this.value == '' ) ) {
                $(crt_modal).find('.alert-danger').removeClass('hide');
                selected = false;
                return false;
            }
        });

        if ( !selected ) {
            return;
        }

        $(crt_modal).find('.alert-danger').addClass('hide');

        $.ajax({
            type: "POST",
            url: Routing.generate('wmds_apply_crop'),
            async: true,
            cache: false,
            data: { id: mf_id, formData: data, filter: filter }
        }).done(function( result ) {
                if ( result != '' ) {
                    $('#modal_crop_photo').modal('hide');

                    var add_container = '';

                    if ( back_modal == '#modal_story_details' ) {
                        add_container = '#modal_story_select_mf';

                        //replace old image by cropped one
                        var img_obj = $('#modal_story_details').find('.entity_mediafiles .attachment[data-mediafile-id="'+mf_id+'"]');
                        $(img_obj).data('mediafile-id', result['img_id']);
    //                    reloadImage( $(img_obj).find('.thumbnail img'), result['img_thumb_path']);
                        reloadImage( $(img_obj).find('img.mf_image'), result['img_thumb_path']);

                        //switch old image id with the id of the cropped one
                        var old_index = -1;
                        for ( i = 0; i < newStoryMediaFiles.length; i++ ) {
                            if( newStoryMediaFiles[i] == mf_id ) {
                                old_index = i;
                                break;
                            }
                        }

                        if ( old_index > -1 ) {
                            newStoryMediaFiles[old_index] = result['img_id'];
                        }
                    } else {
                        add_container = '.container';

                        if ( back_modal == '#modal_show_mediafile' ) {
                            reloadImage( $(back_modal).find('.frame img.mf_image'), result['img_web_path']);
                        }
                    }

                    //preview cropped image on #modal_story_details
                    img_obj = $(add_container).find('.entity_mediafiles .attachment[data-mediafile-id="'+mf_id+'"]');
                    if ( mf_id == result['img_id'] ) {
    //                    reloadImage( $(img_obj).find('.thumbnail img'), result['img_thumb_path']);
                        reloadImage( $(img_obj).find('img.mf_image'), result['img_thumb_path']);
                    } else {
                        //create another image item
                        var new_img_item = '<li data-mediafile-id="'+result['img_id']+'" class="attachment save-ready">' +
                                            '<div class="attachment-preview type-image subtype-jpeg landscape">' +
                                            '<div class="thumbnail">' +
                                            '<div class="centered">' +
                                            '<img width="100" alt="" src="'+result['img_thumb_path']+'">' +
                                            '</div>' +
                                            '</div>' +
                                            '<a class="check" href="#" title="Deselect"><div class="media-modal-icon"></div></a>' +
                                            '</div>' +
                                            '</li>';

                        var new_img_item = result['content'];

                        $(add_container).find('.entity_mediafiles').append(new_img_item);
    console.log($(add_container).find('.entity_mediafiles'));
                        if ( add_container == '#modal_story_select_mf' ) {
                            //deselect old image
                            $(img_obj).closest('.attachment').removeClass('mf_selected');

                            //select cropped image
                            new_img_obj = $(add_container).find('.entity_mediafiles .attachment[data-mediafile-id="'+result['img_id']+'"]');
                            $(new_img_obj).closest('.attachment').addClass('mf_selected');
                        }
                    }

                    if ( back_modal != '' ) {
                        $(back_modal).modal('show');
                    }
                }
            });
    });
}