export function toJakartaInputValue(isoString) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  const jakartaString = date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
  });
  const jakartaDate = new Date(jakartaString);

  const pad = (value) => String(value).padStart(2, '0');
  const year = jakartaDate.getFullYear();
  const month = pad(jakartaDate.getMonth() + 1);
  const day = pad(jakartaDate.getDate());
  const hours = pad(jakartaDate.getHours());
  const minutes = pad(jakartaDate.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromJakartaInputValue(value) {
  if (!value) {
    return null;
  }
  const [date, time] = value.split('T');
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const withOffset = `${date}T${normalizedTime}+07:00`;
  return new Date(withOffset).toISOString();
}

export function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
