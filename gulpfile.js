const path = require('path');
const { src, dest, series, task } = require('gulp');
const merge = require('merge-stream');

/**
 * Copy node & credential icons (svg/png) into dist/
 * Required for n8n light/dark theme icons to work
 */
function copyIcons() {
	const nodeIcons = src(path.resolve('nodes', '**', '*.{svg,png}'), { allowEmpty: true }).pipe(
		dest(path.resolve('dist', 'nodes')),
	);

	const credentialIcons = src(path.resolve('credentials', '**', '*.{svg,png}'), {
		allowEmpty: true,
	}).pipe(dest(path.resolve('dist', 'credentials')));

	return merge(nodeIcons, credentialIcons);
}

task('build:icons', copyIcons);

module.exports = {
	copyIcons,
	build: series(copyIcons),
};
