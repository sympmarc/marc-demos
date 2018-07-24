"use strict";
//Node v 6.12.0
var gulp = require('gulp');
var cache = require('gulp-cache');
var spsave = require('spsave').spsave;
var map = require('map-stream');
var vfs = require('vinyl-fs');

var settings = require("./settings.json");
var settingsSecurity = require("./settings_security.json");

gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

function makeHashKey(file) {
	return [file.contents.toString('utf8'), file.stat.mtime.toISOString()].join('');
}

gulp.task("copyToSharePointFolder",
  function () {
	  gulp.src(settings.srcFiles, { base: settingsSecurity.rootFolder })
		.pipe(
		  cache(
			map(function(file, cb) {
				spsave({
					  siteUrl: settings.siteCollURL.dev,
					  checkinType: 2,
					  checkin: false
				  },
				  {
					  username: settingsSecurity.username,
					  password: settingsSecurity.pwd
				  },
				  {
					  file: file,
					  folder: settings.destFolder
				  }
				);
				cb(null, file);
			}),
			{
				key: makeHashKey,
				fileCache: new cache.Cache({ cacheDirName: settings.projectname + '-cache' }),
				name: settingsSecurity.username + "." + settings.projectname
			}
		  )
		);
  }
);

gulp.task("copyToSharePointFlat",
  function () {
	  gulp.src(settings.srcFiles, { base: settingsSecurity.rootFolder })
		.pipe(
		  cache(
			map(function(file, cb) {
				var filePath = file.history[0].replace(file.cwd, '.');
				spsave({
					  siteUrl: settings.siteCollURL.dev,
					  checkinType: 2,
					  checkin: false
				  },
				  {
					  username: settingsSecurity.username,
					  password: settingsSecurity.pwd
				  },
				  {
					  glob: filePath,
					  folder: settings.destFolder
				  }
				);
				cb(null, file);
			}),
			{
				key: makeHashKey,
				fileCache: new cache.Cache({ cacheDirName: settings.projectname + '-cache' }),
				name: settingsSecurity.username + "." + settings.projectname
			}
		  )
		);
  }
);

gulp.task("copyToLegacySharePoint", function() {
	gulp.src(settings.srcFiles, { base: settingsSecurity.rootFolder })
	  .pipe(
		cache(
		  map(function(file, cb) {
			  var filePath = file.history[0].replace(file.cwd, '.');
			  console.log('Copying -- ' + file.path);
			  vfs.src([filePath]).pipe(vfs.dest(settings.destFolder));
			  cb(null, file);
		  }),
		  {
			  key: makeHashKey,
			  fileCache: new cache.Cache({ cacheDirName: settings.projectname + '-cache' }),
			  name: settingsSecurity.username + "." + settings.projectname
		  }
		)
	  );
});

gulp.task("watchFlat", function(){
	gulp.watch(settings.srcFiles, ["copyToSharePointFlat"]);
});

gulp.task("watchFolder", function(){
	gulp.watch(settings.srcFiles, ["copyToSharePointFolder"]);
});

gulp.task("watchLegacy", function(){
	gulp.watch(settings.srcFiles, ["copyToLegacySharePoint"]);
});