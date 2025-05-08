import React from 'react'
import ReserveSlot from '../components/ReserveSlot'

export function Appointment() {
    

    return (
        <>

  <div className="container-fluid bg-primary py-5 hero-header mb-5">
    <div className="row py-3">
      <div className="col-12 text-center">
        <h1 className="display-3 text-white animated zoomIn">Appointment</h1>
        <a href="" className="h4 text-white">
          Home
        </a>
        <i className="far fa-circle text-white px-2" />
        <a href="" className="h4 text-white">
          Appointment
        </a>
      </div>
    </div>
  </div>
  {/* Hero End */}
  {/* Appointment Start */}
  <div
    className="container-fluid bg-primary bg-appointment mb-5 wow fadeInUp"
    data-wow-delay="0.1s"
    style={{ marginTop: 90 }}
  >
    <div className="container">
      <div className="row gx-5">
        <div className="col-lg-6 py-5">
          <div className="py-5">
            <h1 className="display-5 text-white mb-4">
              We Are A Certified Lab
            </h1>
            <p className="text-white mb-0">
              Eirmod sed tempor lorem ut dolores. Aliquyam sit sadipscing kasd
              ipsum. Dolor ea et dolore et at sea ea at dolor, justo ipsum duo
              rebum sea invidunt voluptua. Eos vero eos vero ea et dolore eirmod
              et. Dolores diam duo invidunt lorem. Elitr ut dolores magna sit.
              Sea dolore sanctus sed et. Takimata takimata sanctus sed.
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div
            className="appointment-form h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
            data-wow-delay="0.6s"
          >
            <h1 className="text-white mb-4">Make Appointment</h1>

            <form>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <select
                    className="form-select bg-light border-0"
                    style={{ height: 55 }}
                  >
                    <option selected="">Select A Service</option>
                    <option value={1}>Service 1</option>
                    <option value={2}>Service 2</option>
                    <option value={3}>Service 3</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <select
                    className="form-select bg-light border-0"
                    style={{ height: 55 }}
                  >
                    <option selected="">Select Doctor</option>
                    <option value={1}>Doctor 1</option>
                    <option value={2}>Doctor 2</option>
                    <option value={3}>Doctor 3</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Your Name"
                    style={{ height: 55 }}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <input
                    type="email"
                    className="form-control bg-light border-0"
                    placeholder="Your Email"
                    style={{ height: 55 }}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <div className="date" id="date1" data-target-input="nearest">
                    <input
                      type="text"
                      className="form-control bg-light border-0 datetimepicker-input"
                      placeholder="Appointment Date"
                      data-target="#date1"
                      data-toggle="datetimepicker"
                      style={{ height: 55 }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="time" id="time1" data-target-input="nearest">
                    <input
                      type="text"
                      className="form-control bg-light border-0 datetimepicker-input"
                      placeholder="Appointment Time"
                      data-target="#time1"
                      data-toggle="datetimepicker"
                      style={{ height: 55 }}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <button className="btn btn-dark w-100 py-3" type="submit">
                    Make Appointment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Appointment End */}


        </>
    )
}
export default Appointment