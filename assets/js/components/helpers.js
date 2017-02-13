function equalBlocks() {
    var $sidebar = $('#sidebar');
    var $content = $('#content');
    var sidebarHeight = $sidebar.height();
    var contentHeight = $content.height();

    if(sidebarHeight < contentHeight) {
        $sidebar.css('height',contentHeight + 'px');
    }
}