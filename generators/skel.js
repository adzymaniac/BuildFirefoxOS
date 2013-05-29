var mkdir = require('mkdirp'),
	slug = require('slug'),
	fs = require('fs-extra');

/* Create app directory skeleton
 *	path: String of build path
 *	name: String of application name
 * Results
 *	error
 *	path: String of app directory path
 */
var base = function(path, name, callback){
	name = slug(name);
	path = path + '/' + name;
	mkdir(path, 0755, function(error){
		if(error) return callback(error);
		mkdir(path + '/assets', 0755, function(error){
			if(error) return callback(error);
			mkdir(path + '/assets/javascripts', 0755, function(error){
				if(error) return callback(error);
				mkdir(path + '/assets/images', 0755, function(error){
					if(error) return callback(error);
					mkdir(path + '/assets/stylesheets', 0755, function(error){
						if(error) return callback(error);
						return callback(error, path);
					});
				});
			});
		});
	});
}
exports.base = base;

/* Copy building-blocks stylesheets
 *	path: string of app directory path
 *	options: array of [style, style_unstable, icons]
 * Results
 * 	error
 *	results: Array of stylesheet fullpath
 */
var stylesheets = function(path, options, callback){
	if(typeof(callback) === 'undefined'){
		callback = options;
		options = ['style'];
	}

	path = path + '/assets/stylesheets';
	var results = [];
		var pending = options.length;
 		if(!pending) return callback(null, results);

		options.forEach(function(option){
			switch (option) {
				case 'style_unstable':
					fs.copy('./building-blocks/style_unstable', path + '/style_unstable', function(error){
						if(error) return callback(error);
						var styleUnstableFile = './building-blocks/style_unstable.css';
						fs.copy(styleUnstableFile, path + '/style_unstable.css', function(error){
							if(error) return callback(error);
							results.push(styleUnstableFile);
							if(!--pending) callback(null, results);
						});
					});
					break;
				case 'icons':
					fs.copy('./building-blocks/icons', path + '/icons', function(error){
						if(error) return callback(error);
						var styleIconsFile = './building-blocks/style_icons.css';
						fs.copy(styleIconsFile, path + '/style_icons.css', function(error){
							if(error) return callback(error);
							results.push(styleIconsFile);
							if(!--pending) callback(null, results);
						});
					});
					break;
				default:
					fs.copy('./building-blocks/style', path + '/style', function(error){
						if(error) return callback(error);
						var styleFile = './building-blocks/style.css';
						fs.copy(styleFile, path + '/style.css', function(error){
							if(error) return callback(error);
							results.push(styleFile);
							if(!--pending) callback(null, results);
						});
					});
			}
		});
}
exports.stylesheets = stylesheets;