import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      mobileNumber,
      emailId,
      dateOfBirth,
      gender,
      password
    } = body;

    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !emailId ||
      !dateOfBirth ||
      !gender ||
      !password
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Invalid password format." },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.signUp.findUnique({
      where: { emailId }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    const existingMobile = await prisma.signUp.findUnique({
      where: { mobileNumber }
    });

    if (existingMobile) {
      return NextResponse.json(
        { error: "Mobile number already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.signUp.create({
      data: {
        firstName,
        lastName,
        mobileNumber,
        emailId,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        password: hashedPassword
      }
    });

    return NextResponse.json(
      { message: "success", userId: user.id },
      { status: 201 }
    );

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}