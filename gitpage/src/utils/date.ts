export const formatDateToGraphQL = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month > 9 ? month : "0" + String(month + 1)}-${
    day > 9 ? day : "0" + String(day)
  }T${hour > 9 ? hour : "0" + String(hour)}:${
    minute > 9 ? minute : "0" + String(minute)
  }:${second > 9 ? second : "0" + String(second)}`;
};
