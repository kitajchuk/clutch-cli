const path = require( "path" );
const lager = require( "properjs-lager" );
const child_process = require( "child_process" );



module.exports = () => {
    lager.server( `Clutch: Starting server...` );

    const node = child_process.spawn( "npm", [
        "start"
    ]);

    node.on( "close", () => {
        lager.server( `Clutch: Stopped server!` );
    });

    node.stdout.on( "data", ( data ) => {
        console.log( `${data}` );
    });

    node.stderr.on( "data", ( data ) => {
        console.log( `${data}` );
    });
};
