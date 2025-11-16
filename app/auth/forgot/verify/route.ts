import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { mobileNumber, dateOfBirth } = await req.json();

    if (!mobileNumber || !dateOfBirth) {
      return NextResponse.json(
        { error: "Mobile number and date of birth are required." },
        { status: 400 }
      );
    }

    const user = await prisma.signUp.findFirst({
      where: {
        mobileNumber,
        dateOfBirth
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No matching user found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User verified", userId: user.id },
      { status: 200 }
    );

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}