import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function parseDobToDate(input: string): Date | null {
  if(!input) return null;

  const parts = input.split("-").map((p) => p.trim());
  let day: number, month: number, year: number;

  if (parts.length === 3 && parts[0].length === 4) {
    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else if (parts.length === 3) {
    day = Number(parts[0]);
    month = Number(parts[1]);
    year = Number(parts[2]);
  } else {
    return null;
  }

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobileNumber, dateOfBirth, newPassword } = body;

    if (!mobileNumber || !dateOfBirth || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const dobDate = parseDobToDate(dateOfBirth);
    if (!dobDate) {
      return NextResponse.json({ error: "Invalid dateOfBirth format" }, { status: 400 });
    }

    const startOfDay = dobDate;
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const user = await prisma.signUp.findFirst({
      where: {
        mobileNumber: mobileNumber,
        dateOfBirth: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.signUp.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password updated" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}