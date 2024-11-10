#Finalize searching 
import openfoodfacts
import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
 
import time
import json

def search_product(pro):
    # Initialize the OpenFoodFacts API
    api = openfoodfacts.API(user_agent="MyAwesomeApp/1.0")
    response = api.product.text_search(pro)
    
    # Extract only the required fields including specific fields within 'nutriments'
    filtered_products = []
    
    for product in response.get('products', []):
        # Retrieve the product ID and get additional product details
        product_id = product.get('_id')
        product_details = api.product.get(product_id, fields=["code", "product_name"])
        
        # Extract "product_name" and store it in a variable
        product_name = product_details.get("product_name", "Product name not available")
        
        # Filter the nutriments fields
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
        
        # Get categories hierarchy and format them
        categories_hierarchy = product.get('categories_hierarchy', [])
        formatted_categories = [category.replace('en:', '') for category in categories_hierarchy]
        
        # Compile filtered product information
        filtered_product = {                
            '_id': product_id,
            'product_name': product_name,
            'categories_hierarchy': formatted_categories,  # Use formatted categories
            'brands': product.get('brands'),
            'nutriments': filtered_nutriments,
            'ecoscore_grade':product.get('ecoscore_grade'),
            # 'price':search_amazon(product_name),
            'image_link':product.get('image_url')
            
            # 'image_link': product.get('selected_images', {}).get('front', {}).get('display', {}).get('en')
        }
        
        filtered_products.append(filtered_product)
    
    # Display the filtered output
    return filtered_products


