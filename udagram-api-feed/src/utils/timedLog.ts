import { v4 as uuid } from 'uuid';


const zeroPad = (num: number, places: number): string => String(num).padStart(places, '0');

const formattedDate = (date: Date): string => {
  const DD: string = zeroPad(date.getUTCDay(), 2);
  const MM: string = zeroPad(date.getUTCMonth(), 2);
  const YYYY: string = zeroPad(date.getUTCFullYear(), 4);
  const hh: string = zeroPad(date.getUTCHours(), 2);
  const mm: string = zeroPad(date.getUTCMinutes(), 2);
  const ss: string = zeroPad(date.getUTCSeconds(), 2);
  const sss: string = zeroPad(date.getUTCMilliseconds(), 3);

  return `${DD}/${MM}/${YYYY} ${hh}:${mm}:${ss}.${sss}`;
}

export function timedLog() {
  const pid: string = uuid();

  let startDate: Date;
  let endDate: Date;
  let duration: number;
  let logMsg: string;

  return {
    startLog: function (msg: string) {

      startDate = new Date();
      const startDateStr: string = formattedDate(startDate);

      logMsg = msg;

      console.log(`${startDateStr} - ${pid} - ${logMsg}`);

    },

    endLog: function (addMsg: string) {

      endDate = new Date();
      const endDateStr: string = formattedDate(endDate);

      const took: number = Math.abs(endDate.getTime() - startDate.getTime());

      console.log(`${endDateStr} - ${pid} - ${logMsg} - ${addMsg} - ${took} msec`);

    }
  }
}


// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// const tLog1 = timedLog();    
// tLog1.startLog("Get all feed items");

// sleep(Math.random() * 10000).then(() => {
//   tLog1.endLog(`returned 3`);
// });


// const tLog2 = timedLog();    
// tLog2.startLog("Create feed item");

// sleep(Math.random() * 10000).then(() => {
//   tLog2.endLog(`happy face`);
// });
