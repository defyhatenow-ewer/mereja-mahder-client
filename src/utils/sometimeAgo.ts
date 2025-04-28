const sometimeAgo = (timestamp: string) => {
  const previous = new Date(timestamp);

  const secondsElapsed = Math.floor((Date.now() - previous.getTime()) / 1000);

  if (secondsElapsed < 60) return `${secondsElapsed} Sec ago`;

  const minutesElapsed = Math.floor(secondsElapsed / 60);

  if (minutesElapsed < 60) return `${minutesElapsed} Min ago`;

  const hoursElapsed = Math.floor(minutesElapsed / 60);

  if (hoursElapsed < 24) return `${hoursElapsed} Hrs ago`;

  const daysElapsed = Math.floor(hoursElapsed / 24);

  return `${daysElapsed} Days ago`;
};

export default sometimeAgo;
