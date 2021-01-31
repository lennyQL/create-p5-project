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

import generator from './generator.js';
import server from './server.js';
import commander from 'commander';
const { program } = commander;

// console.log('=*=< create p5 project >=*=');

/**
 * コマンド情報登録
 */
program
	// .command('new <collection>')
	.command('new <project>')
	.alias('n')
    // .arguments('<project>')
	.description('Create new p5 project')
	.action((req, opt) => {
		generator.project(req, opt);
	})

/**
 * p5jsのライブラリのversion確認
 */
program
	.command('version')
	.alias('v')
	.description('Show p5js version')
	.action(function(req, res) {
		generator.version();
	})

/**
 * http-serverの立ち上げ
 */
program
	.command('server')
	.alias('s')
	.description('Run run run')
	.option('-p, --port [port]', 'HTTP port to start server')
	.action(function(req) {
		server.run(req.port || 5555);
	})

program
	.parse(process.argv);
