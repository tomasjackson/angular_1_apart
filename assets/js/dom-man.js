function domMan() {
    // hiding calendar if user have hide it previously
    if (localStorage['callendar-collapsed'] === 'yes') {

        $('.left-navigation h4').trigger('click').addClass('active-coll');
    }

    $(document).ready(function () {


      // toggling arrow on calendar sidebar
      //$('.left-navigation h4').click(function (e) {
      //  e.stopImmediatePropagation();
      //  if ($(this).hasClass('active-coll')) {
      //    $(this).removeClass('active-coll');
      //    localStorage['callendar-collapsed'] = '';
      //
      //  } else {
      //    $(this).addClass('active-coll');
      //    localStorage['callendar-collapsed'] = 'yes';
      //
      //  }
      //});

        $('#add-user-box .group-select .group').click(function () {
            $(this).toggleClass('active');
        });
        //hiding and showing account owner image on gallery page
        //$('.my-gallery-page .filter-elements').on('click', function () {
        //    var $this = $(this);
        //    setTimeout(function () {
        //        $('.gallery-item-box').hide().removeClass('visible');
        //        var $elements = $this.data('filter');
        //        $('.gallery-main-content-wrapp').find($elements).show().addClass('visible');
        //        $('.gallery-main-content-wrapp > .col-xs-4').each(function () {
        //            if ($(this).find('.visible').length == 0) {
        //                $(this).hide();
        //            } else {
        //                $(this).show();
        //            }
        //        });
        //    }, 300);
        //
        //});
        // disabling sharing with radio buttons on add to your photo

        $('#private-radio-button').click(function () {

            if ($(this).is(':checked')) {
                $('#share-yes-radio-button').prop({
                    'checked': false
                    , 'disabled': 'disabled'
                });
                $('#share-no-radio-button').prop({
                    'checked': false
                    , 'disabled': 'disabled'
                });
            }
        });
        $('#private-radio-button').click(function () {
            $('#share-yes-radio-button').removeAttr('disabled');
            $('#share-no-radio-button').removeAttr('disabled');

        });
        // hiding and showing modals on back button
        $('#import-media-from-fb .show-prev-modal, #import-media-from-storythat .show-prev-modal, #import-media-from-device .show-prev-modal, #add-details-story .show-prev-modal').click(function () {
            $(this).parents('.modal').modal('hide');
            $('#create-new-story').modal('show');
        });


        // toggling fb images
        $('.uploading-photo-modal .img-container').click(function () {
            $(this).toggleClass('selected');
        });

        $('.uploading-photo-modal').on('shown.bs.modal', function () {
            // Load up a new modal...
            $('#create-new-story').modal('hide');
        });

        // toggling thumbs on single story page
        // $('#st-view-photos').click(function () {
        //     $(this).parents('.media-container').find('.carousel-inner').toggleClass('show-all');
        //     $(this).parents('.media-container').find('.note-gal-arrow').toggleClass('hide');
        //     if ($(this).parents('.media-container').find('.carousel-inner').hasClass('show-all')) {
        //         $(this).text('Cover Picture / Video');
        //     } else {
        //         $(this).text('All Pictures / Videos');
        //     }
        // });


        // removing photo from add details to your story
        // $('#add-details-story .delete-photo').click(function () {
        //     $img_cont = $(this).parents('.img-container');
        //     $img_cont.find('.confirm-delete').slideDown();
        // });
        $('#add-details-story .remove-photo').click(function () {
            $(this).parents('.col-md-3').remove();
        });
        $('#add-details-story .crop-icon-photo').click(function () {
            $(this).parents('.modal').modal('hide');
        });
        $('#add-details-story .edit-photo').click(function () {
            $(this).parents('.modal').modal('hide');
        });
        // $('#add-details-story .cancel-delete').click(function () {
        //     $img_cont = $(this).parents('.img-container');
        //     $img_cont.find('.confirm-delete').slideUp();
        // });

        // preventing modal from closing
        $('.group-modal .group-name').click(function (e) {
            e.preventDefault();
        });
        // calling tooltip
        $('[data-toggle="tooltip"]').tooltip();
        //showing active contacts on my group page
        $('#content .contact-tabs li.group').click(function () {
            $('span.active-users-numb').text($('.selected-group .contact:visible').length);
        });

        // toggling contacts on group modal
        $('.my-group-page .group-modal .contact').click(function () {
            $(this).toggleClass('group-member');
        });
        // hiding modals on footer button click
        $('.uploading-photo-modal .modal-footer button').click(function () {
            setTimeout(function () {
                $(this).parents('.modal').modal('hide');
            }, 300);
        });
        // switching checkboxes on modal group tabs

        //$('.check-cont-btn').click(function () {
        //    $('.edit-group-tab-check').each(function () {
        //        $(this).siblings('.st-checkbox').removeClass('checked')
        //    });
        //    $(this).siblings('.st-checkbox').addClass('checked');
        //});
        // toggling views on group modal
        $('.group-modal .checkbox-container').click(function () {
            //$('.group-modal .checkbox-container').each(function () {
            //    $(this).find('.st-checkbox').removeClass('checked');
            //});
            //$(this).find('.st-checkbox').addClass('checked');
            if ($(this).find('input[type=checkbox]').attr('id') == 'existing-groups-edit') {
                $('.group-modal .edit-group-default-view').hide();
                $('.group-modal .edit-group-storyThat-view').hide();
                $('.edit-group-existing-users-view').show();
            }
            if ($(this).find('input[type=checkbox]').attr('id') == 'search-users-edit-group') {
                $('.group-modal .edit-group-default-view').hide();
                $('.edit-group-existing-users-view').hide();
                $('.group-modal .edit-group-storyThat-view').show();
            }
            if ($(this).find('input[type=checkbox]').attr('id') == 'search-users-create-group') {
                $('.group-modal .create-group-default-view').hide();
                $('.create-group-existing-users-view').hide();
                $('.group-modal .create-group-storyThat-view').show();
                $('.group-modal#create-group .view-count').show();
            }
            if ($(this).find('input[type=checkbox]').attr('id') == 'existing-groups-create') {
                $('.group-modal .create-group-default-view').hide();
                $('.group-modal .create-group-storyThat-view').hide();
                $('.create-group-existing-users-view').show();
                $('.group-modal#create-group .view-count').show();
            }
        });


        // stopping carousel on single story page to cycle
        setTimeout(function () {
            $('.carousel').carousel('pause');
        }, 200);

        //sliding gallery description
        // $('.content-cont .item-footer').click(function (e) {
        //     e.stopPropagation();
        //     var $containerGall = $(this).parents('.gallery-item-box');
        //     // console.log($containerGall.toggleClass('expanded-content'));
        //     $containerGall.find('.content-box').slideToggle();
        //     $containerGall.find('.ribbon-icon-trans').fadeToggle();

        // });

        // $('.content-cont .item-footer a').click(function(e) {
        //     e.preventDefault();
        // });

        // showing modal on gallery title click
        // $('.content-cont .item-footer h3').click(function (e) {
        //     e.stopPropagation();
        //     $('#photo-modal').modal('show');
        // });

        // preventing from closing menu on gallery
        $('.my-gallery-page .item-box-body p, .story-text, .my-notes-page .note-title , .my-notes-page .note-head .date-info').click(function (e) {
            e.stopPropagation();
        });

        // hiding gallery options on clicking on body
        $('.my-gallery-page .content-box').click(function () {
            $(this).slideToggle();
        });

        // showing journal story prompt dialog
        // $('.delete-story-btn').click(function () {
        //     $(this).parents('.journal-story').find('.confirm-prompt-dialog').show();
        // });
        // $('.confirm-prompt-dialog button').click(function () {
        //     $(this).parents('.confirm-prompt-dialog').hide();
        // });

        // sliding to journal story when clicked

        // $('.journal-story .story-heading').click(function(){
        //     alert('aa');
        //     $('html,body').animate({
        //         scrollTop: $(this).offset().top - 130},500);
        // });

        $('.calendar-main-wrap .delete-gall').click(function(){
                    // showing calendar delete promt dialog
                    $(this).parents('.story-cont').find('.confirm-prompt-dialog').show();
                });
                $('.confirm-prompt-dialog button').click(function(){
                  $(this).parents('.confirm-prompt-dialog').hide();
                });

        //slide to report box on single story visitors view
        $('#open-report-box').click(function(){
           $('html,body').animate({
                scrollTop: $(this).offset().top - 130},500);
        });

        // toggling remove story from journal button
        $('.remove-story-jour').click(function () {
            $(this).toggleClass('story-removed');
            if ($(this).hasClass('story-removed')) {
                $(this).find('span').text('Add to Journal');
                $(this).children('i')
                    .attr({
                        class: ''
                    })
                    .addClass('fa fa-calendar-plus-o');
            } else {
                $(this).find('span').text('Remove from Journal');
                $(this).children('i')
                    .attr({
                        class: ''
                    })
                    .addClass('fa fa-calendar-minus-o');
            }
        });


        // showing delete prompt on shared stories
        $('.story-wrapper .delete-gall').click(function () {
            $(this).parents('.story-wrapper').find('.confirm-prompt-dialog').show();
        });

        // toggling remove story from shared stories
        $('.addtojournal-gal').click(function () {
            if ($(this).hasClass('removed')) {
                $(this).attr({
                        'class': ''
                        , 'data-original-title': 'Remove from Journal'
                    })
                    .addClass('addtojournal-gal');
                $(this).children('i')
                    .attr({
                        class: ''
                    })
                    .addClass('fa fa-calendar-minus-o');

            } else {
                $(this).attr({
                        'data-original-title': ''
                        , 'class': ''
                    })
                    .addClass('addtojournal-gal removed');
                $(this).children('i')
                    .attr({
                        class: ''
                    })
                    .addClass('fa fa-calendar-plus-o');

            }
        });
        // showing right image in pop up slider
        $('.story-image img').click(function () {
            var img_src_slider = $(this).attr('src');
            $('#photo-modal .image-ram img').attr({
                src: img_src_slider
            });

        });
        // toggling contact star icon
        $('.contacts-favorite').click(function (e) {
            e.stopImmediatePropagation();
            $(this).toggleClass('checked');

            if ($(this).hasClass('checked')) {
                $(this).attr({
                    'data-original-title': 'Remove from Favorites'
                });
            } else {
                $(this).attr({
                    'data-original-title': 'Add to Favorites'
                });
            }
        });

        // toggling contact icon
        $('.del-group-contact-btn').click(function (e) {
            e.stopImmediatePropagation();
            $(this).toggleClass('checked');

            if ($(this).hasClass('checked')) {
                $(this).attr({
                    'data-original-title': 'Remove Contact'
                });
            } else {
                $(this).attr({
                    'data-original-title': 'Add Contact'
                });
            }
        });

        // showing delete gallery prompt
        $('.gallery-item-box .delete-gall').click(function (e) {
            e.stopImmediatePropagation();
            $(this).parents('.gallery-item-box').find('.confirm-prompt-dialog').show();
        });

        // showing modal for edit
        $('.gallery-item-box .edit-gall').click(function (e) {
            e.stopImmediatePropagation();
              $('#edit-media').modal('show');
        });


        // showing modal for adding note on Gallery
        $('.gallery-item-box .add-note-gall').click(function (e) {
            e.stopImmediatePropagation();
              $('#add-note-1').modal('show');
        });


        $('.share-gal').click(function (e) {
            e.stopImmediatePropagation();
            $('#share-story').modal('show');
        });

        // toggling gallery star icon
        $('.star-gall').click(function (e) {
            e.stopImmediatePropagation();
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $(this).attr({
                    'data-original-title': 'Remove from Favorites'
                });
            } else {
                $(this).attr({
                    'data-original-title': 'Add to Favorites'
                });
            }
        });
        // stoping video on window closed
        $('body').on('hidden.bs.modal', '.modal', function () {
            $('video').trigger('pause');
        });

        // cutting second letter of month on sidebar
        $('th.dow').each(function () {
            $(this).html($(this).text().substring(0, $(this).text().length - 1));
        });
        // toggling search on top header
        //$('.search-form .dropdown-menu li').click(function () {
        //    var search_bg_icon_class = $(this).attr('class');
        //    var search_placehoder = $(this).find('span').data('category');
        //
        //    $('.header_search')
        //        .attr({
        //            placeholder: 'Search ' + search_placehoder
        //            , class: ''
        //        })
        //        .addClass('header_search fr ' + search_bg_icon_class);
        //    $('.search-form .dropdown button')
        //        .attr({
        //            class: ''
        //        })
        //        .addClass('cat-selected')
        //        .html($(this).find('i').clone());
        //
        //});
        // showing delete note promt
        $('.delete-note-btn').click(function () {
            $(this).parents('.note').find('.confirm-prompt-dialog').show();
        });
        // show modal note when picked clicked back
        // $('#import-media-from-deviceNote .show-prev-modal , #import-media-from-storythatNote .show-prev-modal , #import-media-from-fbNote .show-prev-modal ').click(function () {
        //     $('#add-media-for-note').modal('show');
        // });

        // show modal note when picked photo or video
        // $('#add-media-for-note #media-prev').click(function (e) {
        //     $('#add-note-1').modal('show');
        // });
        // showing options on calendar days
        $('.story-cont .three-dots-icon-big').click(function (e) {
            e.stopImmediatePropagation();
            $(this).parents('.body-content').find('.text-holder').toggleClass('expand');

        });

        // showing create story modal on click callendar +
        $('.monthly-body-wrap .blue-text').click(function (e) {
            e.preventDefault();
            $('#create-new-story').modal('show');
        });
        $('.day-has-story .add-2-day').click(function (e) {
            e.preventDefault();
            $('#create-new-story').modal('show');

        });
        // $('.stories-box').click(function () {
        //     $('.calendar-main-wrap .story-footer-options').hide();
        // });
        // swithiching tabs on profile page
        $('.button-controlls a').click(function () {
            $target = $(this).data('toggle');
            $('.button-controlls a').removeClass('active');
            $(this).addClass('active');
            $('.tab-panel').removeClass('active');
            $('#' + $target).addClass('active');
        });
        // showing modals from calendar
        $('.monthly-body-wrap .share-gal').click(function () {
            $('#share-story').modal('show');
        });
        $('.monthly-body-wrap .add-note-gal').click(function () {
            $('#add-note-1').modal('show');
        });

        // showing stories on calendar
             // $('.day-has-story').click(function(e){
             //      e.stopPropagation();

             //      $(this)
             //          .addClass('menu-open')
             //          .find('.stories-box').show();
             //        // showing three dots on calendar if text is long
             //        if(parseInt($(this).find('.stories-box .text-holder').css('height'))>=50){
             //          $(this).find('.stories-box .story-cont .three-dots-icon-big').show();
             //          $(this).find('.stories-box .text-holder').css({height:'50px'});
             //        }else{
             //          $(this).find('.stories-box .story-cont .three-dots-icon-big').hide();
             //        }
             //    });
             //     $('.calendar-main-wrap').click(function(){
             //         $('.monthly-calendar-days td').each(function(){
             //             $(this).removeClass('menu-open')
             //             .find('.stories-box').hide();
             //             $(this).find('.story-footer-options').hide();
             //        });
             //     });

             // toggling selected months on callendar cal-year
        $('.cal-header .cal-day').click(function (e) {
            e.stopPropagation();
            $('.cal-header .cal-day').removeClass('current');
            $(this).addClass('current');
        });
        $('.cal-header .cal-year').click(function (e) {
            e.stopPropagation();
            $('.cal-header .cal-year').removeClass('current');
            $(this).addClass('current');
        });
        // toggling start icon

        $('.like-number').click(function () {
            $(this).toggleClass('active');
        });
        // collapsing my notes on db click
        $(".note.reply-note").dblclick(function () {
            $('.note.reply-note').each(function () {
                $(this).removeClass('open');
            });
        });
        // togling open and close note
        $(document).on('click', '.note-head', function () {
            var note = $(this).closest('.note');
            var note_replies = note.data('note');
            var $note_id = $(this).parents('.note').attr('id');
            if (note.hasClass('open')) {
                note.removeClass('open');
                $('.' + note_replies).removeClass('open');
                localStorage[$note_id] = 'false';
            } else {
                note.addClass('open');
                $('.' + note_replies).addClass('open');
                localStorage[$note_id] = 'true';
            }
        });
        // keeping open notes when refreshed page
        $('.note').each(function () {
            var $note_id = $(this).attr('id');
            if (localStorage[$note_id] == 'true') {

                $(this).addClass('open');
            }
        });
        // toggling groups on privacy modal
        $('.group-select-permissions .group-select .group').click(function () {
            var filter_group = $(this).data('user-filter');
            $('.contact-hoverable').addClass('hide');
            $(filter_group).removeClass('hide');
            $('.group-select-permissions .group-select .group').removeClass('active');
            $(this).addClass('active');
        });

        // toggling checkboxes on privacy modal
        $('.group-select .group .small-sprite-unchecked').click(function (e) {
            e.stopImmediatePropagation();
            var filter_group = $(this).parents('.group').data('user-filter');
            $('.group-select-permissions .group-select .group').removeClass('active');
            $(this).parents('.group').addClass('active');
            $('.contact-hoverable').addClass('hide');
            $(filter_group).removeClass('hide');
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $(filter_group).addClass('active');
            } else {
                $(filter_group).removeClass('active');
            }

        });
        // toggling checkbox on privacy modal when manually selecting users
        $('.contact-hoverable').click(function () {
            $filters_array = $(this).attr('class').split(' ');
            var all_users_active = true;

            for (x = 0; x < $filters_array.length; x++) {
                $checkbox_selector = $filters_array[x];
                all_users_active = true;
                if ($checkbox_selector.trim().length) {
                    $('.group-select-permissions .most-contacted .' + $checkbox_selector).each(function () {
                        if ($(this).hasClass('active')) {} else {
                            all_users_active = false;
                            return false;
                        }
                    });

                }
                if (all_users_active) {
                    $('.' + $checkbox_selector + '-checkbox').addClass('active');
                } else {
                    $('.' + $checkbox_selector + '-checkbox').removeClass('active');
                }
            }
        });

        $('#media-notes').click(function () {
            $(this).find('.gall-footer-options').slideUp();
        });

        $('.media-notes-box .toggle-note').click(function () {
            $(this).parents('.media-notes-box').toggleClass('collapsed').find('.comment-body').slideToggle();
            var reply_box = $(this).parents('.media-notes-box').data('reply');
            $('.' + reply_box).slideToggle();
        });
        // $('#photo-video-nav button').click(function () {
        //     $('#photo-video-nav button').removeClass('active');
        //     $(this).addClass('active');
        // });
        // $('#photo-video-nav button.comment-view').click(function () {
        //     $('.photo-video-modal .media-container').removeClass('active about-view');
        //     $('.photo-video-modal .media-container').addClass('active comments-active');

        // });
        // $('#photo-video-nav button.about-view').click(function () {
        //     $('.photo-video-modal .media-container').addClass('active about-view');
        //     $('.photo-video-modal .media-container').removeClass('comments-active');
        // });
        // $('#photo-video-nav button.default-view').click(function () {
        //     $('.photo-video-modal .media-container').removeClass('active');
        // });

        // edit text on gallery
        $('#edit-text-modal').click(function(){

            $('.photo-video-modal .content-box .content-body ').toggleClass('editable');

            if($('.photo-video-modal .content-box .content-body').hasClass('editable')){
                $('.photo-video-modal .content-box .content-body p').attr({'contenteditable':'true'});
                $(this).text('Save');
                $('#photo-modal .about-view').addClass('crop-show');
            }else{
                $('#photo-modal .about-view').removeClass('crop-show');
                $('.photo-video-modal .content-box .content-body p').removeAttr('contenteditable');
                $(this).html('<i class="fa fa-pencil-square-o " aria-hidden="true"></i> Edit');
            }

        });
        // adding keywords on gallery modal
        $('#add-keyword-form').submit(function(e){
            e.preventDefault();
            $keyword = $('#add-keyword-form').find('input').val();
            $('#add-keyword-form').find('input').val('');
            $('<span> ' + $keyword + ' <a href="#" title="Removing tag"></a></span>').appendTo($('.photo-video-modal p.note-keywords'));
            removeKeyword();
        });
        removeKeyword();
        //removing keywords from gallery modal
        function removeKeyword(){
            $('.photo-video-modal .note-keywords a').click(function(){
                $(this).parent('span').remove();
            });
        }
        // showing title on gallery page when modal opened
        $('.gall-img-cont').click(function () {
            var title = $(this).parents('.gallery-item-box').find('h3').text();
            var image = $(this).find('img').attr('src');

            $('#photo-modal .modal-title').html(title);
            $('#photo-modal .item').removeClass('active');
            $('#photo-modal').find('img[src$="' + image + '"]').parents('.item').addClass('active');
        });
        // showing add more networks on edit account
        //$('.add-more-social').click(function () {
        //    $(this).addClass('hide');
        //    $('.add-social-profile').toggleClass('hide');
        //});
        //// toggling edit and live view on my account
        //$('#edit-profile-btn').click(function () {
        //    $('.about-view').toggleClass('hide');
        //    $('.default-view').toggleClass('hide');
        //});

        //  SUPERSIZED PLUGIN

        // toggling arrows on supersized plugin
        $('#supersized li, #prevslide, #nextslide, #closeslide').mouseenter(function () {
            $('#prevslide, #nextslide').css({
                opacity: '0.6'
            });
        });
        // navigate slide next
        $('#nextslide').click(function () {
            api.nextSlide();
        });
        // navigate slide prev
        $('#prevslide').click(function () {
            api.prevSlide();
        });
        $('a#close-fullscreen').click(function () {
            $('body').removeClass('full-screen');
            $('#photo-modal').modal('show');
        });
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                $('body').removeClass('full-screen');
                $('#photo-modal').modal('show');
            }
        });

        $('#report-container .st-radio ').click(function () {
            $('#report-container .additional-details').fadeIn();
        });
        // showing total of slides
        $('.totalslides').html($('#supersized li').length);
        $('#supersized li').mouseleave(function () {
            $('#prevslide, #nextslide').css({
                opacity: '0'
            });
        });
        // toggling fullscreen images
        // $('.full-screen-resize').click(function () {
        // // $('#fullscreen').click(function () {

        //     $('body').addClass('full-screen');
        //     $(window).resize();
        //     $image_source = $(this).parents('.image-ram').find('.item.active img').attr('src');
        //     $('#thumb-list img[src="' + $image_source +'"]').trigger('click');
        // });

        // showing and hiding thumbs
        $('#tray-button').click(function () {
            $('#thumb-tray').toggleClass('hidden');
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $(this).find('img').attr({
                    src: 'img/button-tray-down.png'
                });
            } else {
                $(this).find('img').attr({
                    src: 'img/button-tray-up.png'
                });
            }
        });
        // adding body class on modal show
        $('.modal').on('shown.bs.modal', function() {
         setTimeout(function(){
            $("body").addClass('modal-open');
              },300);
        });

        // playing video on gallery
        $('.gall-vid-play').click(function () {
            $(this).toggleClass('playing');

        });

        // caling tags plugin
        if ($('#tags1').length > 0) {
            $('#tags1').tagsInput({
                defaultText: '+ Add Keywords'
            });
            $('#tags2').tagsInput({
                defaultText: '+ Add Keywords'
            });
            $('#tags3').tagsInput({
                defaultText: '+ Add Keywords'
            });
        }

        // playing video on gallery
        $('.nav-calendar').click(function () {
            $('body').toggleClass('over-hidden');
        });

        $share_cont_clicked = true;
        // selecting all contacts on add share modal

         $('#all-contacts-share').parent('.checkbox-container').find('.st-checkbox').click(function () {

             if($share_cont_clicked){
                $('#share-story .contact').addClass('group-member');
                $share_cont_clicked = false;

            }else{
                $('#share-story .contact').removeClass('group-member');
                $share_cont_clicked = true;

            }


            });
        //calling timepicker on photo modal
        // $('#time-input-picker').timepicker({'timeFormat': 'H:i' });
        // //calling datepicker on photo modal
        // $('#date-input').datepicker();

    });
}
