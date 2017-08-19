const fs = require( "fs" );
const cli = require( "cli" );
const path = require( "path" );
const lager = require( "properjs-lager" );
const request = require( "request" );
const progress = require( "request-progress" );
const child_process = require( "child_process" );
const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
};
const version = "1.0.0";
const zipFile = path.join( process.cwd(), "clutch.zip" );
const outPath = path.join( process.cwd(), `clutch-${version}` );
const releaseTag = `v${version}`;
const releaseUrl = "https://github.com/kitajchuk/clutch/archive/v1.0.0.zip";
const downloadDelay = 500;



cli.setApp( "clutch", "0.1.0" );



cli.parse( null, ["init"] );



if ( cli.command === "init" ) {
    lager.info( `Clutch: Downloading release ${releaseTag}...` );

    progress( request.get( releaseUrl, { headers } ) )
        .on( "progress", ( state ) => {
            cli.progress( state.percent );
        })
        .on( "error", ( error ) => {
            lager.error( `Clutch: ${error}` );
        })
        .on( "end", () => {
            lager.info( `Clutch: Unpacking release ${releaseTag}...` );

            setTimeout(() => {
                const unzip = child_process.spawn( "unzip", [zipFile] );

                unzip.on( "close", () => {
                    lager.cache( `Clutch: Unpacked release ${releaseTag}!` );

                    lager.info( `Clutch: Moving scaffold files...` );
                        child_process.execSync( `mv ${outPath}/* ${process.cwd()}` );
                        child_process.execSync( `mv ${outPath}/.eslintrc ${process.cwd()}` );
                        child_process.execSync( `mv ${outPath}/.gitignore ${process.cwd()}` );

                    lager.info( `Clutch: Cleaning up temp files...` );
                        child_process.execSync( `rm -rf ${zipFile}` );
                        child_process.execSync( `rm -rf ${outPath}` );
                        child_process.execSync( `rm -rf ${process.cwd()}/package-lock.json` );
                        child_process.execSync( `rm -rf ${process.cwd()}/server/package-lock.json` );

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

                unzip.stdout.on( "data", ( data ) => {
                    lager.info( `Clutch: unzip.stdout: ${data}` );
                });

                unzip.stderr.on( "data", ( data ) => {
                    lager.warn( `Clutch: unzip.stderr: ${data}` );
                });

            }, downloadDelay );
        })
        .pipe( fs.createWriteStream( zipFile ) );
}
