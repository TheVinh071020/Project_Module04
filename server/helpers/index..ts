function fromDateToString(date :any) /* : String*/ {
  date = new Date(+date);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
  let dateAsString = date.toISOString().substr(0, 19);
  return dateAsString;
}

export const getDate = () => {
  return fromDateToString(new Date()).slice(0, 19).replace("T", " ");
};
