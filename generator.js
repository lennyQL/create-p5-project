#!/usr/bin/env node
/**
 * p5-manager(npm cli command) を参考にした．
 * 
 * CDNjs から p5js を取得する p5 project 
 * テンプレート生成コマンドである．
 * 
 * templates/index.html にあるp5jsへのcdnリンクは
 * 逐次versionの更新を確認すること
 */

// "use strict";

import { readFileSync, writeFileSync, mkdir as _mkdir } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// import path from 'path';
import request from 'sync-request';
// const download = require('download');


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * テンプレートファイルの読み込み
 */
const templates = {
	sketchjs: loadFile('templates/sketch.js'),
	indexhtml: loadFile('templates/index.html'),
}

/**
 * プロジェクト生成とかいろいろにかんするクラス
 */
const generator = {
	/**
	 * プロジェクト生成(フォルダとテンプレートファイル)
	 */
    project: function(project, opt) {
		const obj = this.getlib();
		templates.indexhtml = templates.indexhtml.replace('{{project-title}}', project);
		templates.indexhtml = templates.indexhtml.replaceAll('{{library-version}}', obj.tag_name);	
		mkdir(project, () => {
		    write(project + '/sketch.js', templates.sketchjs);
		    write(project + '/index.html', templates.indexhtml);
		});
		// console.log(templates.indexhtml)
	},
	

	/**
	 * p5jsのライブラリのversion確認
	 */
	version: function() {
		const obj = this.getlib();
		console.log('The latest p5.js release is version ' + obj.tag_name);
	},


	/**
	 * 最新p5jsの情報を取得
	 */
	getlib: function() {
		const option = {
			url: 'https://api.github.com/repos/processing/p5.js/releases/latest',
			headers: {
				'User-Agent': 'p5.js'
			}
		};
		const res = request('GET', option.url, option);
		return JSON.parse(res.getBody('utf8'));
	}
}

// console.log(generator.version())



// the following code are taken from https://github.com/expressjs/generator

function loadFile(name) {
	return readFileSync(join(__dirname, name), 'utf-8');
}

function write(path, str, mode) {
	writeFileSync(path, str, {
		mode: mode || 0o666
	});
	console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

function mkdir(path, fn) {
	_mkdir(path, 0o755, function(err) {
		if (err) throw err;
		console.log('   \x1b[36mcreate\x1b[0m : ' + path);
		fn && fn();
	});
}

export default generator;