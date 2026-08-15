from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# ==============================
# LOAD DATA
# ==============================

country_data = pd.read_csv("data/covid_19_clean_complete.csv")
day_data = pd.read_csv("data/day_wise.csv")


# ==============================
# HOME PAGE
# ==============================

@app.route("/")
def home():
    return render_template("index.html")


# ==============================
# GLOBAL STATISTICS
# ==============================

@app.route("/api/global")
def global_data():

    latest_date = country_data["Date"].max()

    latest_data = country_data[
        country_data["Date"] == latest_date
    ]

    total_confirmed = int(latest_data["Confirmed"].sum())
    total_deaths = int(latest_data["Deaths"].sum())
    total_recovered = int(latest_data["Recovered"].sum())
    total_active = int(latest_data["Active"].sum())

    return jsonify({
        "date": latest_date,
        "confirmed": total_confirmed,
        "deaths": total_deaths,
        "recovered": total_recovered,
        "active": total_active
    })


# ==============================
# COUNTRY DATA
# ==============================

@app.route("/api/countries")
def countries():

    latest_date = country_data["Date"].max()

    latest_data = country_data[
        country_data["Date"] == latest_date
    ]

    countries = (
        latest_data
        .groupby("Country/Region")
        [["Confirmed", "Deaths", "Recovered", "Active"]]
        .sum()
        .reset_index()
    )

    return jsonify(
        countries.to_dict(orient="records")
    )


# ==============================
# TIMELINE DATA
# ==============================

@app.route("/api/timeline")
def timeline():

    timeline_data = day_data[
        ["Date", "Confirmed", "Deaths", "Recovered", "Active"]
    ]

    return jsonify(
        timeline_data.to_dict(orient="records")
    )


# ==============================
# COUNTRY HISTORY
# ==============================

@app.route("/api/country/<country>")
def country_history(country):

    data = country_data[
        country_data["Country/Region"].str.lower()
        == country.lower()
    ]

    history = (
        data.groupby("Date")
        [["Confirmed", "Deaths", "Recovered", "Active"]]
        .sum()
        .reset_index()
    )

    return jsonify(
        history.to_dict(orient="records")
    )


# ==============================
# RUN APP
# ==============================

if __name__ == "__main__":
    app.run(debug=True)