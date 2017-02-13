$(function() {
    $('.notifications-wrap button').click(function(e) {
    });

    // Contact Request Handler
    $(document).on("click",".contact-action",function(event) {
        event.stopPropagation();
        switch($(this).data('contact-action')){
            case 'accept': addContact($(this).data('contact-id'),this);    break;
            case 'ignore': ignoreContact($(this).data('contact-id'),this); break;
            default : console.log('Invalid data state:contact-action');
        }
    });
});

function addContact(contactId, button){

    //  add ajax post call here. Start animation on done().
    var successMess = $(button).closest('.notification-content').find('.accepted-contact-actions');
    var toHide = $(button).closest('.contact-actions-wrap');


    toHide.slideUp('fast');
    successMess.slideDown('fast');
}
function ignoreContact(contactId, button){

    //  add ajax post call here. Start animation on done().
    var toHide = $(button).closest('.notification');

    toHide.slideUp('fast');
}