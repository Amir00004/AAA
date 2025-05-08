import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Dr. Olivia Martinez",
    role: "Cardiologist",
    quote: "Their cutting-edge technology and patient-first approach have revolutionized healthcare.",
    image: "https://randomuser.me/api/portraits/women/42.jpg"
  },
  {
    name: "James Richardson",
    role: "Recovered Patient",
    quote: "The doctors here treated me with the utmost care and professionalism. I feel like a new person!",
    image: "https://randomuser.me/api/portraits/men/30.jpg"
  },
  {
    name: "Dr. Daniel Cooper",
    role: "Neurologist",
    quote: "Their expertise and compassion create an unmatched healthcare experience. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/50.jpg"
  },
  {
    name: "Sophia Carter",
    role: "Nurse",
    quote: "A wonderful experience. The hospital's patient care is truly top-notch and inspiring!",
    image: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    name: "Michael Johnson",
    role: "Recovered Patient",
    quote: "Thanks to this medical team, I was able to recover quickly and with the best care possible.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Dr. Emily Foster",
    role: "Surgeon",
    quote: "The level of medical excellence here is outstanding. I’m honored to be a part of this team.",
    image: "https://randomuser.me/api/portraits/women/40.jpg"
  }
];

export default function Testimonials() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3, // Always show 3 testimonials
    slidesToScroll: 1, // Move only 1 at a time
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-2">What Our Patients & Doctors Say</h2>
        <p className="text-blue-700 mb-8">Trusted professionals and happy patients share their experiences.</p>
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-4">
              <div className="bg-white p-6 rounded-xl shadow-lg text-left">
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full border-2 border-blue-500" src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
