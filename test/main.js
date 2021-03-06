var cssLintReportPlugin = require('../');
var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var csslint = require('gulp-csslint');
require('mocha');
var getFile = function (filePath) {
    filePath = 'test/' + filePath;
    return new gutil.File({
        path: filePath,
        cwd: 'test/',
        base: path.dirname(filePath),
        contents: fs.readFileSync(filePath)
    });
};
describe('gulp-csslint-report', function () {
    describe('cssLintReportPlugin()', function () {
        it('dummy test', function (done) {
            done();
        });

        it('should pass file through', function (done) {
            var a = 0;
            var file = getFile('fixtures/validCSS.css');
            var stream = cssLintReportPlugin();
            var cl = csslint();

            stream.on('data', function (newFile) {
                should.exist(newFile);
                should.exist(newFile.path);
                should.exist(newFile.relative);
                should.exist(newFile.contents);
                newFile.path.should.equal('test/fixtures/validCSS.css');
                newFile.relative.should.equal('validCSS.css');
                ++a;
            });

            stream.once('end', function () {
                a.should.equal(1);
                done();
            });

            //pass throught csslint first
            cl.write(file);
            cl.end();

            stream.write(file);
            stream.end();
        });

        it('should generate one html report file', function (done) {
            var a = 0;
            var file = getFile('fixtures/validCSS.css');
            var stream = cssLintReportPlugin();
            var cl = csslint();

            stream.on('data', function (newFile) {
                should.exist(newFile);
                should.exist(newFile.path);
                should.exist(newFile.relative);
                should.exist(newFile.contents);
                newFile.path.should.equal('test/fixtures/validCSS.css');
                newFile.relative.should.equal('validCSS.css');
                ++a;
            });

            stream.once('end', function () {
                a.should.equal(1);
                var fname = path.join("logs/", "csslint-report.html");
                should.exist(fs.existsSync(fname));
                var cnt = fs.readFileSync(fname);
                should(cnt.length).not.eql(0);
                var html = cnt.toString();
                should(html.indexOf('validCSS.css')).not.eql(-1);
                done();
            });

            //pass throught csslint first
            cl.write(file);
            cl.end();

            stream.write(file);
            stream.end();
        });
    });
});