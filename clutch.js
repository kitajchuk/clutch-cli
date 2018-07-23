#!/usr/bin/env node



const cli = require( "cli" );
const fs = require( "fs" );
const path = require( "path" );
const json = JSON.parse( String( fs.readFileSync( path.join( __dirname, "package.json" ) ) ) );
const lager = require( "properjs-lager" );



cli.setApp( "clutch", json.version );



cli.parse( {
    src: ["s", "Which app source?", "string", "main" ]

}, ["init", "start", "source", "version"] );



if ( cli.command === "version" ) {
    lager.info( `Clutch CLI version ${json.version}.` );
    process.exit();

} else if ( cli.command === "init" ) {
    require( "./clutch.init" )();

} else if ( cli.command === "start" ) {
    require( "./clutch.start" )();

} else if ( cli.command === "source" ) {
    require( "./properjs.install" )( cli.options.src );
}
