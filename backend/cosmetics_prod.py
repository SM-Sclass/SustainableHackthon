import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import time
import json

# Configure the API with your API key directly
genai.configure(api_key="AIzaSyDoGFe3_lXAvpVd9GjK9XmKLTKIgUMsHIk")

# Function to initialize Selenium and configure Firefox options
def initialize_driver():
    firefox_options = Options()
    firefox_options.add_argument("--headless")
    firefox_options.add_argument("--no-sandbox")
    firefox_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Firefox(options=firefox_options)
    return driver

# Function to get the search-friendly phrase along with reasons and rating using Google Generative AI
def get_searchable_phrase(product_name, ingredients):
    # Craft a strict prompt for reasons, rating, and search phrase
    prompt = (
        f"I am working on Environmental Sustainability project. Analyze the harmful ingredients ({', '.join(ingredients)}) in {product_name}. "
        f"Provide a collective reason explaining why these ingredients are harmful with a short paragraph with no formatting, focusing on their general impact on health and safety. "
        f"In a new line, give a rating out of 10 without explanation for the product, based on both the severity and quantity of harmful ingredients. "
        f"Then, generate a short, precise, and generalized search-friendly phrase for safe and sustainable alternatives to this product, avoiding major harmful ingredients. "
        f"If harmful ingredients include terms like talc or sulfate, include keywords such as 'sulfate-free' or 'talc-free' in the output phrase. "
        f"The phrase should focus on natural, organic, eco-friendly, non-toxic, and sustainable ingredients, without using the specific product name. "
        f"Also mention the product category (e.g., soap, shampoo). "
        f"Ensure the output is in the following STRICT FORMAT:\n"
        f"Product Name: {product_name}\n"
        f"Ingredients: {', '.join(ingredients)}\n"
        f"Reason for Harm: {{ Reason goes here }}\n"
        f"Rating: {{ Rating value out of 10 }}\n"
        f"Suggested Search Phrase: {{ Suggested search phrase }}\n"
        f"All information should be provided exactly in this format for clear, machine-readable output."
    )

    # Generate content using the Gemini model
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    
    # Split the response into different parts
    content = response.text.strip().split("\n")
    product_name = content[0].replace("Product Name:", "").strip()
    ingredients = content[1].replace("Ingredients:", "").strip().split(', ')
    reason = content[2].replace("Reason for Harm:", "").strip()
    rating = content[3].replace("Rating:", "").strip()
    search_phrase = content[4].replace("Suggested Search Phrase:", "").strip()

    # Return data as a dictionary for easy conversion to JSON
    result = {
        "product_name": product_name,
        "ingredients": ingredients,
        "reason": reason,
        "rating": int(rating.split('/')[0]),
        "suggested_search_phrase": search_phrase,
        "suggested_products": []
    }
    
    return result

# Function to scrape CosDNA and get harmful ingredients
def scrape_cosdna(product_name):
    driver = initialize_driver()
    harmful_ingredients = []
    try:
        # Navigate to CosDNA
        url = "https://cosdna.com/"
        driver.get(url)
        
        # Perform search on CosDNA
        search_field = driver.find_element(By.NAME, "q")
        search_field.send_keys(product_name)
        search_field.submit()
        time.sleep(2)
        
        # Click on the first search result
        first_result = driver.find_element(By.CSS_SELECTOR, "a.inline-block.w-full")
        first_result.click()
        
        # Get the product name directly using Selenium
        product_name_element = driver.find_element(By.CLASS_NAME, "prod-name")
        product_name = product_name_element.text.strip()
        
        # Scrape ingredients with safety rating >= 3
        page_html = driver.page_source
        soup = BeautifulSoup(page_html, "html.parser")
        rows = soup.select("table tbody tr")

        for row in rows:
            try:
                ingredient_name = row.find("td").find("div").find("span").get_text(strip=True)
                rating_spans = row.find_all("td")[-1].find("a").find_all("span")
                rating = int(rating_spans[-1].get_text(strip=True)) if rating_spans else None
                if rating and rating >= 3:
                    harmful_ingredients.append(ingredient_name)
            except (AttributeError, ValueError, IndexError):
                continue
        
        # Generate reasons, rating, and search phrase if harmful ingredients exist
        if harmful_ingredients:
            product_data = get_searchable_phrase(product_name, harmful_ingredients)
            return product_data
        else:
            return None
    
    except Exception as e:
        print("An error occurred:", e)
    finally:
        driver.quit()

def search_amazon(search_phrase):
    driver = initialize_driver()
    suggested_products = []
    try:
        # Construct the search URL directly with the search phrase
        formatted_phrase = search_phrase.replace(" ", "+")
        url = f"https://www.amazon.in/s?k={formatted_phrase}"
        driver.get(url)

        # Wait for the results to load
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.s-main-slot")))
            time.sleep(2)  # Extra wait for dynamic content
        except TimeoutException:
            # print("Amazon search results did not load in time.")
            return suggested_products

        # Parse the loaded HTML and get the top results
        page_html = driver.page_source
        soup = BeautifulSoup(page_html, "html.parser")
        products = soup.select("div.s-main-slot div[data-component-type='s-search-result']")[:5]

        for product in products:
            try:
                # Extracting product details
                name = product.find("span", class_="a-size-base-plus a-color-base a-text-normal")
                name = name.get_text(strip=True) if name else "Name not available"

                price_symbol = product.find("span", class_="a-price-symbol")
                price_whole = product.find("span", class_="a-price-whole")
                price = f"{price_symbol.get_text(strip=True)}{price_whole.get_text(strip=True)}" if price_symbol and price_whole else "Price not available"

                link_tag = product.find("a", class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal")
                link = "https://www.amazon.in" + link_tag["href"] if link_tag else "Link not available"

                image_tag = product.find("img")
                image_url = image_tag["src"] if image_tag else "Image not available"

                # Add product details to the results list
                suggested_products.append({
                    "product_name": name,
                    "price": price,
                    "link": link,
                    "image_url": image_url
                })

            except AttributeError:
                # Skip any product that doesn’t have the expected structure
                continue

    except Exception as e:
        print("An error occurred:", e)
    finally:
        driver.quit()

    return suggested_products
# # Main script execution
# product_name = input("Enter the product name to search on CosDNA: ")
# product_data = scrape_cosdna(product_name)
# if product_data:
#     product_data["suggested_products"] = search_amazon(product_data["suggested_search_phrase"])
    
    # Output the final result in JSON format
    # print(json.dumps(product_data, indent=4))