import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

export const purchaseLicense = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "กรุณาระบุ userId" });
    }
  
    try {
      // ตรวจสอบใน prv_Privilege
      let privilege = await prisma.prv_Privilege.findFirst({
        where: { userId },
      });
  
      if (!privilege) {
        // หากไม่พบใน prv_Privilege ให้ตรวจสอบใน prv_Users
        const user = await prisma.prv_Users.findUnique({
          where: { id: userId },
        });
  
        if (!user) {
          return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
        }
  
        // สร้างข้อมูลใหม่ใน prv_Privilege
        privilege = await prisma.prv_Privilege.create({
          data: {
            userId: userId,
            currentAmount: 0,
            totalAmountPerYear: 0,
            prvType: "Silver",
            currentPoint: 0,
            prvLicenseId: null,
            prvExpiredDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        });
      }
  
      if (privilege.prvLicenseId) {
        return res.status(400).json({ error: "ผู้ใช้ได้ซื้อ License ไปแล้ว" });
      }
  
      // ดึงรหัส License ล่าสุด
      const lastLicense = await prisma.prv_Privilege.aggregate({
        _max: { prvLicenseId: true },
      });
  
      const nextLicenseId = lastLicense._max.prvLicenseId !== null
        ? lastLicense._max.prvLicenseId + 1
        : 1;
  
      // อัปเดตข้อมูล Privilege
      const updatedPrivilege = await prisma.prv_Privilege.update({
        where: { id: privilege.id },
        data: {
          prvLicenseId: nextLicenseId,
          prvType: "Diamond",
          prvExpiredDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });
  
      return res.status(200).json({
        message: "ซื้อ License สำเร็จ",
        data: {
          userId,
          prvLicenseId: nextLicenseId,
          licenseType: "Diamond",
          prvExpiredDate: updatedPrivilege.prvExpiredDate,
        },
      });
    } catch (error) {
      console.error("Error purchasing license:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  };
  

export const addExpense = async (req, res) => {
    try {
      const { userId, expenseAmount, transactionDate } = req.body;
  
      if (!userId || !expenseAmount || !transactionDate) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      let privilege = await prisma.prv_Privilege.findFirst({
        where: { userId },
      });
  
      if (!privilege) {
        const user = await prisma.prv_Users.findUnique({ where: { id: userId } });
  
        if (!user) {
          return res.status(404).json({ error: 'User not found in the system.' });
        }
  
        privilege = await prisma.prv_Privilege.create({
          data: {
            user: { connect: { id: userId } },
            currentAmount: 0,
            totalAmountPerYear: 0,
            prvType: 'Silver',
            currentPoint: 0,
            prvLicenseId: null,
            prvExpiredDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        });
      }
  
      // คำนวณ totalAmountPerYear
      const updatedTotalAmountPerYear = privilege.totalAmountPerYear + expenseAmount;
  
      // อัปเดตระดับ (prvType)
      let updatedPrvType = privilege.prvType;
      if (privilege.prvType !== 'Diamond') {
        if (updatedTotalAmountPerYear < 50000) {
          updatedPrvType = 'Silver';
        } else if (updatedTotalAmountPerYear < 100000) {
          updatedPrvType = 'Gold';
        } else {
          updatedPrvType = 'Platinum';
        }
      }
  
      // ตรวจสอบกรณี Diamond (ไม่ลดระดับภายใน 1 ปี)
      if (privilege.prvType === 'Diamond' && privilege.prvExpiredDate) {
        const now = new Date();
        const oneYearLater = new Date(privilege.prvExpiredDate);
        if (now <= oneYearLater) {
          updatedPrvType = 'Diamond';
        }
      }
  
      // คำนวณแต้มใหม่ตามระดับที่อัปเดตแล้ว
      const pointRates = { Diamond: 80, Platinum: 100, Gold: 130, Silver: 150 };
      const rate = pointRates[updatedPrvType] || pointRates['Silver'];
      const totalAmount = privilege.currentAmount + expenseAmount;
      const pointsEarned = Math.floor(totalAmount / rate);
      const remainingAmount = totalAmount % rate;
  
      // บันทึกการใช้จ่าย
      const expense = await prisma.prv_Total_Expense.create({
        data: {
          userId,
          expenseAmount,
          transactionDate: new Date(transactionDate),
          prvType: updatedPrvType,
          expensePoint: pointsEarned,
        },
      });
  
      // อัปเดต privilege
      const updatedPrivilege = await prisma.prv_Privilege.update({
        where: { id: privilege.id },
        data: {
          currentAmount: remainingAmount,
          totalAmountPerYear: updatedTotalAmountPerYear,
          prvType: updatedPrvType,
          currentPoint: privilege.currentPoint + pointsEarned,
        },
      });
  
      res.json({
        message: 'Expense added successfully!',
        expense,
        privilege: updatedPrivilege,
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
export const deleteExpenseWithTransaction = async (req, res) => {
    try {
      const { expenseId } = req.body;
  
      const expense = await prisma.$transaction(async (prisma) => {
        const expense = await prisma.prv_Total_Expense.findUnique({
          where: { id: expenseId },
        });
  
        if (!expense) {
          throw new Error('Expense not found.');
        }
  
        const privilege = await prisma.prv_Privilege.findFirst({
          where: { userId: expense.userId },
        });
  
        if (!privilege) {
          throw new Error('Privilege not found.');
        }
  
        const updatedTotalAmountPerYear = privilege.totalAmountPerYear - expense.expenseAmount;
        const updatedCurrentAmount = privilege.currentAmount - (expense.expenseAmount % 150);
        const updatedPoints = privilege.currentPoint - expense.expensePoint;
  
        await prisma.prv_Privilege.update({
          where: { id: privilege.id },
          data: {
            totalAmountPerYear: updatedTotalAmountPerYear,
            currentAmount: Math.max(updatedCurrentAmount, 0),
            currentPoint: Math.max(updatedPoints, 0),
          },
        });
  
        await prisma.prv_Total_Expense.delete({
          where: { id: expenseId },
        });
  
        return expense;
      });
  
      res.json({ message: 'Expense deleted successfully.', expense });
    } catch (error) {
      console.error('Error in transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
export const addProducts = async (req, res) => {
    try {
      const { products } = req.body;
  
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Products must be an array.' });
      }
  
      const createdProducts = await prisma.prv_Product.createMany({
        data: products,
        skipDuplicates: true, // ข้ามรายการซ้ำ
      });
  
      res.status(201).json({
        message: 'Products added successfully!',
        createdCount: createdProducts.count,
      });
    } catch (error) {
      console.error('Error adding products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required.' });
      }
  
      // ตรวจสอบว่าสินค้ามีอยู่หรือไม่
      const existingProduct = await prisma.prv_Product.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // ลบสินค้า
      await prisma.prv_Product.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({
        message: 'Product deleted successfully!',
        productId: id,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  
  
  
  
  
  
 


