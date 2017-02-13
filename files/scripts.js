/**
 * Created by Gabriel Colita on 11.02.2014.
 */
function scriptsJS() {
	$(document).ready(function() {
	    equalBlocks();
	});
}

function equalBlocks() {
    var $sidebar = $('#sidebar');
    var $content = $('#content');
    var sidebarHeight = $sidebar.height();
    var contentHeight = $content.height();

    if(sidebarHeight < contentHeight) {
        $sidebar.css('height',contentHeight + 'px');
    }
}