
export function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
