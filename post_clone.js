/** 
 * Script performs several post-clone actions on a target instance. Script 
 * should only be used on non-production ServiceNow instances.
 * 
 * This script can be modified to fit the needs of your instance.
 *
 * Idea taken from: https://hi.service-now.com/kb_view.do?sysparm_article=KB0547597
 *
 * Author : Rudesind
 * Updated: 12/20/2021
 */

// Initialize variables
//
try {

    var devInstance = '', 
        qaInstance = '',
        prodInstance = '',
        currentInstance = '',
        devEmailRedirect = '';

} catch (e) {
    error('Error initializing variables: ' + e);
}

// Set values
//
try { 

    var devInstance = '###'; // Name of dev instance. Domain can be dropped.
    var qaInstance = '###'; // Name of test or qa instance. Domain can be dropped.
    var prodInstance = '###'; // Name of production instance. Domain can be dropped.
    var currentInstance = gs.getProperty('instance_name');
    var devEmailRedirect = '###'; // Email for dev/test to redirect to

} catch (e) {
    error('Error setting varialbes: ' + e);
}

// Check the current instance
// Ensures this script won't run on prod or unknown instance
// Also specifies the different configs for an instance (optional)
//
switch (currentInstance) {

    case devInstance:
        devConfig();
        break;

    case qaInstance:
        qaConfig();
        break;

    case prodInstance:
        error('WARNING: This script CANNOT run on a production instance.');
        break;

    default:
        error('The following instance is not known: ' + currentInstance);
}

// Applies instance specific customization for a 'dev' instance
//
function devConfig() {

    try {

        // Set the base color
        //
        gs.setProperty('css.base.color', 'darkred');

        // Set header name
        //
        gs.setProperty('glide.product.description', 'DEV');

        // Enable ATF
        //
        enableATF();

        // Enable email
        //
        enableEmail();

        // Disable scheduled jobs
        //
        disableScheduledJobs();

        // Lockout active non-admin users
        //
        lockUsers();

        // Disable all themes
        //
        disableThemes();

        // Enable the dev theme
        //
        enableTheme('###'); // Only run this if you've created a specific theme for the dev environment

        // Force the theme for all users
        //
        changeTheme('###');

    } catch (e) {
        error('Error applying dev config: ' + e);
    }

}

// Applies instance specific customization for a 'test' instance
//
function qaConfig() {

    try {

        // Set the base color
        //
        gs.setProperty('css.base.color', 'blue');

        // Set header name
        //
        gs.setProperty('glide.product.description', 'TEST');

        // Enable email
        //
        enableEmail();

        // Disable scheduled jobs
        //
        disableScheduledJobs();

        // Disable all themes
        //
        disableThemes();

        // Enable the test theme
        //
        enableTheme('###');

        // Force the theme for all users
        //
        changeTheme('###');

    } catch (e) {
        error('Error applying qa config: ' + e);
    }

}

// Enables the running and scheduling of ATF tests.
//
function enableATF () {

    // Enable ATF testing properties
    //
    try {

        gs.setProperty('sn_atf.runner.enabled', 'true');
        gs.setProperty('sn_atf.schedule.enabled', 'true');

    } catch (e) {
        error('Error enabling ATF: ' + e);
    }

}

// Enables 'Email sending [...]' and 'Email receiving [...].'
//
function enableEmail() {

    // Enable email
    //
    try {

        gs.setProperty('glide.email.read.active', 'true');
        gs.setProperty('glide.email.smtp.active', 'true');

    } catch (e) {
        error('Error enabling email: ' + e);
    }

}

// Lockout non-admin users.
//
function lockUsers() {

    try {

        var users = new GlideRecord('sys_user');

        users.addQuery('active', 'true');
        users.addQuery('locked_out', 'false');
        users.addQuery('roles', '!=', 'admin');
        users.query();

        while (users.next()) {

            users.locked_out.setValue('true');
            users.update();

        }

    } catch (e) {
        error('Failed to lockout users: ' + e);
    }

}

// Sets 'active' to false for all scheduled jobs (sysauto).
// This will also disable the LDAP scheduled loads.
//
function disableScheduledJobs() {

    try {

        var sjRec = new GlideRecord('sysauto');

        sjRec.addQuery('active', 'true');
        sjRec.query();

        while (sjRec.next()) {

            sjRec.active.setValue('false');
            sjRec.update();

        }

    } catch (e) {
        error('Error disabling scheduled jobs: ' + e);
    }

}

// Disable all active themes. Note that the system theme cannot be disabled.
//
function disableThemes() {

    try {

        var themesRec = new GlideRecord('sys_ui_theme');

        themesRec.addQuery('device', 'Concourse');
        themesRec.addQuery('active', 'true');
        themesRec.query();

        while (themesRec.next()) {

            themesRec.active.setValue('false');
            themesRec.update();

        }

    } catch (e) {
        error('Error disabling themes: ' + e);
    }

}

// Enable a theme.
//
function enableTheme(theme) {

    try {

        var themeRec = new GlideRecord('sys_ui_theme');

        if (themeRec.get('name', theme)) {

            themeRec.active.setValue('true');
            themeRec.update();

        }

    } catch (e) {
        error('Error enabling theme: ' + e);
    }

}

// Changes the theme for all users.
//
function changeTheme(theme) {

    try {

        var themeRec = new GlideRecord('sys_ui_theme');
        var userPref = new GlideRecord('sys_user_preference');

        if (themeRec.get('name', theme)) {

            userPref.addQuery('name', 'glide.css.theme.ui16');
            userPref.query();

            while (userPref.next()) {

                userPref.value.setValue(themeRec.sys_id);
                userPref.update();

            }

        }

    } catch (e) {
        error('Error forcing theme: ' + e);
    }
}

function info( /* String */ msg) {

    var infoPrefix = '>>>INFO: PostClone: ';

    gs.info(infoPrefix + msg);

}

function debug( /* String */ msg) {

    var debug = gs.getProperty('debug.URMTaskInactivity') == 'true';
    var debugPrefix = '>>>DEBUG: PostClone: ';

    if (debug) {
        gs.debug(debugPrefix + msg);
    }

}

function error( /* String */ msg) {

    var errorPrefix = '>>>ERROR: PostClone: ';

    gs.error(errorPrefix + msg);

}
