import React, { Component } from 'react';
import HousingCard from '../HousingCard';
import Loading from '../Loading';
import { Button } from 'react-bootstrap';
import { truncate } from 'fs';

class Housing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      housings: [],
      user: null,
      loading: true,
      filtered: false
    };
  }
  componentDidMount = () => {
    this.fetchAllHousing();
    this.fetchUser();
  };
  fetchAllHousing = () => {
    fetch('/api/housing')
      .then(data => data.json())
      .then(housings => {
        this.setState({
          housings,
          loading: false,
          filtered: false
        });
      })
      .catch(err => console.log(err));
  };
  fetchUser = () => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(profile => {
        this.setState({
          user: profile,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };
  filterByEligibility = () => {
    if (this.state.filtered) {
      this.fetchAllHousing();
      this.setState({
        loading: true
      });
    } else {
      this.setState({
        loading: true
      });
      fetch('/api/housing/eligible', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          householdSize: this.state.user.householdSize,
          Income: this.state.user.householdIncome
        })
      })
        .then(res => res.json())
        .then(housings => {
          const preference = {
            SRO: this.state.user.SRO,
            Studio: this.state.user.studio,
            '1 BR': this.state.user.oneBedroom,
            '2 BR': this.state.user.twoBedroom
          };
          const filteredByUnitType = housings.filter(housing => {
            return housing.unitSummaries.general.some(unit => {
              const { unitType } = unit;
              return preference[unitType];
            });
          });
          this.setState({
            housings: filteredByUnitType,
            filtered: true,
            loading: false
          });
        })
        .catch(err => console.log(err));
    }
  };
  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <div>
        <h1 className="padding-all-around-md">
          Currently Available Affordable Housing
        </h1>
        {this.state.user === null ||
        this.state.user.isLogin === false ? null : (
          <Button onClick={this.filterByEligibility}>
            {this.state.filtered ? 'Show All Housing' : 'Filter By Preference'}
          </Button>
        )}
        {this.state.housings.length === 0 ? (
          <p>No Match Found at this moment. Please try it another time.</p>
        ) : null}
        <div className="background wrap-around padding-all-around-md">
          {this.state.housings.map(housing => (
            <HousingCard key={housing.uuid} housing={{ ...housing }} />
          ))}
        </div>
      </div>
    );
  }
}

export default Housing;
