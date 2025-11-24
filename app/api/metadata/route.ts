import { NextResponse } from 'next/server'

// Memoria temporal del servidor (se borra si reinicias la consola)
// Esto permite que el teléfono y la PC compartan datos.
let eventsQueue: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const myNumber = searchParams.get('number')

  if (!myNumber) return NextResponse.json([])

  // Buscar eventos dirigidos a mi número
  const myEvents = eventsQueue.filter(event => event.to === myNumber)
  
  // Borrar los eventos ya entregados para no recibirlos dos veces
  if (myEvents.length > 0) {
    eventsQueue = eventsQueue.filter(event => event.to !== myNumber)
  }

  return NextResponse.json(myEvents)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Guardar el evento en la cola
    eventsQueue.push({
      ...body,
      timestamp: Date.now()
    })
    
    // Limpieza automática: mantener solo los últimos 50 eventos para no saturar
    if (eventsQueue.length > 50) {
      eventsQueue = eventsQueue.slice(-50)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando mensaje' }, { status: 500 })
  }
}