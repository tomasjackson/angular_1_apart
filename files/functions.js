function functionsJS() {
//     $(function(){

//                 $.supersized({

//                     // Functionality
//                     slideshow               :   1,          // Slideshow on/off
//                     autoplay                :   0,          // Slideshow starts playing automatically
//                     start_slide             :   1,          // Start slide (0 is random)
//                     stop_loop               :   0,          // Pauses slideshow on last slide
//                     random                  :   0,          // Randomize slide order (Ignores start slide)
//                     slide_interval          :   3000,       // Length between transitions
//                     transition              :   6,          // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
//                     transition_speed        :   1000,       // Speed of transition
//                     new_window              :   1,          // Image links open in new window/tab
//                     pause_hover             :   0,          // Pause slideshow on hover
//                     keyboard_nav            :   1,          // Keyboard navigation on/off
//                     performance             :   1,          // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
//                     image_protect           :   1,          // Disables image dragging and right click with Javascript

//                     // Size & Position
//                     min_width               :   0,          // Min width allowed (in pixels)
//                     min_height              :   0,          // Min height allowed (in pixels)
//                     vertical_center         :   1,          // Vertically center background
//                     horizontal_center       :   1,          // Horizontally center background
//                     fit_always              :   1,          // Image will never exceed browser width or height (Ignores min. dimensions)
//                     fit_portrait            :   1,          // Portrait images will not exceed browser height
//                     fit_landscape           :   0,          // Landscape images will not exceed browser width

//                     // Components
//                     slide_links             :   'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
//                     thumb_links             :   1,          // Individual thumb links for each slide
//                     thumbnail_navigation    :   1,          // Thumbnail navigation
//                     slides                  :   [           // Slideshow Images
// //                                                      {image : 'http://buildinternet.s3.amazonaws.com/projects/supersized/3.2/slides/kazvan-1.jpg', title : 'Image Credit: Maria Kazvan', thumb : 'http://buildinternet.s3.amazonaws.com/projects/supersized/3.2/thumbs/kazvan-1.jpg', url : 'http://www.nonsensesociety.com/2011/04/maria-kazvan/'},


//                         {image:'assets/img/single-story-carousel-img-2.jpg', title:'Test image', thumb:'assets/img/single-story-carousel-img-2.jpg', url:'assets/img/single-story-carousel-img-2.jpg'},
//                         {image:'assets/img/single-story-carousel-img-1.jpg', title:'Test image', thumb:'assets/img/single-story-carousel-img-1.jpg', url:'assets/img/single-story-carousel-img-1.jpg'}
//                                                                         ],

//                     // Theme Options
//                     progress_bar            :   1,          // Timer for each slide
//                     mouse_scrub             :   0

//                 });
//     });

//     theme = {
//         afterAnimation:  function(){
//             $('.slidenumber').html(vars.current_slide + 1);
//         }
//     }

    $(function(){

        //calendar toggle
        //$('.nav-calendar').on('click',function(){
        //    $(this).toggleClass( "open" );
        //    if($(this).hasClass('open')){
        //        $('.calendar-main-wrap').css('display','block');
        //    }else{
        //        $('.calendar-main-wrap').css('display','none');
        //    }
        //});

        //calendar view toggle
        $('.choose-cal-type').on('click',function(){
            var viewType = $(this).attr('rel');
            var calendar = $(this).closest('.calendar-main-wrap');
            calendar.attr('class','calendar-main-wrap ' + viewType );
            //ajax goes here
        });

        //year select
        $('.choose-year').on('click',function(){
            $('#selected-year').html($(this).html());
        });

        //chose month
        $('.select-cal-month').on('click',function(){
            $('.select-cal-month').removeClass('active');
            $(this).addClass('active');
            var month = $(this).data('month');
            //$.get month here
        });

        //Day hover scroll fix
        $('.day-has-story .day-info').bind('mousewheel', function(e, d) {

            var height = $(this).height();
            var scrollHeight = $(this).get(0).scrollHeight;

            if((this.scrollTop === (scrollHeight - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
                e.preventDefault();
            }
        });

    });

    /*$(document).ready(function(){
        $('.calendar-nav-left th.prev').html('<span class="left-cal-nav"></span>');
        $('.calendar-nav-left th.next').html('<span class="right-cal-nav"></span>');
        $('.calendar-nav-left .datepicker-switch').append('<span class="calendar-small-icon"></span>');
    });

    $(document).ready(function(){
        $('.calendar-nav-left th.prev').html('<span class="left-cal-nav"></span>');
        $('.calendar-nav-left th.next').html('<span class="right-cal-nav"></span>');
        $('.calendar-nav-left .datepicker-switch').append('<span class="calendar-small-icon"></span>');
    });*/

    var newStoryMediaFiles = [], WmdsCropObj;

    $(function () {
        $('.toggle-register').click(function () {
            $('#login-modal').modal('hide');
            $('#registration-modal').modal('show');
        });

        $('.back-to-login').click(function () {
            $('#registration-modal').modal('hide');
            $('#login-modal').modal('show');
        });
    });

    $(document).ready(function(){
     //home calendar
     $('.calendar-nav.pull-left').click(function(){
       if($('.month-holder').hasClass('current-month')){
          $('.month-holder').removeClass('current-month');
          $('.month-holder').addClass('prev-month');
          $('.calendar-head span').text($('.calendar-table-wrap').first().data('month') + ' ' + $('.calendar-table-wrap').first().data('year'));
       }else if($('.month-holder').hasClass('next-month')){
          $('.month-holder').removeClass('next-month');
          $('.month-holder').addClass('current-month');
          $('.calendar-head span').text($('.calendar-table-wrap').first().next().data('month') + ' ' + $('.calendar-table-wrap').first().next().data('year'));
       }

    });

    $('.calendar-nav.pull-right').click(function(){
     if($('.month-holder').hasClass('current-month')){
          $('.month-holder').removeClass('current-month');
          $('.month-holder').addClass('next-month');
          $('.calendar-head span').text($('.calendar-table-wrap').last().data('month') + ' ' + $('.calendar-table-wrap').last().data('year'));
       }else if($('.month-holder').hasClass('prev-month')){
          $('.month-holder').removeClass('prev-month');
          $('.month-holder').addClass('current-month');
          $('.calendar-head span').text($('.calendar-table-wrap').first().next().data('month') + ' ' + $('.calendar-table-wrap').first().next().data('year'));
       }
        });

        $('.calendar-table-wrap td.calendar-marked').click(function(){

            $bg_img = $(this).data('bg-img');
            $('.home-header-image').css({backgroundImage:'url(assets/img/'+$bg_img+'.jpg)'});

        });
    });
}
