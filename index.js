#!/usr/bin/env node
const rp = require('request-promise-native');
const _ = require('lodash');

const program = require('commander');
const jsondiffpatch = require('jsondiffpatch')


async function diff(url1, url2) {
    try {
        const result1 = await rp(url1);
        const result2 = await rp(url2);

        return jsondiffpatch.diff(JSON.parse(result1), JSON.parse(result2));
    } catch (error) {
        console.log(error);
    }

    return null;
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

        let previousDiff = null;
        setInterval(async () => {
            const newDiff = await diff(env.args[0], env.args[1]);
            if (!_.isEqual(newDiff, previousDiff)) {
                jsondiffpatch.console.log(newDiff);
                previousDiff = newDiff;
            }

        }, interval);
    })
    .parse(process.argv);
