const lager = require( "properjs-lager" );
const child_process = require( "child_process" );
const clutchInstall = require( "./clutch.install" );
const boxen = require( "boxen" );
const fs = require( "fs" );
const path = require( "path" );
const json = JSON.parse( String( fs.readFileSync( path.join( __dirname, "package.json" ) ) ) );
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
const installedText = [
    `Clutch Version ${json.version}`,
    `An Open-ended Developer SDK for Prismic.io.`,
    ``,
    `You should now install the node_modules:`,
    `   npm i`,
    ``,
    `Then you can use the SDKs npm commands:`,
    `   npm start`,
    `   etc...`
];
const doInit = ( cli, dir ) => {
    if ( dir && !fs.existsSync( dir ) ) {
        child_process.execSync( `mkdir ${dir}` );
    }

    clutchInstall( cli, dir ).then(() => {
        lager.cache( "Clutch install complete!" );

        console.log( boxen( installedText.join( `\n` ), displayConfig ) );
    });
}



module.exports = ( cli, dir ) => {
    if ( cli.args.length ) {
        const dir = path.join( process.cwd(), cli.args[ 0 ] );

        if ( fs.existsSync( dir ) ) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const lines = [
                `Directory already exists:`,
                `${dir}`,
                ``,
                `Initialize clutch in this directory?`,
                ``,
                `   Type (y)es or (n)o`
            ];
            const question = boxen( lines.join( `\n` ), displayConfig );

            rl.question( question, ( answer ) => {
                answer = answer.toLowerCase();

                if ( answer === "y" || answer === "yes" ) {
                    rl.close();
                    doInit( cli, dir );

                } else if ( answer === "n" || answer === "no" ) {
                    rl.close();
                    process.exit();
                }
            });

        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const lines = [
                `Directory will be created:`,
                `${dir}`,
                ``,
                `Create directory and initialize clutch there?`,
                ``,
                `   Type (y)es or (n)o`
            ];
            const question = boxen( lines.join( `\n` ), displayConfig );

            rl.question( question, ( answer ) => {
                answer = answer.toLowerCase();

                if ( answer === "y" || answer === "yes" ) {
                    rl.close();
                    doInit( cli, dir );

                } else if ( answer === "n" || answer === "no" ) {
                    rl.close();
                    process.exit();
                }
            });
        }

    } else {
        doInit( cli, null );
    }
};
