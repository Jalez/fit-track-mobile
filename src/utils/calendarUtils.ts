export const getDaysInMonth = (date: Date): (Date | null)[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];
  
  // Add empty days for padding
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isSelected = (date: Date, selectedDate: Date): boolean => {
  return date.toDateString() === selectedDate.toDateString();
};

export const getMonthName = (date: Date): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[date.getMonth()];
};

export const getDayHeaders = (): string[] => {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
};

export const changeMonth = (currentDate: Date, direction: 'prev' | 'next'): Date => {
  const newDate = new Date(currentDate);
  if (direction === 'prev') {
    newDate.setMonth(newDate.getMonth() - 1);
  } else {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  return newDate;
}; 