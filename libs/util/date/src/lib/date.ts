import moment from 'moment';

export function isValidCollectionDate(day: string, month: string, year: string) {
    const today = moment();
    const collectionDate = moment(`${day}-${month}-${year}`, 'DD-MM-YYYY');
  
    if (!collectionDate.isValid()) {
      return false;
    }
  
    let workingDaysCount = 0;
    const currentDate = today.clone();
  
    while (currentDate.isBefore(collectionDate)) {
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        workingDaysCount++;
      }
      currentDate.add(1, 'days');
    }
    if (workingDaysCount > 3) {
      return true;
    } else {
      return false;
    }
  }
