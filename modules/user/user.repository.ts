import { prisma } from "@/lib/prisma";

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      jobTitle: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      jobTitle: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      jobTitle: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string }>
) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      jobTitle: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      company: true,
      jobTitle: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const updateUserResetToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  return prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expires },
  });
};

export const findUserByResetToken = async (token: string) => {
  return prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });
};

export const updateUserPassword = async (
  id: string,
  hashedPassword: string
) => {
  return prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

export const createVerificationToken = async (
  userId: string,
  token: string,
  expires: Date
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { verificationToken: token, verificationTokenExpiry: expires },
  });
};

export const findUserByVerificationToken = async (token: string) => {
  return prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiry: { gte: new Date() },
    },
  });
};

export const markEmailAsVerified = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });
};