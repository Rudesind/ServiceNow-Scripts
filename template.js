/**
 * This is a template for how I style script include classes.
 * 
 * Author: Rudesind
 * Updated: 12/20/2021
 */
 
var Template = Class.create(); // Change "Template" to the name of the class. All instances of "Template" should be replaced.

Template.prototype = {
    CLASS_VARIABLE: "Example", // Class variables are declared here. End with comma

    initialize: function () {

        this.debug = gs.getProperty('debug.Template') == 'true'; // Use a custom system property to control debugging for this class
        this.debugPrefix = '>>>DEBUG: Template: '; // Custom debug message. Customize as you desire
        this.errorPrefix = '>>>ERROR: Template: '; // Custom error message. Customize as you desire

    },

    /**
     * Example of "public" method/function declaration.
     * 
     * @param {string} example1 - First variable.
     * @param {integer} example2 - Second variable.
     * @returns {boolean} What this function returns.
     */
    publicMethod: function ( /* String */ example1, /* Integer */ example2) {
      
      return true;

    },

    /**
     * Example of "private" method/function declaration.
     * The underscore does not affect access or visibility. Informational only.
     * 
     * @param {integer} example1 - First variable.
     * @returns {integer} What this function returns.
     */
    _privateMethod: function ( /* Integer */ example1) {

        return 0;

    },

    /**
     * Writes a message to the debug log.
     * 
     * @param {string} msg - Debug message
     */
    _debug: function ( /* String */ msg) {

        if (this.debug) {
            gs.debug(this.debugPrefix + msg);
        }

    },

    /**
     * Writes a message to the error log.
     * 
     * @param {msg} msg - Error message
     */
    _error: function ( /* String */ msg) {

        gs.error(this.errorPrefix + msg);

    },


    type: 'Template'

};
