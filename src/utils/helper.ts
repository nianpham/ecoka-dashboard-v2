const formatVND = (money: string) => {
  const number = Number(money);
  if (isNaN(number)) {
    return "Invalid number";
  }
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const sanitizeContent = (html: string) => {
  return html.replace(/<img[^>]*>/g, "");
};

const renderCategory = (category: string) => {
  let result = "";
  switch (category) {
    case "kitchen":
      result = "Nhà bếp";
      break;
    case "pet-house":
      result = "Nhà thú cưng";
      break;
    case "fashion":
      result = "Thời trang";
      break;
    case "home-decor":
      result = "Trang trí nhà cửa";
      break;
    default:
      break;
  }
  return result;
};

const truncateText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

export const HELPER = {
  formatVND,
  renderCategory,
  formatDate,
  truncateText,
  sanitizeContent,
};
