import { getPopulation } from '@/lib/resasClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const prefCode = req.nextUrl.searchParams.get('prefCode');
  if (!prefCode || isNaN(Number(prefCode))) {
    return new NextResponse('Invalid prefCode', { status: 400 });
  }

  try {
    const data = await getPopulation({ prefCode: Number(prefCode) });
    return NextResponse.json(data);
  } catch (e) {
    console.error('population API error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
