#!/usr/bin/env node



const cli = require( "cli" );
const fs = require( "fs" );
const path = require( "path" );
const json = JSON.parse( String( fs.readFileSync( path.join( __dirname, "package.json" ) ) ) );



cli.setApp( "clutch", json.version );



cli.parse( null, ["init", "start", "version"] );



if ( cli.command === "version" ) {
    console.log( `Clutch CLI version ${json.version}.` );
    process.exit();

} else if ( cli.command === "init" ) {
    require( "./clutch-init" )();

} else if ( cli.command === "start" ) {
    require( "./clutch-start" )();
}
