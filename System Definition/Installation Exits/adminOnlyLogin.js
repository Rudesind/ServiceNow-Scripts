/**
 * Prevents non-authorized users from logging in and displays an alert.
 * Currently only allows users that are a member of a group.
 * Note: It is possible this is not the same as locking out a user. This will 
 * only affect users that attempt to authenticate via the GUI. Logging in via
 * API or other methods will still be possible.
 * 
 * Note: Override the 'Login' installation exit.
 * 
 * This installation exit replaces the default "Login" installation exit.
 * 
 * Original source: https://www.servicenowguru.com/system-definition/custom-login-validation-installation-exits/
 * 
 *
 * Author : ServiceNow Administrators
 * Updated: 12/20/21
 */

gs.include("PrototypeServer");

var AdminOnlyLogin = Class.create();
AdminOnlyLogin.prototype = {
    initialize: function () {},

    process: function () {
        // the request is passed in as a global
        var userName = request.getParameter("user_name");
        var userPassword = request.getParameter("user_password");

        var user = GlideUser;
        var authed = user.authenticate(userName, userPassword);

        // Check if user is authorized
        //
        var isAdmin = false;
        var isAuthorized = false;
        var authGroup = gs.getProperty('group.property'); // Group of authorized users can be controlled via a system property
        var um = new UserManager(); // Custom script include for managing users. Optional

        isAdmin = um.getRole(userName, 'admin'); // Check user roles. Can be replaced with non-custom script include
        isAuthorized = um.getGroup(userName, authGroup); // Check user roles. Can be replaced with a non-custom script include

        // Only authenticate if user is an admin or authorized
        //
        if (authed && isAdmin) {

            return user.getUser(userName);

        } else if (authed && isAuthorized) {

            return user.getUser(userName);

        }

        // If the user is not an authorized user, display an alert
        //
        if (!isAdmin || !isAuthorized) {

            gs.addErrorMessage('You do not have permission to access this instance. Only authorized users can login. Please contact your system administrator if you need access to this instance.');

        }

        // Note that unauthroized users will still be shown the incorrect password message
        //
        this.loginFailed();

        return "login.failed";
    },

    loginFailed: function () {
        if (GlideController.exists("glide.ldap.error.connection")) {
            var ldapConnError = GlideController.getGlobal("glide.ldap.error.connection");
            if (GlideStringUtil.notNil(ldapConnError))
                GlideSession.get().addErrorMessage(ldapConnError);
        } else {
            var message = GlideSysMessage.format("login_invalid");
            GlideSession.get().addErrorMessage(message);
        }

    }

}
