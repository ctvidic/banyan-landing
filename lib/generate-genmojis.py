import requests
import base64
import os
import sys
import json

# Get API key from environment or prompt
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    print("OPENAI_API_KEY not found in environment variables.")
    api_key = input("Please enter your OpenAI API key: ").strip()
    if not api_key:
        print("API key is required to generate images.")
        sys.exit(1)

# Create output directory
os.makedirs("public/genmojis", exist_ok=True)

# Define genmojis to generate
genmojis = [
    {
        "name": "confident-teen-smile",
        "prompt": "Draw a 3D rendered confident teen face with a genuine warm smile, modern stylish hair, clean appearance, Apple memoji style, professional and friendly"
    },
    {
        "name": "proud-parent-smile",
        "prompt": "Draw a 3D rendered middle-aged parent face with a subtle proud smile, professional appearance, modern hairstyle, Apple memoji style, warm and approachable"
    },
    {
        "name": "teen-thinking",
        "prompt": "Draw a 3D rendered teen face with thoughtful expression, hand on chin, slight smile, modern appearance, Apple memoji style, intelligent look"
    },
    {
        "name": "teen-success",
        "prompt": "Draw a 3D rendered teen face with bright smile showing success, subtle fist pump gesture, modern Gen Z style, Apple memoji style, achievement expression"
    },
    {
        "name": "parent-approval",
        "prompt": "Draw a 3D rendered parent face nodding with approval, gentle smile, professional appearance, Apple memoji style, supportive expression"
    },
    {
        "name": "teen-focused",
        "prompt": "Draw a 3D rendered teen face looking focused and determined, slight smile, modern glasses, Apple memoji style, studious but cool"
    },
    {
        "name": "happy-graduate",
        "prompt": "Draw a 3D rendered young person with graduation cap, big genuine smile, Apple memoji style, celebrating achievement"
    },
    {
        "name": "teen-wink",
        "prompt": "Draw a 3D rendered teen face with friendly wink and smile, modern hairstyle, Apple memoji style, playful but tasteful"
    },
    {
        "name": "teen-girl-confident",
        "prompt": "Draw a 3D rendered teenage girl face with confident smile, modern Gen Z hairstyle, natural makeup, Apple memoji style, empowered and friendly"
    },
    {
        "name": "mom-supportive",
        "prompt": "Draw a 3D rendered mother face with warm supportive smile, professional appearance, modern hairstyle, Apple memoji style, caring and proud"
    },
    {
        "name": "teen-girl-success",
        "prompt": "Draw a 3D rendered teenage girl celebrating success with big smile, modern style, Apple memoji style, achievement and joy"
    },
    {
        "name": "dad-thumbs-up",
        "prompt": "Draw a 3D rendered father face giving subtle thumbs up with approving smile, professional look, Apple memoji style, encouraging"
    },
    {
        "name": "teen-girl-focused",
        "prompt": "Draw a 3D rendered teenage girl with focused expression, slight smile, modern glasses, Apple memoji style, determined and smart"
    },
    {
        "name": "teen-boy-excited",
        "prompt": "Draw a 3D rendered teenage boy with excited happy expression, modern hairstyle, Apple memoji style, energetic but not over the top"
    },
    {
        "name": "parent-peace-mind",
        "prompt": "Draw a 3D rendered parent face with peaceful relieved smile, gender neutral appearance, Apple memoji style, content and relaxed"
    },
    {
        "name": "teen-girl-wink",
        "prompt": "Draw a 3D rendered teenage girl with playful wink, modern hairstyle, subtle smile, Apple memoji style, fun and friendly"
    }
]

# Function to call the API using the format from documentation
def generate_image_with_transparency(prompt, api_key):
    """Generate an image with transparent background using the responses API"""
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Using the format from the documentation
    payload = {
        "model": "gpt-4.1-mini",
        "input": prompt,
        "tools": [
            {
                "type": "image_generation",
                "background": "transparent",
                "quality": "high",
            }
        ]
    }
    
    try:
        # Try the responses endpoint
        response = requests.post(
            "https://api.openai.com/v1/responses",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 404:
            # If responses endpoint doesn't exist, try the standard approach
            print("Note: Responses API endpoint not found. Trying alternative approach...")
            
            # Alternative: Use standard images API with explicit transparent background request
            payload = {
                "model": "dall-e-3",
                "prompt": f"{prompt}. IMPORTANT: Generate this image with a completely transparent background, no background elements whatsoever.",
                "size": "1024x1024",
                "quality": "hd",
                "n": 1,
                "response_format": "b64_json"
            }
            
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=payload
            )
        
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None

# Generate each genmoji
print(f"\n🎨 Generating {len(genmojis)} custom genmojis with transparent backgrounds...\n")

for i, genmoji in enumerate(genmojis):
    print(f"[{i+1}/{len(genmojis)}] Generating {genmoji['name']}...")
    
    try:
        result = generate_image_with_transparency(genmoji['prompt'], api_key)
        
        if result:
            # Extract image data based on response format
            image_data = None
            
            # Check for responses API format
            if 'output' in result:
                for output in result.get('output', []):
                    if output.get('type') == 'image_generation_call':
                        image_data = output.get('result')
                        break
            
            # Check for standard images API format
            elif 'data' in result:
                image_data = result['data'][0].get('b64_json')
            
            if image_data:
                # Decode and save the image
                image_bytes = base64.b64decode(image_data)
                filename = f"public/genmojis/{genmoji['name']}.png"
                with open(filename, "wb") as f:
                    f.write(image_bytes)
                print(f"    ✅ Saved to {filename}")
            else:
                print(f"    ❌ No image data in response")
        else:
            print(f"    ❌ Failed to generate image")
        
    except Exception as e:
        print(f"    ❌ Error: {str(e)}")
        continue
    
print("\n✨ Genmoji generation complete!")
print("\nNote: If the transparent background API is not available, images may have backgrounds.")
print("You can use a background removal tool like remove.bg or similar services to achieve transparency.") 