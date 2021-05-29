import React, { useState } from 'react';
import './style.css';
import Axios from 'axios';
import Header from './Header.js';
import DatePicker from 'react-datepicker';
import 'react-day-picker/lib/style.css';
import 'react-datepicker/dist/react-datepicker.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allStates: [],
      allDistricts: [],
      allCenters: [],
      selectedStateID: 0,
      selectedDistrictID: 0,
      selectedDate: 0
    };
  }

  populateStates() {
    Axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`).then(
      res => {
        var stateObject;
        var stateArray = [];
        res.data.states.forEach(state => {
          stateObject = new Object();
          stateObject.label = state.state_name;
          stateObject.value = state.state_id;

          stateArray.push(stateObject);
        });
        this.setState({ allStates: stateArray });
        console.log(this.state.allStates);
      }
    );
  }

  populateDistricts(event) {
    console.log(event.target.value);
    Axios.get(
      `https://cdn-api.co-vin.in/api/v2/admin/location/districts/` +
        event.target.value
    ).then(res => {
      var districtObject;
      var districtArray = [];
      res.data.districts.forEach(district => {
        districtObject = new Object();
        districtObject.label = district.district_name;
        districtObject.value = district.district_id;

        districtArray.push(districtObject);
      });
      this.setState({ allDistricts: districtArray });
      console.log(this.state.allStates);
    });
  }

  populateCenters(event) {
    console.log(event.target.value);
    Axios.get(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=' +
        event.target.value +
        '&date=' +
        document.getElementById('vaccine_date').value
    ).then(res => {
      var centerObject;
      var centerArray = [];
      res.data.sessions.forEach(session => {
        centerObject = new Object();
        centerObject.name = session.name;
        centerObject.address = session.address;
        centerObject.area = session.block_name;
        centerObject.pincode = session.pincode;
        centerObject.min_age_limit = session.min_age_limit;
        centerObject.vaccine = session.vaccine;
        centerObject.slots = session.slots;
        centerObject.available_capacity_dose1 =
          session.available_capacity_dose1;
        centerObject.available_capacity_dose2 =
          session.available_capacity_dose2;
        centerArray.push(centerObject);
      });
      this.setState({ allCenters: centerArray });
      console.log(this.state.allCenters);
    });
  }

  componentDidMount() {
    this.populateStates();
  }

  render() {
    return (
      <div id="app">
        <Header />
        <table>
          <tr>
            <td>
            <form > 
              <DatePicker
                placeholderText="Select a vaccination date"
                autoComplete="off"
                id="vaccine_date"
                selected={this.state.selectedDate}
                dateFormat="dd-MM-yyyy"
                onChange={date => {
                  this.setState({ selectedDate: date });
                  document.getElementById('state_dropdown').value = 0;
                  document.getElementById('district_dropdown').value = 0;
                }}
              />
              </form>
            </td>

            <td>
              <select
                name="in_state"
                id="state_dropdown"
                onChange={this.populateDistricts.bind(this)}
              >
                <option value="0">Choose your state</option>
                {this.state.allStates.map(state => (
                  <option value={state.value}> {state.label} </option>
                ))}
              </select>
            </td>

            <td>
              <select
                name="in_district"
                id="district_dropdown"
                onChange={this.populateCenters.bind(this)}
              >
                <option value="0">Choose your district</option>
                {this.state.allDistricts.map(district => (
                  <option value={district.value}> {district.label} </option>
                ))}
              </select>
            </td>
          </tr>
        </table>
        <br />
        <br />
        <table id="centers">
          <tr>
            <th>NAME</th>
            <th>ADDRESS</th>
            <th>AREA</th>
            <th>VACCINE</th>
            <th>DOSE 1 / DOSE 2 </th>
          </tr>
          {this.state.allCenters.length == 0 ? (
            <tr>
              <td colspan="5">
                <span id="sp_1">
                  ---------- No Center available for vaccination ----------
                </span>
              </td>
            </tr>
          ) : (
            this.state.allCenters.map(center => (
              <tr>
                <td>{center.name}</td>
                <td>{center.address}</td>
                <td>{center.area}</td>
                <td>
                  {center.vaccine == 'COVISHIELD' ? (
                    <span id="covishield">COVISHIELD</span>
                  ) : (
                    <span id="covaxin">COVAXIN</span>
                  )}
                </td>
                <td>
                  {center.available_capacity_dose1}/
                  {center.available_capacity_dose2}
                </td>
              </tr>
            ))
          )}
        </table>

        <br />
      </div>
    );
  }
}

export default App;
