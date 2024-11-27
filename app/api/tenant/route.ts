import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Unsupported Media Type. Expected application/json" },
      { status: 415 }
    );
  }

  const { name, ownerId, description, owner } = await request.json();

  const generateUniqueSlug = async (
    baseSlug: string,
    suffix: number = 0
  ): Promise<string> => {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
    const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
    if (existingTenant) {
      return generateUniqueSlug(baseSlug, suffix + 1);
    }
    return slug;
  };

  const baseSlug = name.toLowerCase().replace(/\s/g, "-");
  const uniqueSlug = await generateUniqueSlug(baseSlug);

  if (!name || !ownerId) {
    return NextResponse.json(
      { error: "Name and ownerId are required" },
      { status: 400 }
    );
  }

  try {
    const newTenant = await prisma.tenant.create({
      data: {
        name,
        ownerId,
        slug: uniqueSlug,
        description: description || name,
        owner,
        users: {
          create: {
            user: {
              connect: { id: ownerId },
            },
          },
        },
      },
    });

    const newWorkspace = await prisma.workspace.create({
      data: {
        name: `Workspace Padrão`,
        tenantId: newTenant.id,
        slug: `${uniqueSlug}-workspace`,
        description: `Workspace padrão - ${name}`,
        users: {
          create: {
            user: {
              connect: { id: ownerId },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { tenant: newTenant, workspace: newWorkspace },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
