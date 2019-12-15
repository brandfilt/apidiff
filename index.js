#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const rp = require('request-promise-native');

const program = require('commander');
const jsondiffpatch = require('jsondiffpatch')

async function diff(url1, url2) {
    try {
        const result1 = await rp(url1);
        const result2 = await rp(url2);

        const jsonDiff = jsondiffpatch.diff(JSON.parse(result1), JSON.parse(result2));
        jsondiffpatch.console.log(jsonDiff);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

program
    .version('0.0.1')
    .usage('[options] url url')
    .option('-i, --interval <time>', `polling interval`)
    .action((env) => {
        const interval = parseInt(env.interval) || 1000;
        if (env.args.length !== 2) {
            console.log('Invalid arguments, see --help');
            return;
        }

        setInterval(() => {
            diff(env.args[0], env.args[1]);
        }, interval);
    })
    .parse(process.argv);
