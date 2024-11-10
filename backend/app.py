from flask import Flask, request, jsonify
import openfoodfacts
import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.chrome import ChromeDriverManager 
import time
import json
from bs4 import BeautifulSoup
from product import product_rating

# Initialize Flask App
app = Flask(__name__)

# Initialize the OpenFoodFacts API
api = openfoodfacts.API(user_agent="MyAwesomeApp/1.0")

# Initialize the Chrome driver
def initialize_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

# Search Amazon function (placeholder example for scraping)
def search_amazon(search_phrase):
    driver = initialize_driver()
    suggested_products = []
    try:
        driver.get("https://www.amazon.in/")
        
        # Enter search phrase in Amazon's search bar and submit
        search_field = driver.find_element(By.ID, "twotabsearchtextbox")
        search_field.send_keys(search_phrase)
        driver.find_element(By.ID, "nav-search-submit-button").click()
        time.sleep(2)
        
        # Scrape the top 5 products (simplified)
        page_html = driver.page_source
        soup = BeautifulSoup(page_html, "html.parser")
        products = soup.select("div.s-main-slot div[data-component-type='s-search-result']")[:1]
        
        for idx, product in enumerate(products, 1):
            try:
                name = product.find("span", class_="a-size-base-plus a-color-base a-text-normal").get_text(strip=True)
                price_symbol = product.find("span", class_="a-price-symbol").get_text(strip=True)
                price_whole = product.find("span", class_="a-price-whole").get_text(strip=True)
                price = f"{price_symbol}{price_whole}"
                link = "https://www.amazon.in" + product.find("a", class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal")["href"]
                suggested_products.append({
                    'name': name,
                    'price': price,
                    'link': link
                })
                
            except AttributeError:
                continue
    except Exception as e:
        print("Error occurred during Amazon scraping:", e)
    finally:
        driver.quit()

    return suggested_products

# Fetch product name using OpenFoodFacts API
def find_name(code):
    try:
        print(f"Fetching product name for code: {code}")  # Debug log
        response = api.product.get(code, fields=["code", "brands"])
        name = response.get("brands", "No brand found")
        print(f"Product name: {name}")  # Debug log
        return name
    except Exception as e:
        print(f"Error fetching product name for code {code}: {e}")
        return None

# Fetch the product history and details
def history(pro, count, code):
    try:
        response = api.product.text_search(pro)
        filtered_products = []

        for product in response.get('products', []):
            if len(filtered_products) >= count:
                break  # Limit the number of products returned

            product_id = str(product.get('_id'))  # Ensure product_id is a string
            if product_id == str(code):  # Skip if it's the same product
                continue

            product_details = api.product.get(product_id, fields=["code", "product_name"])

            product_name = product_details.get("product_name", "Product name not available")
            nutriments = product.get('nutriments', {})
            filtered_nutriments = {
                'carbohydrates': nutriments.get('carbohydrates'),
                'carbohydrates_unit': nutriments.get('carbohydrates_unit'),
                'energy_unit': nutriments.get('energy_unit'),
                'energy_value': nutriments.get('energy_value'),
                'fat': nutriments.get('fat'),
                'fat_unit': nutriments.get('fat_unit'),
                'proteins': nutriments.get('proteins'),
                'proteins_unit': nutriments.get('proteins_unit'),
                'salt': nutriments.get('salt'),
                'salt_unit': nutriments.get('salt_unit'),
                'saturated-fat': nutriments.get('saturated-fat'),
                'saturated-fat_unit': nutriments.get('saturated-fat_unit'),
                'sodium': nutriments.get('sodium'),
                'sodium_unit': nutriments.get('sodium_unit'),
                'sugars': nutriments.get('sugars'),
                'sugars_unit': nutriments.get('sugars_unit'),
                'sugars_value': nutriments.get('sugars_value')
            }

            filtered_product = {
                '_id': product_id,
                'product_name': product_name,
                'categories': product.get('categories'),
                'brands': product.get('brands'),
                'nutriments': filtered_nutriments,
                'ecoscore_grade': product.get('ecoscore_score'),
                'price': search_amazon(product_name),
                'img': product.get('image_url')
            }

            filtered_products.append(filtered_product)

        return filtered_products
    except Exception as e:
        print(f"Error during history search: {e}")
        return []

# Flask route to handle POST requests for product history
@app.route('/product-history', methods=['POST'])
def product_history():
    try:
        # Get the data from the request
        data = request.get_json()
        new_id = data.get('new_id')

        if not new_id:
            return jsonify({"error": "Missing 'new_id' parameter"}), 400  # Return error if 'new_id' is missing

        # Fetch product name based on 'new_id'
        name = find_name(str(new_id))  # Convert to string just in case

        if not name:
            return jsonify({"error": "Product not found"}), 404  # Return error if product is not found

        # Fetch product history details
        products = history(name, count=6, code=new_id)

        if not products:
            return jsonify({"error": "No product history found"}), 404

        # Return the product details in JSON format
        return jsonify(products)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500




# route for getting the rating and the reasons
@app.route("/product" , methods=["GET"])
def product():
    # Validate request data
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    
    # Ensure 'product' key exists in JSON data
    product = data.get("product")
    prod_id = data.get("prod_id")
    if not product or not prod_id:
        return jsonify({"error": "incomplete fields in request"}), 400
    try:
        output = product_rating(product,prod_id)
            # Check if output is in a valid JSON format (dict or list)
        if isinstance(output, (dict, list)):
            if output:  # If the output is not empty
                return jsonify(output), 200
            else:
                return jsonify({"message": "No results found for the given product"}), 404
        else:
            return jsonify({"error": "Invalid response format from search_product"}), 500
    
    except Exception as e:
        # Handle any errors in processing
        return jsonify({"error": "An error occurred during search processing", "details": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)  # Enable debugging to get detailed error logs
