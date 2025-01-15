/**
 * Converte um Date String para o formato yyyy-mm-dd
 */
export const convertDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");
  const formattedDate = year + "-" + formattedMonth + "-" + formattedDay;
  return formattedDate;
};

export const convertDateForServer = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

export const convertDateFromServer = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};
