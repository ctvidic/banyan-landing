import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

// Define the expected request body schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
});

// Define the directory and file path for storing emails
// Using '.vercel/output/' ensures it works correctly in Vercel's build output directory
const dataDir = path.join(process.cwd(), '.vercel', 'output'); 
const filePath = path.join(dataDir, "waitlist-emails.csv"); // Use CSV for easier parsing later

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error; // Re-throw if it's not a "directory already exists" error
    }
  }
}

export async function POST(request: Request) {
  try {
    // 1. Parse and validate the request body
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error.flatten());
      return NextResponse.json(
        { error: "Invalid email address provided.", details: validation.error.flatten() },
        { status: 400 }
      );
    }
    
    const { email } = validation.data;

    // 2. Ensure the storage directory exists (important for Vercel deployment)
    await ensureDirectoryExists(dataDir);

    // 3. Append email and timestamp to the file
    const timestamp = new Date().toISOString();
    const csvLine = `"${email}","${timestamp}"\n`; // Basic CSV formatting

    await fs.appendFile(filePath, csvLine);
    console.log(`Email added to waitlist: ${email}`);

    // 4. Return success response
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    // 5. Handle errors
    console.error("Waitlist API Error:", error);
    
    // Provide a generic error message to the client
    let errorMessage = "Failed to add email to the waitlist. Please try again later.";
    let statusCode = 500;

    // Specific handling for Zod errors (though caught by safeParse usually)
    if (error instanceof z.ZodError) {
      errorMessage = "Invalid data format.";
      statusCode = 400;
    } else if (error.code === 'ENOENT') {
       // Error if file/directory doesn't exist after trying to create it
       errorMessage = "Server configuration error. Could not access storage.";
       statusCode = 500;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 