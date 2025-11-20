import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrMobile, password } = body;

    if (!emailOrMobile || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await prisma.signUp.findFirst({
      where: {
        OR: [
          { emailId: emailOrMobile },
          { mobileNumber: emailOrMobile }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Account does not exist." },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "success", userId: user.id },
      { status: 200 }
    );

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}