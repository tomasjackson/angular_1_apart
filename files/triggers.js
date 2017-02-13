$(document).ready(function() {

    /* set same height for sidebar and content blocks */
    equalBlocks();

    /* update search field (placeholder and action) based on current page */
    alterSearchFieldBasedOnRoute();

    /* initiate history.js website navigation */
    initWebsiteNativation();
});