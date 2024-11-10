from openai import OpenAI
import os
import json
import re

# Set up the NVIDIA API client (ensure this client is the right one for interacting with NVIDIA models)
client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)

def product_rating(name, id):
    # Create a chat completion request with NVIDIA model
    completion = client.chat.completions.create(
        model="nvidia/llama-3.1-nemotron-70b-instruct",
        messages=[{
            "role":"system","content":"please output only valid JSON,don't give any other text "
        },
            
           {
               "role": "user","content": f"give me the rating out of 10 for the product {name} with id {id} respond in one number and 2 line of reason and give the price of the product in rupee only no need of anything extra just a number and 2 lines thats it in the json format"
         }
           ],
        temperature=0.5,
        top_p=1,
        max_tokens=1024,
        stream=True
    )
    
    # Variable to store the final response
    output = ""
    
    # Iterate over the streamed response chunks
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            # Append the content for the full response
            output += chunk.choices[0].delta.content
            
            
            
              # Extract JSON content if it’s embedded in extra text
    json_match = re.search(r"\{.*\}", output, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            json_data = json.loads(json_str)  # Parse JSON
            print(json_data)
            return json_data  # Return JSON response directly
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format received.", "raw_output": output}

    return {"error": "No JSON found in response.", "raw_output": output}
    
    # Return the final rating (expected to be a number)
    # return rating.strip()  # Ensure there's no extra whitespace

# print(nv("kitkat", 8445290728791))