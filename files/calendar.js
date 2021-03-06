/**
 * Created by Gabriel Colita on 11.02.2014.
 */
function calendarJS() {
    $(document).ready(function() {
        $('.story-action').on('click',function(){
            var content = '<button type="button" class="btn btn-default btn-lg btn-block">Capture your Thoughts</button>';
            content += '<button type="button" class="btn btn-default btn-lg btn-block">Add your Photo/Video moments</button>';
            $(this).popover({
                html: true,
                title: $(this).data('date'),
                trigger: 'manual',
                placement: 'bottom',
                content: content
            });
            $(this).popover('toggle');
    //        $('.story-action').not(this).popover('hide');
        });
        $('#months-view tbody tr td').on('mouseenter',function(){
            var current = $(this).find('.story-action');
            $(current).find('.popover').remove();
    //        if($('.popover:visible').length > 0 ){
    //            //$(current).closest('.popover_custom').remove();
    //            $(current).popover('toggle');
    //        }
        });

        $('.switch_month').on('click',function(e){
            e.preventDefault();
            /*Move current class to clicked month */
            $('.months-list .switch_month').removeClass('current');
            $(this).addClass('current');

            var calendar = new calendarCls();
            calendar.month = $(this).data('month');
            calendar.year = $('#crt-year').html();
            calendar.type = 'monthly';
            var template = $('#template-list-calendar').html();
            var clndr = Mustache.to_html(template,calendar.execute());
            $('#months-view').html(clndr);
        });

        $('.prev-year,.next-year').on('click',function(e){
            e.preventDefault();
            var year = parseInt($('#crt-year').html());
            /*Increase/decrease year in both cases */
            if($(this).hasClass('next-year')){
                year++;
            }else{
                year--;
            }

            $('#crt-year').html(year);

            var calendar = new calendarCls();
            calendar.month = $('.months-list .current').data('month');
            calendar.year = year;
            calendar.type = 'monthly';
            var template = $('#template-list-calendar').html();
            var clndr = Mustache.to_html(template,calendar.execute());
            $('#months-view').html(clndr);
        });
    });
}