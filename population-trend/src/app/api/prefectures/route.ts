import { getPrefectures } from '@/lib/resasClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getPrefectures();
    return NextResponse.json(data);
  } catch (e) {
    console.error('prefectures API error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
