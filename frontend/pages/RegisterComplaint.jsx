import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";

function RegisterComplaint() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [municipalities, setMunicipalities] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    municipality_id: "",
    department_id: "",
    gender: "",
    street_address: "",
    pin_code: "",
    category: "",
    subcategory: "",
    title: "",
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [complaintId, setComplaintId] = useState("");

  // =====================================================
  // COMPLAINT CATEGORIES
  // =====================================================

  const complaintCategories = {
    "Waste Management": {
      department: "Sanitation Department",
      problems: [
        "Garbage not collected",
        "Overflowing garbage bin",
        "Garbage dumped on road",
        "Waste collection problem",
        "Wet waste problem",
        "Dry waste problem",
        "Plastic waste",
        "Construction waste",
        "Garden waste",
        "Garbage burning",
        "Littering",
        "Waste segregation problem",
        "Broken garbage bin",
        "Illegal dumping",
        "Dead animal removal",
      ],
    },

    "Roads and Footpaths": {
      department: "Roads Department",
      problems: [
        "Pothole",
        "Damaged road",
        "Broken footpath",
        "Road debris",
        "Road obstruction",
        "Damaged divider",
        "Broken manhole cover",
        "Missing road sign",
        "Unsafe road condition",
        "Road cave-in",
      ],
    },

    "Storm Water Drainage": {
      department: "Drainage Department",
      problems: [
        "Drain blockage",
        "Drain overflow",
        "Stagnant water",
        "Open drain",
        "Damaged drain",
        "Missing drain cover",
        "Flooding",
        "Water flow obstruction",
      ],
    },

    "Street Lighting / Electrical": {
      department: "Electricity Department",
      problems: [
        "Street light not working",
        "Broken street light",
        "Flickering street light",
        "Dark street",
        "Damaged electric pole",
        "Exposed electrical wire",
        "Electrical hazard",
      ],
    },

    "Water Supply": {
      department: "Water Supply Department",
      problems: [
        "No water supply",
        "Low water pressure",
        "Water leakage",
        "Pipeline leakage",
        "Broken water pipe",
        "Contaminated water",
        "Illegal water connection",
      ],
    },

    "Public Health": {
      department: "Public Health Department",
      problems: [
        "Mosquito problem",
        "Stagnant water",
        "Unhygienic public area",
        "Public toilet problem",
        "Sanitation issue",
        "Stray animal issue",
        "Public health hazard",
      ],
    },

    "Parks and Playgrounds": {
      department: "Parks and Recreation Department",
      problems: [
        "Park maintenance",
        "Broken playground equipment",
        "Broken benches",
        "Broken fencing",
        "Poor lighting",
        "Garbage in park",
        "Damaged walking path",
        "Unsafe playground",
      ],
    },

    "Trees and Environment": {
      department: "Environment Department",
      problems: [
        "Fallen tree",
        "Dangerous tree",
        "Tree branch obstruction",
        "Illegal tree cutting",
        "Environmental pollution",
        "Open burning",
      ],
    },

    "Buildings and Construction": {
      department: "Town Planning Department",
      problems: [
        "Illegal construction",
        "Unauthorized building",
        "Unsafe building",
        "Construction debris",
        "Encroachment",
        "Building obstruction",
      ],
    },

    "Revenue / Tax / Licensing": {
      department: "Revenue Department",
      problems: [
        "Property tax issue",
        "Professional tax issue",
        "Trade license issue",
        "Tax payment problem",
        "Incorrect tax information",
        "License renewal issue",
      ],
    },

    "Public Facilities": {
      department: "Public Facilities Department",
      problems: [
        "Public toilet",
        "Community hall",
        "Public building",
        "Drinking water",
        "Public facility maintenance",
      ],
    },

    "Education": {
      department: "Education Department",
      problems: [
        "Municipal school issue",
        "School infrastructure issue",
        "School sanitation issue",
        "School facility problem",
      ],
    },

    "General": {
      department: "General Administration Department",
      problems: [
        "Other civic issue",
        "General municipal complaint",
      ],
    },
  };

  // =====================================================
  // LOAD USER / MUNICIPALITIES / DEPARTMENTS
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      setError("");

      try {
        // ---------------------------------------------
        // GET LOGGED-IN USER
        // ---------------------------------------------

        const storedUser =
          localStorage.getItem("civicconnect_user");

        if (!storedUser) {
          setError(
            "Please login before submitting a complaint."
          );
          return;
        }

        let parsedUser;

        try {
          parsedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error(
            "Invalid local storage user:",
            parseError
          );

          localStorage.removeItem(
            "civicconnect_user"
          );

          setError(
            "Your login session is invalid. Please login again."
          );

          return;
        }

        if (!parsedUser.user_id) {
          setError(
            "Your login session is invalid. Please login again."
          );
          return;
        }

        // Initial user data
        setUser(parsedUser);

        // ---------------------------------------------
        // REFRESH USER FROM DATABASE
        // ---------------------------------------------

        try {
          const userResponse = await fetch(
            `${API_BASE_URL}/user/${parsedUser.user_id}`
          );

          if (userResponse.ok) {
            const userData =
              await userResponse.json();

            setUser({
              ...parsedUser,
              user_id: userData.id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone || "",
            });
          }
        } catch (userError) {
          console.log(
            "Could not refresh user data:",
            userError
          );
        }

        // ---------------------------------------------
        // MUNICIPALITIES
        // ---------------------------------------------

        const municipalityResponse =
          await fetch(
            `${API_BASE_URL}/municipalities`
          );

        if (!municipalityResponse.ok) {
          throw new Error(
            "Unable to load municipalities."
          );
        }

        const municipalityData =
          await municipalityResponse.json();

        setMunicipalities(
          Array.isArray(municipalityData)
            ? municipalityData
            : []
        );

        // ---------------------------------------------
        // DEPARTMENTS
        // ---------------------------------------------

        const departmentResponse =
          await fetch(
            `${API_BASE_URL}/departments`
          );

        if (!departmentResponse.ok) {
          throw new Error(
            "Unable to load departments."
          );
        }

        const departmentData =
          await departmentResponse.json();

        setDepartments(
          Array.isArray(departmentData)
            ? departmentData
            : []
        );
      } catch (err) {
        console.error(
          "Load complaint data error:",
          err
        );

        setError(
          "Unable to load complaint information. Please make sure the backend is running."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // =====================================================
  // FIND DEPARTMENT ID
  // =====================================================

  const getDepartmentId = (departmentName) => {
    if (!departmentName) {
      return "";
    }

    const department = departments.find(
      (item) =>
        item.department_name?.trim().toLowerCase() ===
        departmentName.trim().toLowerCase()
    );

    return department
      ? String(department.department_id)
      : "";
  };

  // =====================================================
  // CURRENT PROBLEMS
  // =====================================================

  const availableProblems = useMemo(() => {
    if (!formData.category) {
      return [];
    }

    return (
      complaintCategories[
        formData.category
      ]?.problems || []
    );
  }, [formData.category]);

  // =====================================================
  // CHANGE HANDLER
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setSuccess("");

    // ---------------------------------------------
    // CATEGORY
    // ---------------------------------------------

    if (name === "category") {
      const categoryData =
        complaintCategories[value];

      const departmentId = categoryData
        ? getDepartmentId(categoryData.department)
        : "";

      setFormData((previous) => ({
        ...previous,
        category: value,
        department_id: departmentId,
        subcategory: "",
        title: "",
      }));

      return;
    }

    // ---------------------------------------------
    // SUBCATEGORY
    // ---------------------------------------------

    if (name === "subcategory") {
      setFormData((previous) => ({
        ...previous,
        subcategory: value,
        title: value,
      }));

      return;
    }

    // ---------------------------------------------
    // NORMAL FIELDS
    // ---------------------------------------------

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const selectedImage =
      e.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    // Check image type
    if (
      !selectedImage.type.startsWith("image/")
    ) {
      setError(
        "Please upload a valid image file."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    // Maximum 5 MB
    if (
      selectedImage.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      setImage(null);

      return;
    }

    setImage(selectedImage);
    setError("");
  };

  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setComplaintId("");

    // ---------------------------------------------
    // USER
    // ---------------------------------------------

    if (!user?.user_id) {
      setError(
        "Please login before submitting a complaint."
      );
      return;
    }

    // ---------------------------------------------
    // MUNICIPALITY
    // ---------------------------------------------

    if (!formData.municipality_id) {
      setError(
        "Please select your municipality."
      );
      return;
    }

    // ---------------------------------------------
    // GENDER
    // ---------------------------------------------

    if (!formData.gender) {
      setError(
        "Please select your gender."
      );
      return;
    }

    // ---------------------------------------------
    // ADDRESS
    // ---------------------------------------------

    if (
      !formData.street_address.trim()
    ) {
      setError(
        "Please enter your street address."
      );
      return;
    }

    // ---------------------------------------------
    // PIN
    // ---------------------------------------------

    if (
      !/^\d{6}$/.test(
        formData.pin_code
      )
    ) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    // ---------------------------------------------
    // CATEGORY
    // ---------------------------------------------

    if (!formData.category) {
      setError(
        "Please select a complaint category."
      );
      return;
    }

    // ---------------------------------------------
    // DEPARTMENT
    // ---------------------------------------------

   

    // ---------------------------------------------
    // SUBCATEGORY
    // ---------------------------------------------

    if (!formData.subcategory) {
      setError(
        "Please select the specific problem."
      );
      return;
    }

    // ---------------------------------------------
    // TITLE
    // ---------------------------------------------

    if (!formData.title.trim()) {
      setError(
        "Please enter a complaint title."
      );
      return;
    }

    // ---------------------------------------------
    // DESCRIPTION
    // ---------------------------------------------

    if (
      !formData.description.trim()
    ) {
      setError(
        "Please describe the civic issue."
      );
      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------------
      // FORM DATA
      // ---------------------------------------------

      const dataToSend = new FormData();

      dataToSend.append(
        "user_id",
        String(user.user_id)
      );

      dataToSend.append(
        "municipality_id",
        String(
          formData.municipality_id
        )
      );

      dataToSend.append(
        "department_id",
        String(
          formData.department_id
        )
      );

      dataToSend.append(
        "gender",
        formData.gender
      );

      dataToSend.append(
        "street_address",
        formData.street_address.trim()
      );

      dataToSend.append(
        "pin_code",
        formData.pin_code
      );

      dataToSend.append(
        "category",
        formData.category
      );

      dataToSend.append(
        "subcategory",
        formData.subcategory
      );

      dataToSend.append(
        "title",
        formData.title.trim()
      );

      dataToSend.append(
        "description",
        formData.description.trim()
      );

      dataToSend.append(
        "location",
        `${formData.street_address.trim()}, PIN ${formData.pin_code}`
      );

      // ---------------------------------------------
      // IMAGE
      // ---------------------------------------------

      if (image) {
        dataToSend.append(
          "image",
          image
        );
      }

      // ---------------------------------------------
      // SEND TO FLASK
      // ---------------------------------------------

      const response = await fetch(
        `${API_BASE_URL}/complaint`,
        {
          method: "POST",
          body: dataToSend,
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to submit complaint."
        );
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setComplaintId(
        data.complaint_id
      );

      setSuccess(
        "Your complaint has been submitted successfully!"
      );

      // ---------------------------------------------
      // CLEAR FORM
      // ---------------------------------------------

      setFormData({
        municipality_id: "",
        department_id: "",
        gender: "",
        street_address: "",
        pin_code: "",
        category: "",
        subcategory: "",
        title: "",
        description: "",
        location: "",
      });

      setImage(null);

      const imageInput =
        document.getElementById(
          "complaint-image"
        );

      if (imageInput) {
        imageInput.value = "";
      }

      // Scroll to success message
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Complaint submission error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingData) {
    return (
      <main className="complaint-page">
        <section className="loading-section">
          <div className="loading-card">
            <div className="loading-icon">
              ⏳
            </div>

            <h2>
              Loading Complaint Form
            </h2>

            <p>
              Please wait while we load
              the required information.
            </p>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="complaint-page">

      {/* ============================================
          HEADER
      ============================================ */}

      <section className="inner-page-header">
        <div>
          <span>
            PUBLIC GRIEVANCE SERVICE
          </span>

          <h1>
            Register a Complaint
          </h1>

          <p>
            Report a civic issue to the
            concerned government department.
          </p>
        </div>
      </section>

      {/* ============================================
          FORM SECTION
      ============================================ */}

      <section className="complaint-section">

        <div className="complaint-layout">

          {/* ==========================================
              LEFT INFORMATION
          ========================================== */}

          <aside className="complaint-info">

            <div className="info-card">
              <div className="info-icon">
                📝
              </div>

              <h3>
                Report an Issue
              </h3>

              <p>
                Provide complete and accurate
                information about the civic
                issue.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                📍
              </div>

              <h3>
                Accurate Location
              </h3>

              <p>
                Give the exact street address
                and PIN code so the department
                can locate the issue.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                🔎
              </div>

              <h3>
                Track Your Complaint
              </h3>

              <p>
                After submission, your complaint
                can be tracked using the Complaint
                ID.
              </p>
            </div>

          </aside>

          {/* ==========================================
              FORM CONTAINER
          ========================================== */}

          <div className="complaint-form-container">

            <div className="complaint-form-header">

              <span>
                COMPLAINT DETAILS
              </span>

              <h2>
                Submit Your Complaint
              </h2>

              <p>
                Your registered account details
                are filled automatically.
              </p>

            </div>

            {/* ========================================
                ERROR
            ======================================== */}

            {error && (
              <div className="auth-message error-message">
                {error}
              </div>
            )}

            {/* ========================================
                SUCCESS
            ======================================== */}

            {success && (
              <div className="auth-message success-message">

                <strong>
                  {success}
                </strong>

                {complaintId && (
                  <>
                    <p>
                      Your Complaint ID is:
                      <strong>
                        {" "}
                        #{complaintId}
                      </strong>
                    </p>

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() =>
                        navigate(
                          `/track-complaint/${complaintId}`
                        )
                      }
                    >
                      Track Complaint
                    </button>
                  </>
                )}

              </div>
            )}

            {/* ========================================
                FORM
            ======================================== */}

            <form
              onSubmit={handleSubmit}
              className="complaint-form"
            >

              {/* ======================================
                  FULL NAME
              ====================================== */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={
                    user?.name || ""
                  }
                  readOnly
                  className="readonly-input"
                />

              </div>

              {/* ======================================
                  EMAIL
              ====================================== */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={
                    user?.email || ""
                  }
                  readOnly
                  className="readonly-input"
                />

              </div>

              {/* ======================================
                  PHONE
              ====================================== */}

              <div className="form-group">

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  value={
                    user?.phone || ""
                  }
                  readOnly
                  className="readonly-input"
                />

              </div>

              {/* ======================================
                  MUNICIPALITY
              ====================================== */}

              <div className="form-group">

                <label htmlFor="municipality_id">
                  Municipality
                </label>

                <select
                  id="municipality_id"
                  name="municipality_id"
                  value={
                    formData.municipality_id
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select municipality
                  </option>

                  {municipalities.map(
                    (municipality) => (
                      <option
                        key={
                          municipality.municipality_id
                        }
                        value={
                          municipality.municipality_id
                        }
                      >
                        {
                          municipality.municipality_name
                        }
                      </option>
                    )
                  )}

                </select>

                {municipalities.length === 0 && (
                  <small>
                    No municipality has been
                    added to the database yet.
                  </small>
                )}

              </div>

              {/* ======================================
                  GENDER
              ====================================== */}

              <div className="form-group">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={
                    formData.gender
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>

                </select>

              </div>

              {/* ======================================
                  STREET ADDRESS
              ====================================== */}

              <div className="form-group">

                <label htmlFor="street_address">
                  Street Address
                </label>

                <input
                  id="street_address"
                  name="street_address"
                  type="text"
                  placeholder="Enter your street / area"
                  value={
                    formData.street_address
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ======================================
                  PIN CODE
              ====================================== */}

              <div className="form-group">

                <label htmlFor="pin_code">
                  PIN Code
                </label>

                <input
                  id="pin_code"
                  name="pin_code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={
                    formData.pin_code
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ======================================
                  CATEGORY
              ====================================== */}

              <div className="form-group">

                <label htmlFor="category">
                  Complaint Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select complaint category
                  </option>

                  {Object.keys(
                    complaintCategories
                  ).map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* ======================================
                  SUBCATEGORY
              ====================================== */}

              <div className="form-group">

                <label htmlFor="subcategory">
                  Specific Problem
                </label>

                <select
                  id="subcategory"
                  name="subcategory"
                  value={
                    formData.subcategory
                  }
                  onChange={handleChange}
                  disabled={
                    !formData.category
                  }
                  required
                >

                  <option value="">
                    {formData.category
                      ? "Select specific problem"
                      : "Select category first"}
                  </option>

                  {availableProblems.map(
                    (problem) => (
                      <option
                        key={problem}
                        value={problem}
                      >
                        {problem}
                      </option>
                    )
                  )}

                </select>

              </div>

              

              {/* ======================================
                  TITLE
              ====================================== */}

              <div className="form-group">

                <label htmlFor="title">
                  Complaint Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Complaint title"
                  value={
                    formData.title
                  }
                  onChange={handleChange}
                  required
                />

                <small>
                  The title is automatically
                  filled from the selected
                  problem. You can edit it.
                </small>

              </div>

              {/* ======================================
                  DESCRIPTION
              ====================================== */}

              <div className="form-group">

                <label htmlFor="description">
                  Complaint Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Describe the civic issue clearly..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ======================================
                  IMAGE
              ====================================== */}

              <div className="form-group">

                <label htmlFor="complaint-image">
                  Upload Complaint Picture
                </label>

                <input
                  id="complaint-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

                <small>
                  Upload a clear picture of the
                  civic issue. Maximum size: 5 MB.
                </small>

                {image && (
                  <p>
                    Selected image:{" "}
                    <strong>
                      {image.name}
                    </strong>
                  </p>
                )}

              </div>

              {/* ======================================
                  SUBMIT
              ====================================== */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Submitting Complaint..."
                  : "Submit Complaint"}
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default RegisterComplaint;