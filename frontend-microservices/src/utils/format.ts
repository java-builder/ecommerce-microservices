/**
 * Utility helper định dạng tiền tệ và hiển thị
 */
export const formatPrice = (price: number | string | undefined | null): string => {
  if (price === undefined || price === null || price === '') return '0 VNĐ';
  const num = typeof price === 'number' ? price : Number(price);
  if (isNaN(num)) return '0 VNĐ';
  return `${num.toLocaleString('vi-VN')} VNĐ`;
};
