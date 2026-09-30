import { NextResponse } from "next/server";

const GUESTS = [
  { name: "Mauro Olivera", seats: 2 },
];

function normalizeName(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const normalized = normalizeName(body?.name);

    if (!normalized) {
      return NextResponse.json(
        { valid: false, message: "Escribe tu nombre completo." },
        { status: 400 }
      );
    }

    const guest = GUESTS.find(
      (item) => normalizeName(item.name) === normalized
    );

    if (!guest) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "No encontramos ese nombre en la lista de invitados.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      seats: guest.seats,
    });
  } catch {
    return NextResponse.json(
      {
        valid: false,
        message: "No pudimos procesar la confirmación.",
      },
      { status: 400 }
    );
  }
}
