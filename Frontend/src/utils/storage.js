

// ฟังก์ชันสำหรับบันทึก LINE User ID
export const saveLineUserId = (lineUserId) => {
    localStorage.setItem("lineUserId", lineUserId);
  };
  
  // ฟังก์ชันสำหรับดึง LINE User ID
  export const getLineUserId = () => {
    return localStorage.getItem("lineUserId");
  };
  
  // ฟังก์ชันสำหรับลบ LINE User ID
  export const removeLineUserId = () => {
    localStorage.removeItem("lineUserId");
  };
  