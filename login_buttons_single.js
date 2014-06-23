(function () {
  // for convenience
  var loginButtonsSession = Accounts._loginButtonsSession;


  Template._loginButtonsLoggedOutSingleLoginButton.rendered = function(){
    var serviceName = this.data.name;
    $('.sign-button').click(function(){
      loginButtonsSession.resetMessages();
      var callback = function (err) {
        if (!err) {
          // Hide Sign modal (bootstrap)
          $('#sign-popup').modal('hide');
          // loginButtonsSession.closeDropdown();
        } else if (err instanceof Accounts.LoginCancelledError) {
          // do nothing
        } else if (err instanceof Accounts.ConfigError) {
          loginButtonsSession.configureService(serviceName);
        } else {
          loginButtonsSession.errorMessage(err.reason || "Unknown error");
        }
      };

      var loginWithService = Meteor["loginWith" + capitalize(serviceName)];

      var options = {}; // use default scope unless specified
      if (Accounts.ui._options.requestPermissions[serviceName])
        options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];

      loginWithService(options, callback);
    });
  };

  Template._loginButtonsLoggedOutSingleLoginButton.configured = function () {
    return !!Accounts.loginServiceConfiguration.findOne({service: this.name});
  };

  Template._loginButtonsLoggedOutSingleLoginButton.capitalizedName = function () {
    if (this.name === 'github')
      // XXX we should allow service packages to set their capitalized name
      return 'GitHub';
    else
      return capitalize(this.name);
  };

  // XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
  var capitalize = function(str){
    str = str == null ? '' : String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
}) ();
