export default function (date) {
  let dateDiff = 0;
  const today = new Date();
  const givenDate = new Date(date);
  // if month is same
  if (givenDate.getMonth() === today.getMonth()) {
    dateDiff = givenDate.getDate() - today.getDate();
    if (dateDiff === 0) return "Today";
    return new Intl.RelativeTimeFormat("en-us")?.format(dateDiff, "days");
  } else {
    return givenDate.toDateString();
  }
}
