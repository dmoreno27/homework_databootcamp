import numpy as np
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

tmin = func.min(Measurement.tobs)
tavg = func.avg(Measurement.tobs)
tmax = func.max(Measurement.tobs)
# Routes

# * `/`
#   * Home page.
#   * List all routes that are available.


@app.route("/")
def home():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/<br/>"
        f"/api/precipitation<br/>"
        f"/api/stations<br/>"
        f"/api/temperature<br/>"
        f"/api/YYYY-MM-DD  (use for search by start-date only)"
        f"/api/YYYY-MM-DD/YYYY-MM-DD   (use for search by start-date/end-date"
        f"/api/search    (allows user input with prompts in the terminal for date parameters)")

# * `/api/precipitation`
#   * Convert the query results to a Dictionary using `date` as the key and `prcp` as the value.
#   * Return the JSON representation of your dictionary.


@app.route("/api/precipitation")
def precipitations():
    results = session.query(Measurement.date, Measurement.prcp).all()

    all_prcp = []
    for date, prcp in results:
        prcp_dict = {}
        prcp_dict[date] = prcp
        all_prcp.append(prcp_dict)

    return jsonify(all_prcp)


# * `/api/stations`
#   * Return a JSON list of stations from the dataset.
@app.route("/api/stations")
def stations():
    results = session.query(Station.name).all()
    station_names = list(np.ravel(results))
    return jsonify(station_names)

# * `/api/temperature`
#   * query for the dates and temperature observations from a year from the last data point.
#   * Return a JSON list of Temperature Observations (tobs) for the previous year.


@app.route("/api/temperatures")
def temperatures():
    date_max = session.query(func.max(Measurement.date))
    query_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    results = session.query(Measurement.tobs).\
        filter(Measurement.date >= query_date).\
        order_by(Measurement.date.desc()).all()
    all_temp = []
    for tobs in results:
        all_temp.append(tobs)
    return jsonify(all_temp)


# * `/api/<start>` and `/api/<start>/<end>`
#   * Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
#   * When given the start only, calculate `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date.
@app.route("/api/<start>")

def search(start):
    date_max = session.query(func.max(Measurement.date))
    max_date = []
    for item in date_max:
        max_date.append(item)
    all_dates = []
    for item in session.query(Measurement.date).all():
        all_dates.append(item[0])
    
    if start in all_dates:
        results = session.query(tmin, tavg, tmax).\
            filter(Measurement.date >= start).\
            all()
        temps = list(np.ravel(results))
        return jsonify(f"Info for selected start date of {start} and default end date of {max_date[0][0]}:  minimum temperature, {results[0][0]}; average temperature {results[0][1]}; maximum temperature {results[0][2]}")
    else:
        return jsonify({"Error": f"Given start date ( {start} ) is not valid. Please select a date between {all_dates[0]} and {all_dates[-1]}."}), 404


@app.route("/api/<start>/<end>")
def search_range(start, end):
    date_max = session.query(func.max(Measurement.date))
    max_date = []
    for item in date_max:
        max_date.append(item)
    all_dates = []
    for item in session.query(Measurement.date).all():
        all_dates.append(item[0])
    
    if start in all_dates and end in all_dates and all_dates.index(start) <= all_dates.index(end):
        results = session.query(tmin, tavg, tmax).\
            filter(Measurement.date >= start).\
            filter(Measurement.date <= end).\
            all()
        temps = list(np.ravel(results))
        return jsonify(f"Info for selected start date of {start} and default end date of {end}:  minimum temperature, {temps[0]}; average temperature {temps[1]}; maximum temperature {temps[2]}")
    else:
        return jsonify({"Error": f"Given date range of  ( {start}  to {end}) is not valid. Please use dates between {all_dates[0]} and {all_dates[-1]} and check that the selected end date falls after the selected start date."}), 404
      
        
# * `/api/search`
#   * Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range based on a users query input.


@app.route("/api/search")
def search_query():
    date_min = session.query(func.min(Measurement.date))
    min_date = []
    for item in date_min:
        min_date.append(item)
    date_max = session.query(func.max(Measurement.date))
    max_date = []
    for item in date_max:
        max_date.append(item)
    

    affirmatives = ["Y", "Yes", "Yep", "Yea", "Yeah"]
    negatives = ["N", "No", "Nope", "Nah", "Not"]

    input_searchtype = input(
        "Would you like to use a specific end date for this query?  ")
    if input_searchtype in negatives:
        print(
            f"Input the date you'd like to search. Valid date ranges: {min_date[0][0]} to {max_date[0][0]}")
        input_year = int(input("What is the year? YYYY   "))
        input_month = int(
            input("What is the month in numbers? 1,2,3,4,5,6,7,8,9,10,11,12   "))
        input_day = int(
            input("What is the day? 1, 2, 3...29, 30 etc.   "))

        query_info = dt.date(input_year, input_month, input_day)

        results = session.query(tmin,tavg,tmax).\
            filter(Measurement.date >= query_info).\
            order_by(Measurement.date.desc()).all()
        search_results = []
        for tobs in results:
            search_results.append(tobs)


        return jsonify("Temperature info for selected start date of",
                       f"{input_year}-{input_month}-{input_day} and end date of {max_date[0][0]}",
                       "Minimum ", search_results[0][0], "Average ", search_results[0][1], "Maximum", search_results[0][2])

    else:
        if input_searchtype in affirmatives:
  
            print(f"Input the start date you'd like to query. Valid date ranges: \
                {min_date[0][0]} to {max_date[0][0]}")
            input_start_year = int(input("What is the start year? YYYY   "))
            input_start_month = int(
                input("What is the start month in numbers? 1,2,3,4,5,6,7,8,9,10,11,12   "))
            input_start_day = int(
                input("What is the start day? 1, 2, 3, 4, 5...29, 30 etc.   "))

            print(f"Input the end date you'd like to query. Valid date ranges: \
                {input_start_year}-{input_start_month}-{input_start_day} to {max_date[0][0]}")
            input_end_year = int(input("What is the end year? YYYY   "))
            input_end_month = int(
                input("What is the end month in numbers? 1,2,3,4,5,6,7,8,9,10,11,12   "))
            input_end_day = int(
                input("What is the end day? 1, 2, 3, 4, 5...29, 30 etc.   "))

            query_info_1 = dt.date(
                input_start_year, input_start_month, input_start_day)
            query_info_2 = dt.date(
                input_end_year, input_end_month, input_end_day)

            results = session.query(tmin,tavg,tmax).\
                filter(Measurement.date >= query_info_1).\
                filter(Measurement.date <= query_info_2).\
                order_by(Measurement.date.desc()).all()
            search_results = []
            for tobs in results:
                search_results.append(tobs)

            return jsonify("Temperature info for selected date range of", \
                f"{input_start_year}-{input_start_month}-{input_start_day} \
                and end date of {input_end_year}-{input_end_month}-{input_end_day}", \
                "Minimum temperature", search_results[0][0],"Average temperature", search_results [0][1], "Maximum Temperature", search_results[0][2])
        else:
            print(
                "Please enter a valid response for 'Would you like to use a specific end date for this query?'")
            return search_query()





if __name__ == '__main__':
    app.run(debug=True)

#   * Hint: You may want to look into how to create a defualt value for your route variable.

#   * When given the start and the end date, calculate the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive.
