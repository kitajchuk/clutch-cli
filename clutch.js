#!/usr/bin/env node



const cli = require( "cli" );



cli.setApp( "clutch", "0.1.0" );



cli.parse( null, ["init", "start"] );



if ( cli.command === "init" ) {
    require( "./clutch-init" )();

} else if ( cli.command === "start" ) {
    require( "./clutch-start" )();
}
