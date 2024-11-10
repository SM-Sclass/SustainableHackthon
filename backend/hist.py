from flask import Flask, jsonify, request
import openfoodfacts

# Initialize Flask app
app = Flask(__name__)

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
            'img': product.get('image_url')
        }

        filtered_products.append(filtered_product)

    return filtered_products

@app.route('/get_product_details', methods=['POST'])
def get_product_details():
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

if __name__ == "__main__":
    app.run(debug=True)
