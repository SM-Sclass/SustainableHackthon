from flask import Flask, request, jsonify
import requests
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
# Function to fetch data from the API and handle JSON format
def get_data_from_api(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        data = pd.json_normalize(response.json())
        return data
    else:
        return None

# Function to filter and recommend refrigerators/freezers
def recommend_refrigerator_freezer(product_name, api_url):
    data = get_data_from_api(api_url)
    if data is None:
        return {"error": "Failed to fetch data from API."}

    filtered_data = data[data['lab_grade_refrigerators_and_freezers_product_type'].str.contains(product_name, case=False, na=False)]
    filtered_data = filtered_data.sort_values(by=['daily_energy_consumption', 'peak_temperature_variance_c'])
    filtered_data = filtered_data.head(10)

    recommendations = []
    for _, row in filtered_data.iterrows():
        recommendation = {
            'brand_name': row['brand_name'],
            'model_name': row['model_name'],
            'product_type': row['lab_grade_refrigerators_and_freezers_product_type'],
            'daily_energy_consumption': row['daily_energy_consumption'],
            'peak_temperature_variance': row['peak_temperature_variance_c'],
            'reason': f"Low daily energy consumption ({row['daily_energy_consumption']} kWh) and low peak temperature variance ({row['peak_temperature_variance_c']}°C)."
        }
        recommendations.append(recommendation)

    return recommendations

# Function to filter and recommend air conditioners
def recommend_air_conditioner(product_name, api_url_ac):
    data = get_data_from_api(api_url_ac)
    if data is None:
        return {"error": "Failed to fetch data from API."}

    data['cooling_capacity_btu_hour'] = pd.to_numeric(data['cooling_capacity_btu_hour'], errors='coerce')
    data['annual_energy_use_kwh_yr'] = pd.to_numeric(data['annual_energy_use_kwh_yr'], errors='coerce')
    data['combined_energy_efficiency_ratio_ceer'] = pd.to_numeric(data['combined_energy_efficiency_ratio_ceer'], errors='coerce')

    def evaluate_product(row):
        match = False
        reason = ""
        if row['meets_most_efficient_criteria'] == "Yes":
            match = True
            reason = f"Product meets 'Most Efficient Criteria' for energy efficiency."
        elif row['cooling_capacity_btu_hour'] >= 12000:
            match = True
            reason = f"Product has a high cooling capacity of {row['cooling_capacity_btu_hour']} BTU/hr."
        elif row['annual_energy_use_kwh_yr'] <= 600:
            match = True
            reason = f"Product has a low annual energy use of {row['annual_energy_use_kwh_yr']} kWh/year."
        elif row['low_noise'] == "Yes":
            match = True
            reason = f"Product operates at a low noise level."
        elif row['combined_energy_efficiency_ratio_ceer'] >= 15:
            match = True
            reason = f"Product has a high CEER of {row['combined_energy_efficiency_ratio_ceer']}."
        return match, reason

    filtered_data = data[data.apply(lambda row: evaluate_product(row)[0], axis=1)]

    recommendations = []
    for _, row in filtered_data.iterrows():
        match, reason = evaluate_product(row)
        recommendation = {
            'brand_name': row['brand_name'],
            'model_number': row['model_number'],
            'cooling_capacity': row['cooling_capacity_btu_hour'],
            'voltage': row['voltage_volts'],
            'product_class': row['product_class'],
            'low_noise': row['low_noise'],
            'annual_energy_use_kwh_yr': row['annual_energy_use_kwh_yr'],
            'meets_efficient_criteria': row['meets_most_efficient_criteria'],
            'reason': reason
        }
        recommendations.append(recommendation)

    return recommendations

# Define the Flask routes/endpoints
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

if __name__ == '__main__':
    app.run(debug=True)
