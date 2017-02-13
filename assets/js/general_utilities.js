
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
    $(document).on("focusout","#registerEmail",function(event) {
        event.stopPropagation();
        var inputContainer = $(this).closest('.form-group');
        throwValidationError( inputContainer, validateEmail($(this).val()) );
    });

    $(document).on("focusout","#registerPassword",function(event) {
        event.stopPropagation();
        var minCharacters = 6;
        var inputContainer = $(this).closest('.form-group');
        throwValidationError( inputContainer, ( $(this).val().length >= minCharacters ) );
    });

    $(document).on("focusout","#registerUsername",function(event) {
        event.stopPropagation();
        var minCharacters = 6;
        var inputContainer = $(this).closest('.form-group');
        throwValidationError( inputContainer, ( $(this).val().length >= minCharacters ) );
    });

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


    //Contact select
    $('.contact-hoverable').on('click',function(){
        $(this).toggleClass('active');
    });

});

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
