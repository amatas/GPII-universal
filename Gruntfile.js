/*!
GPII Universal project Gruntfile

Copyright 2014 RTF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            src: ["gpii/**/*.js", "tests/**/*.js", "examples/**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            src: ["gpii/**/*.json", "tests/**/*.json", "testData/**/*.json"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-gpii");

    var YAML = require('yamljs');
	var path = require('path');
	var fs   = require('fs');
 
    grunt.registerTask('buildenv', 'Spin up testing environment', function (environment_name) {
		var next = this.async();
 	 	if (arguments.length < 1 ) {
			grunt.fail.warn("One argument is needed, for example:" +
							"grunt buildenv:default");
        } else {
             grunt.util.spawn({
                cmd: 'vagrant',
                args: [
                    'up'
                ],
                env: grunt.util._.extend({}, process.env, {
                    VAGRANT_ENV: environment_name
                }),
                opts: {
                    stdio: 'inherit'
                }
            }, function (error, result, code){

				if (result.stdout) grunt.verbose.ok(result.stdout);
            	if (result.stderr) grunt.log.error(result.stderr);
            
				if (error) {
					return next(false);    
				} else {
					return next();
				}

                if (code != 0)
                    grunt.fail.warn("Something went wrong with up or provision");

                grunt.log.ok("VM environment is running");
            }); 
		}
    });
    grunt.registerTask('destroyenv', 'Destroys the testing environment', 
						function (environment_name) {
		var next = this.async();
  	 	if (arguments.length < 1 ) {
			grunt.fail.warn("One argument is needed, for example:"
							+ "grunt destroyenv:default");
        } else {
             grunt.util.spawn({
                cmd: 'vagrant',
                args: [
                    'destroy',
					'-f'
                ],
                env: grunt.util._.extend({}, process.env, {
                    VAGRANT_ENV: environment_name
                }),
                opts: {
                    stdio: 'inherit'
                }
            }, function (error, result, code){

				if (result.stdout) grunt.verbose.ok(result.stdout);
            	if (result.stderr) grunt.log.error(result.stderr);
            
				if (error) {
					return next(false);    
				} else {
					return next();
				}

                if (code != 0)
                    grunt.fail.warn("Something went wrong with the destroy");

                grunt.log.ok("VM environment destroyed");
            }); 
		} 
    });
    grunt.registerTask('test', 'Run some tests', 
						function (environment_name, tests) {
        
		var next = this.async();
        var environment_file = "vagrant-envs" + path.sep + environment_name;
        var environment;
        var testvm;

        try {
            fs.accessSync(environment_file + ".json", fs.R_OK);
            environment = JSON.parse(environment_file + ".json")
        }
        catch (err) {
            try {
                fs.accessSync(environment_file + ".yml", fs.R_OK);
                environment = YAML.load(environment_file + ".yml"); 
            }catch (err){
                grunt.log.writeln(err);
                grunt.fail.warn("Environment file not found: " + 
					environment_file);
            }
        }

        for (var vm in environment['vms']){
           if (environment['vms'][vm].tests_here)
               testvm = vm;
        }

        if (arguments.length < 2) {
			grunt.fail.warn("Two arguments are needed, for example:" +
							"grunt test:default:all-tests");
        } else {
            grunt.util.spawn({
                cmd: 'vagrant',
                args: [
                    'ssh',
                    testvm,
                    '-c',
                    'cd /home/vagrant/sync/node_modules/universal && ' +
                        'DISPLAY=:0 node tests/' + tests + '.js'
                ],
                env: grunt.util._.extend({}, process.env, {
                    VAGRANT_ENV: environment_name
                }),
                opts: {
                    stdio: 'inherit'
                }
            }, function (error, result, code){

				if (result.stdout) grunt.verbose.ok(result.stdout);
            	if (result.stderr) grunt.log.error(result.stderr);
            
				if (error) {
					return next(false);    
				} else {
					return next();
				}

                if (code != 0)
                    grunt.fail.warn("Something went wrong")

                grunt.log.ok("Tests finished")
            });
        }
    });
};
