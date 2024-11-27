import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

async function generateUniqueSlug(name: string): Promise<string> {
  const slug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.workspace.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Unsupported Media Type. Expected application/json" },
      { status: 415 }
    );
  }

  const { name, description, icon, tenantId, userId } = await request.json();
  if (!name || !tenantId || !userId) {
    return NextResponse.json(
      { error: "Name, tenantId, and userId are required" },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(name);
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        icon,
        tenantId,
      },
    });

    await prisma.userOnWorkspace.create({
      data: {
        userId,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}