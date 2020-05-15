(function($){
    $.deparam = $.deparam || function(uri) {
        if (uri === undefined) 
            uri = window.location.pathname;
        
        let val1 = window.location.pathname;
        let val2 = val1.split('/');
        let val3 = val2.pop();

        return val3;
    }
})(jQuery);