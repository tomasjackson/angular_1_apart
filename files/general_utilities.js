function generalUtilities() {
    $(function(){


        //RADIO buttons listener
        //All radios  must be contained by a label class=st-radio
        //All radio labels for the same input type must be placed in .radioContainer.
        $(document).on("click",".st-radio",function(event) {
            event.stopPropagation();
            $(this).closest('.radioContainer').find('.st-radio').removeClass('checked');
            $(this).addClass('checked');
        });

        //$(document).on("click",".st-checkbox",function(event) {
        //    event.stopPropagation();
        //    if($(this).hasClass('checked')){
        //        $(this).removeClass('checked');
        //    }else{
        //        $(this).addClass('checked');
        //    }
        //});

        $(document).on("click",".social-input label",function(event) {
            event.stopPropagation();
            $(this).fadeOut('fast');
            $(this).closest('.social-input').find('input');
        });

        $(document).on("focusout",".social-input input",function(event) {
            event.stopPropagation();
            $(this).closest('.social-input').find('label').fadeIn('fast');
        });

        //Register Validation
    /*    $(document).on("focusout","#code-reset-email",function(event) {
            event.stopPropagation();
            var inputContainer = $(this).closest('.form-group');
            throwValidationError( inputContainer, validateEmail($(this).val()) );
        });
    */

        var createDropdown  = $('.create-story-popover').html();

        //POPOVER
        $('.create-story-dropdown').popover({
            template : createDropdown,
            placement: 'bottom'
        });

        //TOOLTIP GENERAL BIND
        $('.tooltip-mark').tooltip({
            placement:'bottom',
            trigger: 'hover focus'
        });

        //Shared story toggle
        $(document).on('click','.shared-story-options',function(event){
            $(this).closest('.shared-story-footer').toggleClass('toggled');
        })

        //privacy toggle listener
        $('.privacy-radio').on('click',function(event){
            $('.privacy-radio').removeClass('checked');
            $(this).addClass('checked');
            var privacyType = $(this).attr('rel');
            $('#privacy-selectors').attr('class',privacyType)
        });


        //Group select
        $('.contact-tabs li.group').click(function(){

            $('.contact-tabs li.group').removeClass('active-group');
            $(this).addClass('active-group');
            var tabOpen = $(this).find('.group-name').data('group-name');

            $('.group-contacts').removeClass('selected-group');
            $('.group-wrap').find(" [data-group-name='" + tabOpen + "']").addClass('selected-group');
        });

        //Contact select
        $('.contact-hoverable').on('click',function(){
            $(this).toggleClass('active');
        });

        //JCROP
        $('#jcrop_target').Jcrop();

    });
}

//param [DOM]  errorContainer input parent that contains .validation-wrap
//param [bool] isValid true/false error
function throwValidationError(errorContainer, isValid){
    if(isValid){
        errorContainer.find('.validation-wrong').css('display','none');
        errorContainer.find('.validation-ok').css('display','block');
    }else{
        errorContainer.find('.validation-ok').css('display','none');
        errorContainer.find('.validation-wrong').css('display','block');
    }
    errorContainer.find('.validation-wrap').slideDown('fast');
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
