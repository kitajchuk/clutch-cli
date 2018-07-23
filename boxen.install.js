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
const releaseTag = `master`;
const zipFile = path.join( process.cwd(), "boxen.zip" );
const outPath = path.join( process.cwd(), `boxen-${releaseTag}` );
const releaseUrl = `https://github.com/kitajchuk/boxen/archive/${releaseTag}.zip`;
const downloadDelay = 500;



module.exports = () => {
    lager.info( `Boxen: Downloading release ${releaseTag}...` );

    return new Promise(( resolve, reject ) => {
        progress( request.get( releaseUrl, { headers } ) )
            .on( "progress", ( state ) => {
                cli.progress( state.percent );
            })
            .on( "error", ( error ) => {
                lager.error( `Boxen: ${error}` );
                    reject( error );
            })
            .on( "end", () => {
                lager.info( `Boxen: Unpacking release ${releaseTag}...` );

                setTimeout(() => {
                    const unzip = child_process.spawn( "unzip", [zipFile] );

                    unzip.on( "close", () => {
                        lager.cache( `Boxen: Unpacked release ${releaseTag}!` );

                        lager.info( `Boxen: Moving scaffold files...` );
                            child_process.execSync( `mv ${outPath}/* ${process.cwd()}` );
                            child_process.execSync( `mv ${outPath}/.eslintrc ${process.cwd()}` );
                            child_process.execSync( `mv ${outPath}/.gitignore ${process.cwd()}` );
                            child_process.execSync( `mv ${outPath}/.npmrc ${process.cwd()}` );

                        lager.info( `Boxen: Cleaning up temp files...` );
                            child_process.execSync( `rm -rf ${zipFile}` );
                            child_process.execSync( `rm -rf ${outPath}` );
                            child_process.execSync( `rm -rf ${process.cwd()}/package-lock.json` );

                            resolve();
                    });

                    unzip.stdout.on( "data", ( data ) => {
                        lager.info( `Boxen: unzip.stdout: ${data}` );
                    });

                    unzip.stderr.on( "data", ( data ) => {
                        lager.warn( `Boxen: unzip.stderr: ${data}` );
                    });

                }, downloadDelay );
            })
            .pipe( fs.createWriteStream( zipFile ) );
    });
};
