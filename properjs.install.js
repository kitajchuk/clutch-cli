const fs = require( "fs" );
const path = require( "path" );
const lager = require( "properjs-lager" );
const request = require( "request" );
const progress = require( "request-progress" );
const child_process = require( "child_process" );
const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
};



module.exports = ( src ) => {
    const zipFile = path.join( process.cwd(), "properjsapp.zip" );
    const outPath = path.join( process.cwd(), `app-master/${src}` );
    const downPath = path.join( process.cwd(), `app-master` );
    const destPath = path.join( process.cwd(), "source" );
    const releaseUrl = "https://github.com/ProperJS/app/archive/master.zip";
    const downloadDelay = 500;

    lager.info( `ProperJS: Downloading ProperJS/app...` );

    child_process.execSync( `rm -rf ${destPath}` );

    return new Promise(( resolve, reject ) => {
        progress( request.get( releaseUrl, { headers } ) )
            .on( "progress", ( state ) => {
                lager.info( String( state.percent ) );
            })
            .on( "error", ( error ) => {
                lager.error( `ProperJS: ${error}` );
                    reject( error );
            })
            .on( "end", () => {
                lager.info( `ProperJS: Unpacking ProperJS/app...` );

                setTimeout(() => {
                    const unzip = child_process.spawn( "unzip", [zipFile] );

                    unzip.on( "close", () => {
                        lager.cache( `ProperJS: Unpacked ProperJS/app!` );

                        lager.info( `ProperJS: Moving ProperJS/app files...` );
                            child_process.execSync( `mv ${outPath}/source ${destPath}` );

                        lager.info( `ProperJS: Cleaning up temp files...` );
                            child_process.execSync( `rm -rf ${zipFile}` );
                            child_process.execSync( `rm -rf ${outPath}` );
                            child_process.execSync( `rm -rf ${downPath}` );

                        resolve();
                    });

                    unzip.stdout.on( "data", ( data ) => {
                        lager.info( `ProperJS: unzip.stdout: ${data}` );
                    });

                    unzip.stderr.on( "data", ( data ) => {
                        lager.warn( `ProperJS: unzip.stderr: ${data}` );
                    });

                }, downloadDelay );
            })
            .pipe( fs.createWriteStream( zipFile ) );
    });
};
