import moment from 'moment';

const toUTC = (date: Date): Date => moment.utc(date).toDate();

const getNowUTC = (): Date => toUTC(new Date());

const calculateDifferenceInMilliseconds = (endDate: Date, startDate: Date): number => moment(endDate).diff(startDate);

const calculateSecondsFromMilliseconds = (milliseconds: number): number => Math.round(milliseconds / 1000);

export { toUTC, getNowUTC, calculateDifferenceInMilliseconds, calculateSecondsFromMilliseconds };
