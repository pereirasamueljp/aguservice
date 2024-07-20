import * as moment from 'moment';
export class logger {
    static debug(debugText: string) {
        if (process.env.DEBUG === 'true') console.debug(`DEBUG: ${this.getTimestamp()} | ${debugText}`);
    }
    static info(infoText: string) {
        console.info(`INFO: ${this.getTimestamp()} | ${infoText}`);
    }
    static error(errorText: string) {
        console.info(`ERROR: ${this.getTimestamp()} | ${errorText}`);
    }
    static warn(warnText: string) {
        console.info(`WARN: ${this.getTimestamp()} | ${warnText}`);
    }
    private static getTimestamp() {
        return moment().format('DD/MM/YYYY HH:mm:ss')
    }
}