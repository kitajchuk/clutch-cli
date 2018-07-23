const lager = require( "properjs-lager" );
const child_process = require( "child_process" );
const clutchInstall = require( "./clutch.install" );
const properjsInstall = require( "./properjs.install" );



module.exports = () => {
    clutchInstall().then(() => {
        properjsInstall( "main" ).then(() => {
            lager.info( `Clutch: Bootstrapping project` );
                const node = child_process.spawn( "npm", [
                    "run",
                    "bootstrap"
                ]);

                node.on( "close", () => {
                    lager.cache( `Clutch: Bootstrap complete!` );
                    lager.cache( `Clutch: Run "npm start" to see the demo!` );
                    lager.cache( `Clutch: Checkout https://github.com/kitajchuk/clutch for complete info.` );
                });

                node.stdout.on( "data", ( data ) => {
                    lager.info( `Clutch: bootstrap.stdout: ${data}` );
                });

                node.stderr.on( "data", ( data ) => {
                    lager.warn( `Clutch: bootstrap.stderr: ${data}` );
                });
        });
    });
};
