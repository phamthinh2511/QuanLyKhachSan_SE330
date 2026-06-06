/**
 * Thư viện kiểm tra dữ liệu đầu vào (Validator Utilities)
 */

/**
 * Kiểm tra chuỗi không trống (không chỉ chứa khoảng trắng)
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return value.trim().length > 0;
}

/**
 * Kiểm tra định dạng Email hợp lệ
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Kiểm tra số điện thoại hợp lệ (chuỗi chữ số có độ dài 9-11 chữ số, có thể bắt đầu bằng +84 hoặc 0)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Kiểm tra số CMND / CCCD hợp lệ (phải là số, gồm 9 hoặc 12 chữ số)
 */
export function isValidIdCard(idCard: string): boolean {
  if (!idCard) return false;
  const idCardRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  return idCardRegex.test(idCard.trim());
}

/**
 * Kiểm tra một số có phải số nguyên dương (>= 1)
 */
export function isPositiveInteger(value: any): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1;
}

/**
 * Kiểm tra một số có phải số không âm (>= 0)
 */
export function isNonNegativeNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Kiểm tra ngày sinh/ngày trong quá khứ so với thời điểm hiện tại
 */
export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  // Lấy thời điểm hiện tại (chỉ lấy ngày/tháng/năm)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

/**
 * Kiểm tra xem ngày sinh có đủ độ tuổi tối thiểu hay không (ví dụ nhân viên đủ 18 tuổi)
 */
export function isAtLeastAge(birthdayStr: string, minAge: number): boolean {
  if (!birthdayStr) return false;
  const birthDate = new Date(birthdayStr);
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= minAge;
}
