const convertHoursIntoMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);

  const totalMinutes = hour * 60 + minute;

  return totalMinutes;
};

export default convertHoursIntoMinutes;
