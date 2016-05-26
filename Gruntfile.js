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
        },
        run: {
            productionup: {
              	cmd: 'vagrant',
                args: [
                    'up',
                    '--no-provision'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME,
                        VAGRANT_ENV: 'production-tests'
                    }
                }
 			},
			productiontest: {
              	cmd: 'vagrant',
                args: [
                    'provision'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME,
                        VAGRANT_ENV: 'production-tests',
                        TEST_FILE: 'ProductionConfigTests.CI'
                    }
                }
            },
			productionstop: {
              	cmd: 'vagrant',
                args: [
                    'destroy',
                    '-f'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME,
                        VAGRANT_ENV: 'production-tests'
                    }
                }
            },
            vmup: {
              	cmd: 'vagrant',
                args: [
                    'up',
                    '--no-provision'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME
                    }
                }
 			},
			vmtest: {
              	cmd: 'vagrant',
                args: [
                    'provision'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME,
                        TEST_FILE: 'ProductionConfigTests.CI'
                    }
                }
            },
			vmstop: {
              	cmd: 'vagrant',
                args: [
                    'destroy',
                    '-f'
                ],
                options: {
                    env: {
                        HOME: process.env.HOME
                    }
                }
            },
         }

    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-gpii");
    grunt.loadNpmTasks("grunt-run");

    grunt.registerTask("test", "Run the tests of th GPII", function (n){
		if (grunt.option("target")) {
			grunt.task.run('dedupe-infusion','run:vm_tests');
		} else {
            grunt.task.run('dedupe-infusion','run:local_tests');
		}
    });

};
