$(function(){
//    $(document).on('click','.select-group-label',function(){
//        toggleClasses($(this),'unchecked-label','checked-label')

    //Landing page calendar
    $('.calendar-marked').popover();

    //Dropdown enable
//    $('.dropdown-toggle').dropdown();



    //General checkbox
    $('.select-group-label input[type="checkbox"],' +
        '.rememberCheck input[type="checkbox"],'+
        '.check-contact input[type="checkbox"]').change( function(event){
        event.stopPropagation();
        toggleClasses($(this).parent(),'unchecked-label','checked-label');
    });

    //Story dropdown toggle functions
    $(document).on('click','button.expand-story',function(){
        $(this).closest('.single-story-wrap').toggleClass('open-story');
    });

    //add to favorites
    $(document).on('click','button.add-to-favorites',function(){
        $(this).toggleClass('added');
    });

    //Users search remove btn listener.
    $(document).on('click','.remove-found', function(){
        $(this).closest('.selectedPill').remove();
    });


    //Star note/story/whattever

    $('.star-story').click(function(event){
        var container = $(this).find('.star-counter');
        var value = parseInt($(container).html())
        if($(this).hasClass('starred')){
            value--;
        }else if ($(this).hasClass('unstarred')){
            value++;
        }
        $(container).html(value);
        toggleClasses($(this),'starred','unstarred');
    });

    //facebook photos checkbox
    // @global var facebookImportCounter = 0; It's in the template file.
    $('.facebook-check input[type="checkbox"]').change(function(event){

        var container = $(this).parent();

        event.stopPropagation();

        if( container.hasClass('checkedFb') ){

            container.find('span').remove();

            container.removeClass('checkedFb');
            facebookImportCounter--;
        }else {
            container.addClass('checkedFb');
            container.find('span').remove();
            container.append('<span class="glyphicon glyphicon-ok"></span>');
            facebookImportCounter++;
        }
        updateValue($('.checkbox-counter'),facebookImportCounter )
    });


    //set privacy values functionality

    $('.toggle-button').click(function(event){
        toggleClasses($(this),'on','off');
    });

    $('.privacy-switch').click(function(event){
        var current = toggleClasses($(this),'public', 'private');
        $(this).find('input').val(current);
        $(this).find('.switch-value').html(current);
    })

    //upload avatar
    $('.change-avatar').click(function(event){
        event.preventDefault();
        $(this).parent().find('input[type="file"]').click();

    })

    $('.half-input').focus(function(event){

        $(this).closest('.input-wrap').css({
            'border-bottom': '1px solid #008bd3',
            'border-left'  : '1px solid #008bd3',
            'border-right' : '1px solid #008bd3'
        })
    }).focusout(function(event){

        $(this).parent('.input-wrap').css({
            'border-bottom': '1px solid #8a8a8a',
            'border-left'  : '1px solid #8a8a8a',
            'border-right' : '1px solid #8a8a8a'
        })
    })

    $('.transparent-input').focus(function(event){

        $(this).parent().css({
            'border-bottom': '1px solid #008bd3',
            'border-left'  : '1px solid #008bd3',
            'border-right' : '1px solid #008bd3'
        });

        $(this).parent().find('.bottom-right-corner').css({
            'border-color': 'transparent transparent #008bd3 transparent'
        })
    }).focusout(function(event){

        $(this).parent().css({
            'border-bottom': '1px solid #8a8a8a',
            'border-left'  : '1px solid #8a8a8a',
            'border-right' : '1px solid #8a8a8a'
        })
        $(this).parent().find('.bottom-right-corner').css({
            'border-color': 'transparent transparent #8a8a8a transparent'
        });
    })

    //register validation
    $('.login-input').on( "focusout", function(){
        validateInput($(this));
    });

});

function toggleClasses(element, firstClass, secondClass){
    var currentClass = '';

    if( element.hasClass(firstClass) ){

        element.removeClass(firstClass).addClass(secondClass);
        currentClass += secondClass;

    }else if( element.hasClass(secondClass) ){

        element.removeClass(secondClass).addClass(firstClass);
        currentClass += firstClass;
    }

    return currentClass;

}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


function validateInput(item){

    var message = '';
    var containerClass = '';
    var container = '.requiredInput';

    switch( item.data('validation') ){

        case 'email':

            if( item.val().length > 0 && IsEmail( item.val() )){
                message = '<span class="glyphicon glyphicon-ok"></span> Great, Thanks!';
                containerClass =  'success';
            }else{
                message =  '<i class="fa fa-times"></i> Please enter a valid email address!';
                containerClass =  'error';
            }
            break;

        case 'username' :

            if(true){ //todo de verificat cum trebuie sa arate username-ul
                message =  '<span class="glyphicon glyphicon-ok"></span> Great, Thanks!';
                containerClass =  'success';
            }else{
                message = '<i class="fa fa-times"></i> Bad username!';
                containerClass =  'error';
            }
            break;

        case 'password' :

            if( item.val().length >= 6 ){ //todo de verificat cum trebuie sa arate parola
                message = '<span class="glyphicon glyphicon-ok"></span> Great, Thanks!';
                containerClass =  'success';
            }else{
                message = '<i class="fa fa-times"></i> Password must be at least 6 characters!';
                containerClass =  'error';
            }
            break;
    }
    systemMessage( item.next(), message, container, containerClass)
}

/*
* @param holder :   Message container
* @param message:   Actual message to display;
* @param classType: Css class to make the container and it's children look nice.
*/

function systemMessage(msgHolder, message, container, containerClass){

    var fieldContainer = msgHolder.closest(container);

    if(!fieldContainer.hasClass(containerClass) ){
        fieldContainer.addClass(containerClass);
    }

    msgHolder.html(message);
}

function updateValue(container, value){
    container.html(value);
}