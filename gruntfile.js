module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            all: {
                src: ['dist']
            },
            tmp: {
                src: ['dist/assets/js/script.js', 'dist/assets/css/style.css']
            }
        },
        "file-creator": {
            dev: {
                "dist/robots.txt": function(fs, fd, done) {
                    fs.writeSync(fd, 'User-agent: *\n' +
                        'Disallow: /');
                    done();
                }
            },
            prod: {
                "dist/robots.txt": function(fs, fd, done) {
                    fs.writeSync(fd, 'User-agent: *\n' +
                        'Allow: /');
                    done();
                }
            }
        },
        copy: {
            files: {
                expand: true,
                cwd: 'src',
                src: ['browserconfig.xml', 'favicon.ico'],
                dest: 'dist',
                filter: 'isFile'
            },
            fonts: {
                expand: true,
                cwd: 'src/assets/fonts',
                src: ['**'],
                dest: 'dist/assets/fonts',
            },
            favicon: {
                expand: true,
                cwd: 'src/assets/favicon',
                src: ['**'],
                dest: 'dist/assets/favicon',
            },
            img: {
                expand: true,
                cwd: 'src/assets/img',
                src: ['**'],
                dest: 'dist/assets/img',
            },
            svg: {
                expand: true,
                cwd: 'src/assets/svg',
                src: ['**'],
                dest: 'dist/assets/svg',
            },
            json: {
                expand: true,
                cwd: 'src/assets/json',
                src: ['**'],
                dest: 'dist/assets/json',
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/assets/js/script.js': ['src/assets/js/script.js']
                }
            }
        },
        cssmin: {
            default: {
                files: {
                    'dist/assets/css/style.css': ['src/assets/css/style.css']
                }
            }
        },
        htmlmin: {
            default: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: 'index.html',
                        dest: 'dist/'
                    }
                ]
            }
        },
        cacheBust: {
            css: {
                options: {
                    outputDir: 'dist/assets/css',
                    assets: ['dist/assets/css/style.css']
                },
                src: ['dist/index.html']
            },
            js: {
                options: {
                    outputDir: 'dist/assets/js',
                    assets: ['dist/assets/js/script.js']
                },
                src: ['dist/index.html']
            }
        }
    });

    grunt.registerTask('default', ['clean:all', 'copy:fonts', 'copy:img', 'copy:svg', 'copy:favicon', 'copy:files', 'copy:json', 'file-creator:prod', 'uglify:js', 'cssmin:default', 'htmlmin:default', 'cacheBust:js', 'cacheBust:css', 'clean:tmp']);
    grunt.registerTask('dev', ['clean:all', 'copy:fonts', 'copy:img', 'copy:svg', 'copy:favicon', 'copy:files', 'copy:json', 'file-creator:dev', 'uglify:js', 'cssmin:default', 'htmlmin:default', 'cacheBust:js', 'cacheBust:css', 'clean:tmp']);
};