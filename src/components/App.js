import React from "react";
import "../css/App.css";
import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";
import { without } from "lodash";


class App extends React.Component {
  state = {
    myAppointments: [],
    formDisplay: false,
    orderBy: "petName",
    orderDir: "asc",
    lastIndex: 0,
  };

  addAppointment = (apt) => {
    const { myAppointments } = this.state;
    let tempApts = myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);

    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  };

  deleteAppointment = (apt) => {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts,
    });
  };

  toggleForm = () => {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  };

  async componentDidMount() {
    try {
      const response = await fetch("./data.json");
      const result = await response.json();
      const apts = await result.map((item) => {
        item.aptId = this.state.lastIndex;
        this.setState({
          lastIndex: this.state.lastIndex + 1,
        });
        return item;
      });

      this.setState({
        myAppointments: apts,
      });
    } catch (error) {
      console.log("this thing messed up", error);
    }
  }

  render() {
    const { myAppointments, orderDir, formDisplay, orderBy } = this.state;
    let order;
    let filteredApts = myAppointments;
    if (orderDir === "asc") {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts.sort((a, b) => {
      if (a[orderBy].toLowerCase() < b[orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
