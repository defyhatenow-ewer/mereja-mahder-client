const formatDateTime = (timestamp?: string): string => {
  const now = new Date();
  let date = now;
  if (timestamp) date = new Date(timestamp);
  const months = date.getMonth();
  const days = date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const MM = monthNames[months];
  const DD = days < 10 ? `0${days}` : days;
  const YYYY = date.getFullYear();
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM} ${DD}, ${YYYY}`;
};

export default formatDateTime;
