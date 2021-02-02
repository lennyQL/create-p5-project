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

import { unlinkSync, readdirSync, readFileSync, writeFileSync, mkdir as _mkdir } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// import path from 'path';
import request from 'sync-request';
// const download = require('download');

/**
 * !ToDo
 * createInterfaceすると，
 * どんな時でも最後にprocess.exit()しないと
 * プロセスから抜けられなくなる．
 * かといってreturnのかわりにexitすると，
 * 非同期処理でreadlineの先に処理が終わってしまう
 * もうわからん
 */
// import readline from 'readline'
// const rl = readline.createInterface(process.stdin,process.stdout);

// Path where this file exists.
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
		return;
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
	},


	/**
	 * 自作モジュール(script)のインポート
	 * index.htmlに<script>をリンクしてくれる
	 * 
	 * templates/modulesに自作モジュールを追加すれば
	 * いつでも使いまわせる
	 */
	addModule: function(mod, opt) {
		const script = mod;
		const script_tag = '<script src="' + script + '"></script>'
		
		// load file
		let indexhtml;
		if(searchFiles('index.html')) {
			indexhtml = loadProjectFile('index.html');
		} else {
			console.log("\x1b[33mWarning\x1b[0m : index.html does not exist. You cannot run this command here.");
			return;
		}
		
		// 例外処理
		// htmlにスクリプトがすでにリンクされているとき
		if(indexhtml.search(script_tag) !== -1) {
			console.log("\x1b[33mWarning\x1b[0m : " + script + " is already linked.");
			return;
		}
		// オプションのとき，テンプレートからファイルを導入
		else if(opt.template) {
			if(searchFiles(script, __dirname+'/templates/modules')) {
				const path = 'templates/modules/' + script;
				const modu = loadFile(path);
				write(script, modu);
				link(indexhtml, script);
				return;
			}
			console.log("\x1b[33mWarning\x1b[0m : " + script + " dose not exist.");
			return
		}
		// スクリプトが現パスに存在しないとき
		else if(!searchFiles(script)) {
			console.log("\x1b[33mWarning\x1b[0m : " + script + " dose not exist.");
			// テンプレートにファイルがあれば，プロジェクトに追加して，リンクを通す
			if(searchFiles(script, __dirname+'/templates/modules')) {
				console.log("You can use " + script + " in templates/modules which create-p5-project has.");
				// 標準入力の同期処理, 難しい，できない
				// process.stdout.write("Do you want to use this module?[y/n] : "); 
				// (async function () {
				// 	await new Promise(res=>rl.once("line",res))
				// 		.then(str => {
				// 			// console.log(str);
				// 			if (str == "y") {
				// 				// console.log("yesyesyes");
				// 				const path = 'templates/modules/' + script;
				// 				const modu = loadFile(path);
				// 				write(script, modu);
				// 				link(indexhtml, script);
				// 			}
				// 			process.exit();
				// 		})
				// })();

			}
			return;
		}

		// console.log(searchFiles(script))
		// console.log(indexhtml.search(script_tag));
		// console.log(script_tag);
		// console.log(indexhtml);

		link(indexhtml, script);
	},


	/**
	 * プロジェクトからファイルを削除して，同時に
	 * index.htmlからscriptのリンクを削除する
	 */
	remove: function(file, opt) {
		// load file
		let indexhtml;
		if(searchFiles('index.html')) {
			indexhtml = loadProjectFile('index.html');
		} else {
			console.log("\x1b[33mWarning\x1b[0m : index.html does not exist.");
			return;
		}

		// remove and unlink file if exits
		if(!searchFiles(file)) {
			console.log("\x1b[33mWarning\x1b[0m : " + file + " dose not exist.");
			return;
		}
		// index.html and scketch.js cannot be removed
		else if(file == 'index.html' || file == 'sketch.js') {
			console.log("\x1b[33mWarning\x1b[0m : " + file + " cannot be removed.");
			return;
		}
		remove(file);
		unlink(indexhtml, file);
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


// original function 

/**
 * load file where this command work
 */
function loadProjectFile(name) {
	const dir = process.cwd();
	return readFileSync(join(dir, name), 'utf-8');
}


/**
 * Search file ?Is file exist?
 * @param {string} name : filename 
 * @return {boolean} true/false
 */
function searchFiles(name, dir = process.cwd()) {
	// const dir = process.cwd();
	// console.log(dir);
	const allDirents = readdirSync(dir, { withFileTypes: true });

	for (const dirent of allDirents) {
		// console.log(dirent.name)
		if(dirent.name == name) {
			return true;
		}
		// console.log(dirent)
	}
	return false;
}


/**
 * link script into index.html (alt ver.)
 * @param {String} mod : script name 
 */
function link(indexhtml, mod) {
	// init tag for replace in html
	const tag = "<!-- {{link-script-start}} -->";
	const script = mod;
	const script_tag = '<script src="' + script + '"></script>';
	const res = tag + "\n" + "\t" + script_tag;
	// link script
	writeFileSync('index.html', indexhtml.replace(tag, res));
	console.log('   \x1b[36mlink\x1b[0m : ' + script);
}


/**
 * unlink script from index.html
 * @param {*} indexhtml 
 * @param {*} script 
 */
function unlink(indexhtml, script) {
	// init tag for replace in html
	const tag = '\n\t<script src="' + script + '"></script>';
	const res = '';
	// link script
	writeFileSync('index.html', indexhtml.replace(tag, res));
	console.log('   \x1b[31munlink\x1b[0m : ' + script);
}


/**
 * remove file from project
 * @param {*} name 
 */
function remove(name) {
	unlinkSync(name);
	console.log('   \x1b[31mremove\x1b[0m : ' + name);
}


export default generator;