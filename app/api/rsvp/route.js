import { NextResponse } from "next/server";

const GUESTS = [
  { name: "Pedro Mongua", seats: 1 },
  { name: "Matilde Bertel", seats: 1 },
  { name: "Adriana Simanca", seats: 1 },
  { name: "Rosa Pajaro", seats: 2 },
  { name: "Marlis Olivera", seats: 1 },
  { name: "Beatriz Olivera", seats: 1 },
  { name: "Margelis Olivera", seats: 2 },
  { name: "Roxana Olivera", seats: 1 },
  { name: "Claudia Mongua", seats: 4 },
  { name: "Stella Mongua", seats: 2 },
  { name: "Elsa Mongua", seats: 2 },
  { name: "Armando Mongua", seats: 1 },
  { name: "Patricia Torres", seats: 1 },
  { name: "Carlos Mongua", seats: 1 },
  { name: "Hugo Mongua", seats: 2 },
  { name: "Glinis Castillo", seats: 2 },
  { name: "Matilde Castillo", seats: 2 },
  { name: "Lucia Castillo", seats: 1 },
  { name: "Aura Castillo", seats: 1 },
  { name: "Nicolas Contreras", seats: 1 },
  { name: "Manuel Contreras", seats: 1 },
  { name: "Amalfi Contreras", seats: 1 },
  { name: "Juan Contreras", seats: 2 },
  { name: "Yovany Contreras", seats: 2 },
  { name: "Laura Batista", seats: 1 },
  { name: "Daniela Batista", seats: 1 },
  { name: "Gabriela Mongua", seats: 2 },
  { name: "Luz Myriam Aranguren", seats: 1 },
  { name: "Alvaro Guete", seats: 2 },
  { name: "Jorge Guete", seats: 2 },
  { name: "Jairo Guete", seats: 2 },
  { name: "Liz Esther Contreras", seats: 1 },
  { name: "Sahily Ramirez", seats: 1 },
  { name: "Glinis De Jesús Ramirez", seats: 2 },
  { name: "Marcos Ramirez", seats: 2 },
  { name: "Anyi Castillo", seats: 2 },
  { name: "Elisaray Castillo", seats: 2 },
  { name: "Marcos José Castillo", seats: 1 },
  { name: "Marcos Castillo", seats: 2 },
  { name: "Ronald Rodriguez", seats: 5 },
  { name: "Karen Mongua", seats: 2 },
  { name: "Julian Zuñiga", seats: 1 },
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
        {
          valid: false,
          message: "Escribe tu nombre completo.",
        },
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
