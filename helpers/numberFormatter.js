export default function (number) {
  if (number.includes("-")) {
    return number;
  }
  const cleanNumber = number.toString().replaceAll(",", "");
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 2,
  }).format(cleanNumber);
}
