import React from 'react'
import { MdHeight } from 'react-icons/md'

function Car() {
  return (
    <div className="container-fluid p-0" style={{visibility: 'hidden'}}>
          <div
            id="header-carousel"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
            style={{ height: '0' }}
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img className="w-100" src="img/carousel-2.jpg" alt="Image" />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <div className="p-3" style={{ maxWidth: 900 }}>
                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                      Stay Healthy
                    </h5>
                    <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                      Take The Best Quality scans
                    </h1>
                    <a
                      href="appointment.html"
                      className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                    >
                      Appointment
                    </a>
                    <a
                      href=""
                      className="btn btn-secondary py-md-3 px-md-5 animated slideInRight"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <img className="w-100" src="img/carousel-2.jpg" alt="Image" />
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                  <div className="p-3" style={{ maxWidth: 900 }}>
                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">
                      Stay Healthy
                    </h5>
                    <h1 className="display-1 text-white mb-md-4 animated zoomIn">
                      Take The Best Quality scans
                    </h1>
                    <a
                      href="appointment.html"
                      className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft"
                    >
                      Appointment
                    </a>
                    <a
                      href=""
                      className="btn btn-secondary py-md-3 px-md-5 animated slideInRight"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#header-carousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#header-carousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
  )
}

export default Car
