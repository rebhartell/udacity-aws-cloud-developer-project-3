import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * Returns the string representing the given number padded with leading zeros to the requested number of places.
 * @param   num    number to be padded
 * @param   places number of places to pad to
 * @returns the padded number string
 */
const zeroPad = (num: number, places: number): string => String(num).padStart(places, '0');


/**
 * Return the UTC value of the given date formated as 'YYYY-MM-DD hh:mm:ss.sss'.
 * @param   date the date to be formatted
 * @returns      the formatted date
 */
const formattedDate = (date: Date): string => {
  const DD: string = zeroPad(date.getUTCDay(), 2);
  const MM: string = zeroPad(date.getUTCMonth(), 2);
  const YYYY: string = zeroPad(date.getUTCFullYear(), 4);
  const hh: string = zeroPad(date.getUTCHours(), 2);
  const mm: string = zeroPad(date.getUTCMinutes(), 2);
  const ss: string = zeroPad(date.getUTCSeconds(), 2);
  const sss: string = zeroPad(date.getUTCMilliseconds(), 3);

  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}.${sss}`;
}


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function timedLogStart(req: Request, res: Response, next: NextFunction): any {
  const tLog = timedLog();
  tLog.startLog(req);

  // passing variables
  res.locals.tLog = tLog;

  next();
};


/**
 * 
 * @param req 
 * @param res 
 */
export function timedLogEnd(req: Request, res: Response): any {
  // retrieving variables
  const tLog = res.locals.tLog;

  tLog.endLog(req, res);
};


/**
 * 
 * @returns 
 */
function timedLog() {

  const pid: string = uuid();

  const startDate: Date = new Date();;

  const requestLog = (timestamp: Date, req: Request): string => {
    const timestampStr: string = formattedDate(timestamp);
    const method = req.method;
    const url = req.originalUrl;

    return `[${timestampStr}] ${pid} - ${method} - ${url}`;
  };

  const responseLog = (req: Request, res: Response): string => {
    const endDate: Date = new Date();
    const took: number = Math.abs(endDate.getTime() - startDate.getTime());

    return `${requestLog(endDate, req)} - ${res.statusCode} - ${res.statusMessage} - ${took} msec`;
  };

  return {

    startLog: function (req: Request) {
      console.log(requestLog(startDate, req));
    },

    endLog: function (req: Request, res: Response) {
      console.log(`${responseLog(req, res)}`);
    }

  }
}


module.exports = {
  timedLogStart,
  timedLogEnd
}