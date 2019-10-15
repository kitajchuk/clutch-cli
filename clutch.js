#!/usr/bin/env node



const cli = require( "cli" );
const fs = require( "fs" );
const path = require( "path" );
const json = JSON.parse( String( fs.readFileSync( path.join( __dirname, "package.json" ) ) ) );
const lager = require( "properjs-lager" );
const boxen = require( "boxen" );
const clutchInit = require( "./clutch.init" );
const readline = require( "readline" );
const displayConfig = {
    padding: 1,
    margin: {
        top: 0,
        right: 0,
        bottom: 1,
        left: 0
    },
    borderStyle: "double",
    borderColor: "#2AFFEA"
};
const helpText = [
    `Clutch Version ${json.version}`,
    `An Open-ended Developer SDK for Prismic.io.`,
    ``,
    `Usage:`,
    `   clutch init`,
    `   clutch init my-project`,
    ``,
    `Once initialized, use the SDKs npm commands:`,
    `   npm start`,
    `   etc...`
];
const versionText = [
    `Clutch Version ${json.version}`,
    `An Open-ended Developer SDK for Prismic.io.`
];



cli.setApp( "clutch", json.version );
cli.disable( "help" );
cli.disable( "version" );



cli.parse( {}, ["init", "help", "version"] );



if ( cli.command === "help" ) {
    console.log( boxen( helpText.join( `\n` ), displayConfig ) );
    process.exit();

} else if ( cli.command === "version" ) {
    console.log( boxen( versionText.join( `\n` ), displayConfig ) );
    process.exit();

} else if ( cli.command === "init" ) {
    clutchInit( cli );
}
