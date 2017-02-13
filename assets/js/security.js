/**
 * Created by Gabriel Colita on 25.06.2014.
 */
$(document).ready(function() {

    /**
     * Handle Ajax Login/Registration
     */
   $('.ajax-security-form').on('submit', function(e) {
       e.preventDefault();

       var form     = $(this);
       var btn      = form.find('.submit-button');

       btn.button('loading');

       form.find('.validation-wrong').addClass('hide');

       $.ajax({
           type        : $(this).attr( 'method' ),
           url         : $(this).attr( 'action' ),
           data        : $(this).serialize(),
           success     : function(data, status, object) {
               if (data.ok == true) {
                   window.location.href = data.referer;
               } else {

                   /* In case we get back what block we should unhide */
                   if(data.showBlock) {
                       form.find('.'+data.showBlock).removeClass('hide');
                   } else

                   /* In case we get a number of errors */
                   if(data.errors !== undefined) {
                       applyFormErrorMessages(form, data.errors);
                   }

                   btn.button('reset');
               }
           }
        });
   });

    /**
     * Apply errors to forms
     * @param elem
     * @param response
     */
    function applyFormErrorMessages(elem, response, tail) {

        if(tail === undefined) {
            var tail = '';
        }
        if(response) {
            $.each(response, function (key, value) {
                if(typeof(value[0]) == "string") {
                    var target = elem.find('.error-for-'+tail+key).removeClass('hide');
                    target.find('.message').html(value[0]);
                } else if(typeof(value[0] == 'object')) {
                    applyFormErrorMessages(elem, value, key+'-');
                }
            });
        }
    }

    /**
     * For closing/opening consecutive modals
     */
    $('.another-modal').on('click', function() {
        $('#'+$(this).data('close')).modal('hide');
    });

    /**
     * Hide errors when fields are being changed
     */
    $('.login-input').on('keyup', function() {
        var elem = $(this).parent().find('.validation-wrong');
        if(!elem.hasClass('hide')) {
            elem.addClass('hide');
        }
    })
});
