import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { BaseError } from "../utils/error-handler/base_error";
import { RegisterDto } from "../dto/auth.dto";
import { UsersListResponseDto } from "../dto/user.dto";

export const createUser = async (data: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    throw BaseError.BadRequest("User already exists with this email!");
  }

  const hash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hash,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    }
  });

  return user;
}

export const findById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const getUsers = async (page: number, limit: number): Promise<UsersListResponseDto> => {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ]);

  return { users, totalCount };
};

export const blockUser = (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findActiveUserById = async (id: string) => {
  const user = await findById(id);

  if (!user || !user.isActive) {
    return null;
  }

  return user;
};
