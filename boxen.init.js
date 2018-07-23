const lager = require( "properjs-lager" );
const child_process = require( "child_process" );
const boxenInstall = require( "./boxen.install" );
const properjsInstall = require( "./properjs.install" );



module.exports = () => {
    boxenInstall().then(() => {
        properjsInstall( "boxen" ).then(() => {
            lager.info( `Boxen: Bootstrapping project` );
                const node = child_process.spawn( "npm", [
                    "i"
                ]);

                node.on( "close", () => {
                    lager.cache( `Boxen: Bootstrap complete!` );
                    lager.cache( `Boxen: Run "npm start" to see the demo!` );
                    lager.cache( `Boxen: Checkout https://github.com/kitajchuk/boxen for complete info.` );
                });

                node.stdout.on( "data", ( data ) => {
                    lager.info( `Boxen: bootstrap.stdout: ${data}` );
                });

                node.stderr.on( "data", ( data ) => {
                    lager.warn( `Boxen: bootstrap.stderr: ${data}` );
                });
        });
    });
};
