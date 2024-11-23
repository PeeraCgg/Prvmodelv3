import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'console';

const prisma = new PrismaClient();
const router = express.Router();


export const loginLine = async (req, res ) => {
  const { lineUserId } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่มี lineUserId นี้อยู่แล้วหรือไม่
    let user = await prisma.prv_Users.findUnique({
      where: { lineUserId },
    });

    if (!user) {
      // หากไม่มี ให้สร้างผู้ใช้ใหม่
      user = await prisma.prv_Users.create({
        data: { lineUserId },
      });
    }

    res.status(200).json({ message: "User logged in or created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process login" });
  }
};

export const addOrUpdateUser = async (req, res) => {
  const { firstname, lastname, mobile, birthday, email, lineUserId  } = req.body;

  try {
   // ตรวจสอบว่ามีผู้ใช้ที่มี lineUserId นี้อยู่หรือไม่
   let user = await prisma.prv_Users.findUnique({
    where: { lineUserId },
  });
  if (user) {
    console.log("Data to be updated:", {
      firstname,
      lastname,
      mobile,
      birthday: birthday ? new Date(birthday) : null,
      email,
      lineUserId,
    });

     // ถ้ามีผู้ใช้ที่มี lineUserId นี้อยู่ ให้ทำการอัปเดตข้อมูล
     user = await prisma.prv_Users.update({
      where: { id: user.id },
      data: {
        firstname,
        lastname,
        mobile,
        birthday: birthday ? new Date(birthday) : null,
        email,
      },
    });

      // อัปเดตสถานะใน Prv_Status เป็น 1
      await prisma.prv_Status.upsert({
        where: { userId: user.id },
        update: { status: 1 },
        create: { userId: user.id, status: 1 },
      });

      res.json({ success: true, message: 'User updated successfully', user });
    } else {
      console.log('Data to be created:', {
        firstname,
        lastname,
        mobile,
        birthday: birthday ? new Date(birthday) : null,
        email,
        lineUserId,
      });

      // ถ้าไม่มีผู้ใช้อยู่แล้ว ให้สร้างข้อมูลใหม่
      user = await prisma.prv_Users.create({
        data: {
          firstname,
          lastname,
          mobile,
          birthday: birthday ? new Date(birthday) : null,
          email,
          lineUserId, // บันทึก lineUserId
          isVerified: false, // ค่าเริ่มต้นเป็น false รอการยืนยัน
        },
      });

      // สร้างสถานะใน Prv_Status เป็น 1
      await prisma.prv_Status.create({
        data: {
          userId: user.id,
          status: 1,
        },
      });

      res.json({
        success: true,
        message: 'User added successfully, awaiting email verification',
        user,
      });
    }
  } catch (error) {
    console.error('Error adding/updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUser = async (req, res) => {
    const { lineUserId } = req.body;
  
    try {
      // Find user by   lineUserid ,mobile number or email
      const user = await prisma.prv_Users.findUnique({
        where: {lineUserId},
         select: {
          id: true,
          firstname: true,
          lastname: true,
          mobile: true,
          birthday: true,
          email: true,
          pdpa: true,
          otps: true, // ดึงข้อมูล OTP ที่เกี่ยวข้อง
        },
      });
  
      // Check if user exists and respond accordingly
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      // Log the error and respond with a server error message
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  export const getEditUser = async (req, res) => {
    try {
      const { lineUserId } = req.query; // รับ lineUserId จาก query
  
      if (!lineUserId) {
        return res.status(400).json({ message: "Line User ID is required." });
      }
  
      // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
      const user = await prisma.prv_Users.findUnique({
        where: { lineUserId },
        select: {
          firstname: true,
          lastname: true,
          email: true,
          mobile: true,
          birthday: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const fullname = `${user.firstname} ${user.lastname}`;
  
      return res.status(200).json({
        fullname,
        email: user.email,
        mobile: user.mobile,
        birthday: user.birthday,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  
export const saveEditUser = async (req, res) => {
    try {
      // ดึง lineUserId จาก query
      const { lineUserId } = req.query;
  
      // ตรวจสอบว่ามี lineUserId หรือไม่
      if (!lineUserId) {
        return res.status(400).json({ message: "Line User ID is required." });
      }
  
      // รับข้อมูล fullname และ birthday จาก body
      const { fullname, birthday } = req.body;
  
      // ตรวจสอบว่ามี fullname และ birthday หรือไม่
      if (!fullname || !birthday) {
        return res.status(400).json({
          message: "Both fullname and birthday are required.",
        });
      }
  
      // แยก fullname เป็น firstname และ lastname
      const nameParts = fullname.trim().split(" ");
      if (nameParts.length < 2) {
        return res.status(400).json({
          message: "Fullname must contain at least first and last name.",
        });
      }
  
      // ดึง firstname และ lastname
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ");
  
      // อัปเดตข้อมูลในตาราง prv_users โดยใช้ lineUserId
      const updatedUser = await prisma.prv_Users.update({
        where: { lineUserId },
        data: {
          firstname,
          lastname,
          birthday: new Date(birthday), // แปลง birthday ให้เป็น Date object
        },
      });
  
      // ส่งข้อมูลที่อัปเดตกลับไปยัง frontend
      return res.status(200).json({
        message: "User updated successfully.",
        user: {
          fullname: `${updatedUser.firstname} ${updatedUser.lastname}`,
          birthday: updatedUser.birthday,
        },
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };





  

  
  
  
  
  