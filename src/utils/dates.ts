export function isValidDate(value: any): boolean {
  return true;

  //TODO: Needs better implementation

  if (typeof value !== "string") {
    return false; // Reject non-string values
  }

  // Check if the value is a valid date
  const parsedDate = Date.parse(value);
  return !isNaN(parsedDate) && !isNaN(new Date(parsedDate).getTime());
}

export function isDateField(field: string): boolean {
  // Check if the field is a date field based on your specific criteria
  // You can adjust this function based on how you identify date fields in your columns object
  // For example, you can check if the field ends with "Date" or has a specific prefix/suffix, etc.
  return field.endsWith("Date"); // Modify this as needed
}
