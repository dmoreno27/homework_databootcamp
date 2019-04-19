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
### Routes

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
        f"/api/_start_<br/>"
        f"/api/_start_/_end_<br/>")

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
    date_max=session.query(func.max(Measurement.date))
    query_date = dt.date(2017,8,23) - dt.timedelta(days=365)
    results=session.query(Measurement.tobs).\
        filter(Measurement.date >= query_date).\
        order_by(Measurement.date.desc()).all()
    all_temp = []
    for tobs in results:
        all_temp.append(tobs)
    return jsonify(all_temp)


# * `/api/<start>` and `/api/<start>/<end>`
#   * Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
#   * When given the start only, calculate `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date.

if __name__ == '__main__':
    app.run(debug=True)

#   * Hint: You may want to look into how to create a defualt value for your route variable.

#   * When given the start and the end date, calculate the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive.