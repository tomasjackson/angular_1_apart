    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1384266651588575',
            xfbml      : false,
            version    : 'v2.6'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    var googleAuth;
    onLoadGoogleInit = function(){
        gapi.load('auth2', function(){
            googleAuth = gapi.auth2.init({
                client_id: '771862470260-jqjci52923t8q1ndj8qgkog5jb64sug4.apps.googleusercontent.com',
                // client_id: '599662646570-8uh54d7tah6fc3a4l40r7fa5g3gnvkvo.apps.googleusercontent.com',
                scope: 'profile email'
            });
        })
    };
