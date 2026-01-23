const path = require('path');
const { src, dest } = require('gulp');

function copyIcons() {
	return src(
		[path.resolve('nodes', '**', '*.{svg,png}'), path.resolve('credentials', '**', '*.{svg,png}')],
		{ allowEmpty: true },
	).pipe(dest(path.resolve('dist')));
}

exports['build:icons'] = copyIcons;
exports.build = copyIcons;
