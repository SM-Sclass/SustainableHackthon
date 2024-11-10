from flask import Flask, request, jsonify
import openfoodfacts
import requests
import pandas as pd
from flask_cors import CORS
from search import search_product
from product import product_rating
from cosmetics_prod import scrape_cosdna,search_amazon
from env_endpoint import recommend_refrigerator_freezer, recommend_air_conditioner
# Initialize Flask App
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Initialize the OpenFoodFacts API
api = openfoodfacts.API(user_agent="MyAwesomeApp/1.0")



def find_name(code):
    response = api.product.get(code, fields=["code", "brands"])
    name = response.get("brands", "Product not found")
    return name

def history(pro, count, code):
    response = api.product.text_search(pro)
    filtered_products = []

    for product in response.get('products', []):
        if len(filtered_products) >= count:
            break
        
        product_id = str(product.get('_id'))
        if product_id == str(code):
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
            'ecoscore_grade':product.get('ecoscore_grade'),
            'img': product.get('image_url')
        }

        filtered_products.append(filtered_product)

    return filtered_products

@app.route('/recommend_refrigerator_freezer', methods=['POST'])
def recommend_rf():
    data = request.get_json()
    product_name = data.get("product_name")
    api_url_rf = 'https://data.energystar.gov/resource/g242-ysjw.json'

    if not product_name:
        return jsonify({"error": "Product name is required"}), 400

    recommendations = recommend_refrigerator_freezer(product_name, api_url_rf)
    return jsonify(recommendations)

@app.route('/recommend_air_conditioner', methods=['POST'])
def recommend_ac():
    data = request.get_json()
    product_name = data.get("product_name")
    api_url_ac = 'https://data.energystar.gov/resource/5xn2-dv4h.json'

    if not product_name:
        return jsonify({"error": "Product name is required"}), 400

    recommendations = recommend_air_conditioner(product_name, api_url_ac)
    return jsonify(recommendations)

@app.route('/product-history', methods=['POST'])
def product_history():
    data = request.json
    code = data.get("id")

    if not code:
        return jsonify({"error": "Product ID is required"}), 400

    product_name = find_name(code)
    if product_name == "Product not found":
        return jsonify({"error": "Product not found"}), 404

    # Call history with a count of 5 as an example
    product_history = history(product_name, 5, code)
    return jsonify(product_history)






# route for getting the rating and the reasons
@app.route("/product" , methods=["POST"])
def product():
    # Validate request data
    data = request.get_json()
    print(data,"these is data")
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    
    # Ensure 'product' key exists in JSON data
    prod_id = data.get("prod_id")
    response = api.product.get(prod_id, fields=[prod_id, "product_name"])
    product_name = response.get("product_name", "Product name not available")
   
    if not product or not prod_id:
        return jsonify({"error": "incomplete fields in request"}), 400
    try:
        output = product_rating(product_name,prod_id)
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


@app.route("/search", methods=["POST"])
def search():
    # Validate request data
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    
    # Ensure 'product' key exists in JSON data
    product = data.get("search")
    if not product:
        return jsonify({"error": "No 'search' field in request"}), 400
    
    try:
        # Process the product data with search_product function
        output = search_product(product)
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





@app.route("/cosmetic", methods=["POST"])
def analyze_product():
    try:
        # Check if JSON data is present in the request
        if not request.is_json:
            return jsonify({"error": "Request must be in JSON format"}), 400
        
        data = request.get_json()
        product_name = data.get("product_name")

        # Handle case where product_name is missing or empty
        if not product_name:
            return jsonify({"error": "Product name is required"}), 400

        # Run CosDNA scrape and check for harmful ingredients
        product_data = scrape_cosdna(product_name)
        if product_data:
            # Run Amazon search and include results if successful
            suggested_products = search_amazon(product_data["suggested_search_phrase"])
            product_data["suggested_products"] = suggested_products if suggested_products else []
            return jsonify(product_data), 200
        else:
            return jsonify({"error": "No harmful ingredients found or product not listed on CosDNA"}), 404

    except Exception as e:
        # Catch unexpected errors
        print(f"An error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500



if __name__ == '__main__':
    app.run(debug=True)  # Enable debugging to get detailed error logs
