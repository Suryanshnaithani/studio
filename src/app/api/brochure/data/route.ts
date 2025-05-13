
import { NextResponse, type NextRequest } from 'next/server';
import { BrochureDataSchema, type BrochureData } from '@/components/brochure/data-schema';
import { z } from 'zod';

// In-memory store for simplicity. In a real app, use a database or other persistent storage.
const dataStore: Map<string, BrochureData> = new Map();

export async function POST(request: NextRequest) {
    try {
        const jsonData = await request.json();
        const validatedData = BrochureDataSchema.parse(jsonData);

        const dataKey = `key-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        dataStore.set(dataKey, validatedData);

        // Construct the base URL correctly from the incoming request
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const siteBaseUrl = host ? `${protocol}://${host}` : request.nextUrl.origin;
        
        const loadUrl = new URL(siteBaseUrl); // Use the site's base URL
        loadUrl.pathname = '/'; // Assuming the main page is at the root
        loadUrl.searchParams.set('dataKey', dataKey);
        
        return NextResponse.json({
            success: true,
            dataKey,
            loadUrl: loadUrl.toString(),
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: "Invalid data format", details: error.issues }, { status: 400 });
        }
        console.error("API POST error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dataKey = searchParams.get('dataKey');

        if (!dataKey) {
            return NextResponse.json({ success: false, error: "dataKey query parameter is required" }, { status: 400 });
        }

        const data = dataStore.get(dataKey);

        if (!data) {
            return NextResponse.json({ success: false, error: "Data not found for the given key" }, { status: 404 });
        }

        // Optionally remove data after retrieval if it's meant to be used once
        // dataStore.delete(dataKey);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("API GET error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
