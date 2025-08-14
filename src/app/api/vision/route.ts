import { NextResponse } from 'next/server';

type VisionResp = {
  responses?: Array<{
    fullTextAnnotation?: { text?: string };
  }>;
  error?: { message?: string };
};

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });

    const key = process.env.VISION_API_KEY;
    if (!key) return NextResponse.json({ error: 'Missing VISION_API_KEY' }, { status: 500 });

    const body = {
      requests: [
        {
          image: { source: { imageUri: imageUrl } }, // Firebase Storage https URL is fine
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    };

    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as VisionResp;

    const text = json?.responses?.[0]?.fullTextAnnotation?.text || '';
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Vision error' }, { status: 500 });
  }
}
