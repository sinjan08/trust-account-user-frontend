
const Homepage = () => {
  return (
    <>
      <header className="main-head">
        <div className="container">
          <div className="nav-inr">
            <nav className="navbar navbar-expand-lg">
              <a className="navbar-brand" href="/">
                <img src="images/logo.png" alt="Logo" />
              </a>
              <button className="navbar-toggler navbar-toggler-main" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="stick"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <button className="navbar-toggler navbar-toggler-main" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                  aria-expanded="false" aria-label="Toggle navigation">
                  <span className="stick"></span>
                </button>
                <ul className="navbar-nav ms-auto">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#plans">Plans</a></li>
                  <li><a href="#who-we-are">Who we are</a></li>
                  <li><a href="#contact-us">Contact us</a></li>
                </ul>
              </div>
              <a href="/login" className="hdr-btn"><span>Customer Login</span></a>
            </nav>
          </div>
        </div>
        <button className="navbar-toggler" id="navoverlay" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation"></button>
      </header>

      <div className="hero-sec">
        <div className="container">
          <div className="hero-inr has-texture">
            <div className="texture">
              <img src="images/lines-texture.png" alt="lines-texture" />
            </div>
            <div className="hero-inr-row row">
              <div className="hero-left-wrp col-lg-8">
                <div className="hero-left">
                  <div className="hero-content">
                    <h1>Simplify Trust Account Reconciliation: Accuracy Meets Automation.</h1>
                    <p className="gr-txt">Save hours on reconciliations with our secure, user-friendly platform
                      tailored for compliance and precision.</p>
                  </div>
                  <div className="hero-btn">
                    <a href="#features" className="cmn-btn">Explore Features</a>
                  </div>
                  <div className="hero-benefits-wrp">
                    <div className="hero-benefit-card">
                      <div className="hero-benefit-card-icon">
                        <img src="images/lock-icon.svg" alt="benefit Icon" />
                      </div>
                      <div className="hero-benefit-card-content">
                        <p>Protected <br />User Credentials</p>
                      </div>
                    </div>
                    <div className="hero-benefit-card">
                      <div className="hero-benefit-card-icon">
                        <img src="images/heart-icon.svg" alt="benefit Icon" />
                      </div>
                      <div className="hero-benefit-card-content">
                        <p>Easy <br />to Use Platform</p>
                      </div>
                    </div>
                    <div className="hero-benefit-card">
                      <div className="hero-benefit-card-icon">
                        <img src="images/time-icon.svg" alt="benefit Icon" />
                      </div>
                      <div className="hero-benefit-card-content">
                        <p>Fast <br />Reconciliation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-right-wrp col-lg-4">
                <div className="hero-right">
                  <div className="hero-img">
                    <img src="./images/hero-img.png" alt="hero-img" />
                  </div>
                  <div className="awards-wrp">
                    <div className="award-content">
                      <div className="award-content-title"><img src="images/electric.png" alt="Image" />Monthly
                        Reporting Made Easy</div>
                      <div className="award-content-desc">
                        <p>Providing consolidated accounting summaries and reconciliation reports at the
                          end of each month.</p>
                      </div>
                    </div>
                    <div className="award-imgs-wrp">
                      <div className="award-img-item" style={{ '--i': 1 }}>
                        <img src="./images/award-02.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 2 }}>
                        <img src="./images/award-3.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 3 }}>
                        <img src="./images/award-4.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 4 }}>
                        <img src="./images/award-5.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 5 }}>
                        <img src="./images/award-1.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 6 }}>
                        <img src="./images/award-02.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 5 }}>
                        <img src="./images/award-1.png" alt="award-img" />
                      </div>
                      <div className="award-img-item" style={{ '--i': 6 }}>
                        <img src="./images/award-02.png" alt="award-img" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-sec" id="features">
        <div className="container">
          <div className="features-inr">
            <div className="sec-head max">
              <h2>What Makes Us Different?</h2>
              <p className="gr-txt">Empowering Trust Accounting with Smart Automation and Compliance</p>
            </div>
            <div className="features-wrp row">
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-1.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>Automated Bank Reconciliation</h3>
                    <p>Effortlessly match accounting records with bank statements every month.</p>
                  </div>
                </div>
              </div>
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-2.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>California Trust Accounting Compliance</h3>
                    <p>Fully aligned with California Rules of Professional Conduct and CTAPP guidelines.</p>
                  </div>
                </div>
              </div>
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-3.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>Monthly Reconciliation Summary</h3>
                    <p>Automatic generation of end-of-month summaries for quick review and audits.</p>
                  </div>
                </div>
              </div>
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-4.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>Manual Data Input with Automation</h3>
                    <p>Flexibility to upload data manually while the system automatically reconciles
                      records.</p>
                  </div>
                </div>
              </div>
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-5.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>Robust Security & Privacy</h3>
                    <p>Ensure sensitive financial data remains secure and confidential.</p>
                  </div>
                </div>
              </div>
              <div className="feature-item">
                <div className="features-item-inr">
                  <div className="features-item-icon">
                    <img src="images/feature-icon-6.png" alt="Feature Icon" />
                  </div>
                  <div className="features-item-content">
                    <h3>Intuitive User Interface</h3>
                    <p>User-friendly design for efficient data entry and management.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="plans-sec cmn-gap" id="plans">
        <div className="container">
          <div className="plans-inr">
            <div className="sec-head">
              <h2>Plans & Pricing</h2>
              <p className="gr-txt">Tailored Solutions for Every Need</p>
            </div>
            <div className="plans-wrp row">
              <div className="plan-item">
                <div className="plan-item-inr">
                  <div className="plan-item-head">
                    <p>Basic</p>
                    <h3 className="price">$100 <span>/month</span></h3>
                  </div>
                  <div className="plan-item-content">
                    <ul>
                      <li><img src="images/check-icon.svg" alt="check-icon" />Includes core features such as
                        client trust account management, reconciliations, and basic reporting.</li>
                      <li><img src="images/check-icon.svg" alt="check-icon" />Includes core features such as
                        client trust account management, reconciliations, and basic reporting.</li>
                    </ul>
                  </div>
                  <div className="plan-item-btn">
                    <a href="/signup" className="blue-btn">Buy now</a>
                  </div>
                </div>
              </div>
              <div className="plan-item popular">
                <div className="popularity">Most popular</div>
                <div className="plan-item-inr">
                  <div className="plan-item-head">
                    <p>Premium</p>
                    <h3 className="price">$299 <span>/month</span></h3>
                  </div>
                  <div className="plan-item-content">
                    <ul>
                      <li><img src="images/check-icon.svg" alt="check-icon" />Includes advanced features
                        like automated notifications, integration with other law practice management
                        software, enhanced security features, and more comprehensive reporting and
                        analytics.</li>
                    </ul>
                  </div>
                  <div className="plan-item-btn">
                    <a href="/signup" className="blue-btn">Buy now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="who-we-are-sec" id="who-we-are">
        <div className="container">
          <div className="who-we-are-inr">
            <div className="sec-head">
              <h2>Who We Are</h2>
              <p className="gr-txt">Committed to Excellence in Trust Accounting Solutions</p>
            </div>
            <div className="who-we-are-row row">
              <div className="who-we-are-left-wrp col-lg-8">
                <div className="who-we-are-left">
                  <p>At [Company Name], we specialize in delivering cutting-edge trust accounting solutions
                    tailored to meet California's strict compliance standards. Our mission is to simplify
                    complex financial processes through intelligent automation, ensuring accuracy, security,
                    and transparency in every transaction. Backed by a team of experts with deep industry
                    knowledge, we’re dedicated to empowering businesses with tools that streamline
                    operations, reduce manual workloads, and build trust with clients.</p>
                  <div className="who-we-are-content-list">
                    <h3>Our Promise:</h3>
                    <ul>
                      <li>Accuracy: Reliable reconciliation and reporting.</li>
                      <li>Compliance: Fully aligned with California Client Trust Accounting guidelines.
                      </li>
                      <li>Innovation: User-friendly technology designed for efficiency.</li>
                      <li>Support: Dedicated assistance whenever you need it</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="who-we-are-right-wrp col-lg-4">
                <div className="who-we-are-right">
                  <div className="blob"></div>
                  <img src="images/who-we-are-img.png" alt="who-we-are-img" />
                </div>
              </div>
            </div>
            <div className="btn-wrp"><a href="#features" className="cmn-btn">Explore Features</a></div>
          </div>
        </div>
      </div>

      <div className="contact-us-sec cmn-gap" id="contact-us">
        <div className="container">
          <div className="contact-us-inr">
            <div className="sec-head">
              <h2>Get in touch</h2>
              <p>Reach out, and let's create a universe of possibilities together!</p>
            </div>
            <div className="contact-us-form-wrp">
              <div className="row">
                <div className="contact-us-form col-lg-6">
                  <div className="contact-us-form-inr">
                    <div className="contact-us-form-title">
                      <h3>Let’s connect </h3>
                      <p>Let’s balance the books and bridge the gaps! Reach out and let the harmony of
                        seamless reconciliation redefine your accounting journey.</p>
                    </div>
                    <form>
                      <div className="row">
                        <div className="form-group">
                          <div className="form-group-inr">
                            <input type="text" placeholder="First Name" required />
                            <input type="text" placeholder="Last Name" required />
                          </div>
                        </div>
                        <div className="form-group">
                          <input type="email" placeholder="Email" required />
                        </div>
                        <div className="form-group">
                          <input type="tel" maxLength="13" minLength="10" placeholder="Phone Number"
                            required />
                        </div>
                        <div className="form-group">
                          <textarea placeholder="Message"></textarea>
                        </div>
                        <div className="form-group">
                          <input type="submit" value="Submit" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="contact-us-form-right col-lg-6">
                  <div className="contact-us-right-img">
                    <p>Let’s build smarter,more secure trust accounting solutions—together!</p>
                    <img src="images/contact-us-img.png" alt="contact-us-img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <div className="footer-inr">
            <a href="/" className="footer-logo">
              <img src="images/logo.png" alt="logo" />
            </a>
            <div className="footer-links">
              <ul>
                <li><a href="/terms-conditions">Terms & Conditions</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-content">
              <p>All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Homepage;
