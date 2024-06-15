class DateService {
    static getCurrentDate(): string {
      const now = new Date();
      return DateService.formatDate(now);
    }
  
    static getNthPreviousDate(n: number): string {
      const now = new Date();
      now.setDate(now.getDate() - n);
      return DateService.formatDate(now);
    }
  
    private static formatDate(date: Date): string {
      const day = DateService.pad(date.getDate());
      const month = DateService.pad(date.getMonth() + 1);
      const year = date.getFullYear();
      const hours = DateService.pad(date.getHours());
      const minutes = DateService.pad(date.getMinutes());
      const seconds = DateService.pad(date.getSeconds());
  
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
    private static pad(num: number): string {
      return num.toString().padStart(2, '0');
    }
  }
  
  export default DateService;
  