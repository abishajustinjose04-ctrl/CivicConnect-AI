

import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Your message has been submitted. Backend connection will be added later."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">

      {/* PAGE HEADER */}
      <section className="inner-page-header">
        <div>
          <span>CITIZEN SUPPORT</span>

          <h1>Contact & Help</h1>

          <p>
            Need assistance with CivicConnect? Find answers to common
            questions or contact our support team.
          </p>
        </div>
      </section>


      {/* CONTACT INFORMATION */}
      <section className="contact-section">

        <div className="contact-grid">

          <div className="contact-info">

            <div className="section-label">
              CITIZEN SUPPORT
            </div>

            <h2>How Can We Help?</h2>

            <p>
              If you need assistance with submitting a complaint, tracking
              its status, or using CivicConnect services, you can contact us
              through the available support channels.
            </p>


            <div className="contact-item">

              <div className="contact-icon">
                📞
              </div>

              <div>
                <span>HELPLINE</span>
                <strong>1800-XXX-XXXX</strong>
                <p>Monday – Friday, 9:00 AM – 5:00 PM</p>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                ✉️
              </div>

              <div>
                <span>EMAIL SUPPORT</span>
                <strong>support@civicconnect.gov</strong>
                <p>For general support and assistance</p>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                🏢
              </div>

              <div>
                <span>CIVIC SERVICE OFFICE</span>
                <strong>Citizen Service Centre</strong>
                <p>Government public service support</p>
              </div>

            </div>

          </div>


          {/* CONTACT FORM */}

          <div className="contact-form-card">

            <div className="form-heading">
              <span>SEND AN ENQUIRY</span>

              <h2>Contact Support</h2>

              <p>
                Fill out the form below and provide details about your
                question or issue.
              </p>
            </div>


            <form onSubmit={handleSubmit}>

              <div className="contact-form-grid">

                <div className="form-group">
                  <label htmlFor="contact-name">
                    Full Name *
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="contact-email">
                    Email Address *
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="form-group full-width">
                  <label htmlFor="contact-subject">
                    Subject *
                  </label>

                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a subject
                    </option>

                    <option value="complaint">
                      Complaint Assistance
                    </option>

                    <option value="tracking">
                      Complaint Tracking
                    </option>

                    <option value="account">
                      Account Assistance
                    </option>

                    <option value="technical">
                      Technical Issue
                    </option>

                    <option value="general">
                      General Enquiry
                    </option>
                  </select>
                </div>


                <div className="form-group full-width">
                  <label htmlFor="contact-message">
                    Message *
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows="6"
                    placeholder="Describe your question or issue..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>


              <button
                type="submit"
                className="submit-btn contact-submit"
              >
                Send Message →
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* FAQ */}

      <section className="faq-section">

        <div className="section-heading">
          <span>FREQUENTLY ASKED QUESTIONS</span>

          <h2>Common Questions</h2>

          <p>
            Find quick answers to some of the most common CivicConnect
            questions.
          </p>
        </div>


        <div className="faq-grid">

          <div className="faq-card">
            <h3>How do I register a complaint?</h3>

            <p>
              Open the Register Complaint page, provide the required
              information, describe the issue, and submit the form.
            </p>
          </div>


          <div className="faq-card">
            <h3>How can I track my complaint?</h3>

            <p>
              Use the Track Complaint page and enter the complaint ID
              provided after your complaint is registered.
            </p>
          </div>


          <div className="faq-card">
            <h3>What information should I provide?</h3>

            <p>
              Provide accurate contact details, complaint category, location,
              and a clear description of the civic issue.
            </p>
          </div>


          <div className="faq-card">
            <h3>Can I upload supporting evidence?</h3>

            <p>
              Yes. The complaint form allows citizens to provide supporting
              images or documents where required.
            </p>
          </div>

        </div>

      </section>


      {/* EMERGENCY NOTE */}

      <section className="support-note">

        <div>
          <strong>Important</strong>

          <p>
            CivicConnect is intended for civic service complaints and
            enquiries. For emergencies requiring immediate assistance,
            contact the appropriate emergency service.
          </p>
        </div>

      </section>

    </main>
  );
}

export default Contact;

