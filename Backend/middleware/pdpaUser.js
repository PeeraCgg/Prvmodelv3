import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

export const pdpaAccess = async (req, res) => {
    const { lineUserId,checkbox1, checkbox2 } = req.body;
    console.log("Received data:", {lineUserId, checkbox1, checkbox2 });
  
    try {
      // ตรวจสอบว่า  lineuserid ถูกส่งมาไหม
      if (!lineUserId) {
        return res.status(400).json({ success: false, message: 'lineUserId is required' });
      }
  
     // ค้นหาผู้ใช้ในตาราง Prv_Users ด้วย lineUserId
     const user = await prisma.prv_Users.findUnique({
      where: {lineUserId },
      });
      console.log("User found:", user); // ตรวจสอบว่าพบผู้ใช้หรือไม่
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

         // ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลพื้นฐานในตาราง `Prv_Users` แล้ว
    if (!user.firstname || !user.lastname || !user.mobile || !user.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'User must complete basic information before providing PDPA consent' 
      });
    }
  
      // Upsert ข้อมูล PDPA ในตาราง Prv_Pdpa
      const pdpa = await prisma.prv_Pdpa.upsert({
        where: { userId: user.id }, // ค้นหาด้วย userId
        update: {
          checkbox1,
          checkbox2,
        },
        create: {
          userId: user.id,
          checkbox1,
          checkbox2,
        },
      });
      console.log("Consent saved successfully:", pdpa); // ตรวจสอบว่าบันทึกข้อมูลสำเร็จหรือไม่
       
       // อัปเดตสถานะในตาราง Prv_Status เป็น 2
    await prisma.prv_Status.upsert({
      where: { userId: user.id },
      update: { status: 2 },
      create: { userId: user.id, status: 2 },
    });
    console.log("User status updated to 2");
     res.status(201).json({
        success: true,
        message: 'Consent saved successfully!',
        userId: user.id,
        pdpa,
      });
    } catch (error) {
      console.error('Error saving consent:', error); // แสดงข้อผิดพลาดโดยละเอียด
      res.status(500).json({
        success: false,
        message: 'Failed to save consent. Please try again.',
      });
    }
  };


export const pdpaShow = async (req, res) => {
    const { lineUserId } = req.query; // ดึง lineUserId จาก query
  
    try {
      if (!lineUserId) {
        return res.status(400).json({ success: false, message: "Line User ID is required" });
      }
  
      // ค้นหาผู้ใช้ใน Prv_Users
      const user = await prisma.prv_Users.findUnique({
        where: { lineUserId },
        select: { id: true }, // ดึงเฉพาะ id
      });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // ตรวจสอบว่ามีข้อมูลใน Prv_Pdpa หรือไม่
      let pdpa = await prisma.prv_Pdpa.findUnique({
        where: { userId: user.id },
      });
  
      // หากไม่มีข้อมูล PDPA ให้สร้างข้อมูลใหม่
      if (!pdpa) {
        pdpa = await prisma.prv_Pdpa.create({
          data: {
            userId: user.id,
            checkbox1: false, // ค่าเริ่มต้น
            checkbox2: false, // ค่าเริ่มต้น
          },
        });
      }
  
      res.status(200).json({
        success: true,
        message: "PDPA record retrieved successfully",
        pdpa,
      });
    } catch (error) {
      console.error("Error retrieving PDPA record:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve PDPA record. Please try again.",
      });
    }
  };
  
  
  