
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./SubmitComplaint.css";
function SubmitComplaint() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [municipalities, setMunicipalities] = useState([]);

  const [formData, setFormData] = useState({
    municipality_id: "",
    gender: "",
    street_address: "",
    pin_code: "",
    category: "",
    subcategory: "",
    title: "",
    description: "",
    location: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // CHECK CITIZEN LOGIN
  // ============================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("civicconnect_user");

    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      const userId = parsedUser.user_id || parsedUser.id;

      if (!userId) {
        localStorage.removeItem("civicconnect_user");
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid login data:", error);

      localStorage.removeItem("civicconnect_user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ============================================================
  // LOAD MUNICIPALITIES
  // ============================================================

  useEffect(() => {
    const loadMunicipalities = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/municipalities`
        );

        const data = await response.json();

        console.log("Municipalities:", data);

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load municipalities."
          );
        }

        setMunicipalities(data);
      } catch (error) {
        console.error(
          "MUNICIPALITY ERROR:",
          error
        );

        setError(
          "Unable to load municipalities."
        );
      }
    };

    loadMunicipalities();
  }, []);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ============================================================
  // HANDLE IMAGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      image: file,
    }));
  };

  // ============================================================
  // SUBMIT COMPLAINT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ----------------------------------------------------------
    // CHECK LOGIN AGAIN
    // ----------------------------------------------------------

    const storedUser =
      localStorage.getItem("civicconnect_user");

    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    let loggedUser;

    try {
      loggedUser = JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem("civicconnect_user");
      navigate("/login", { replace: true });
      return;
    }

    const userId =
      loggedUser.user_id || loggedUser.id;

    if (!userId) {
      localStorage.removeItem("civicconnect_user");
      navigate("/login", { replace: true });
      return;
    }

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!formData.municipality_id) {
      setError("Please select a municipality.");
      return;
    }

    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!formData.street_address.trim()) {
      setError("Please enter your street address.");
      return;
    }

    if (!formData.pin_code.trim()) {
      setError("Please enter your PIN code.");
      return;
    }

    if (!formData.category) {
      setError("Please select a complaint category.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a complaint title.");
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Please enter the complaint description."
      );
      return;
    }

    // ----------------------------------------------------------
    // FORM DATA
    // ----------------------------------------------------------

    const data = new FormData();

    data.append("user_id", userId);

    data.append(
      "municipality_id",
      formData.municipality_id
    );

    data.append(
      "gender",
      formData.gender
    );

    data.append(
      "street_address",
      formData.street_address.trim()
    );

    data.append(
      "pin_code",
      formData.pin_code.trim()
    );

    data.append(
      "category",
      formData.category
    );

    data.append(
      "subcategory",
      formData.subcategory.trim()
    );

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "description",
      formData.description.trim()
    );

    data.append(
      "location",
      formData.location.trim()
    );

    if (formData.image) {
      data.append(
        "image",
        formData.image
      );
    }

    // ----------------------------------------------------------
    // SEND TO FLASK
    // ----------------------------------------------------------

    try {
      setLoading(true);

      console.log(
        "Submitting complaint for user:",
        userId
      );

      const response = await fetch(
        `${API_BASE_URL}/complaint`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      console.log(
        "Complaint response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.error ||
          result.message ||
          "Unable to submit complaint."
        );
      }

      setMessage(
        `Complaint submitted successfully! Complaint ID: ${result.complaint_id}`
      );

      // --------------------------------------------------------
      // CLEAR FORM
      // --------------------------------------------------------

      setFormData({
        municipality_id: "",
        gender: "",
        street_address: "",
        pin_code: "",
        category: "",
        subcategory: "",
        title: "",
        description: "",
        location: "",
        image: null,
      });

      const imageInput =
        document.getElementById(
          "complaint-image"
        );

      if (imageInput) {
        imageInput.value = "";
      }

    } catch (error) {
      console.error(
        "COMPLAINT SUBMISSION ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to submit complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // WAIT FOR LOGIN CHECK
  // ============================================================

  if (!user) {
    return null;
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="submit-complaint-page">

      <div className="submit-complaint-header">

        <div>
          <span>CIVICCONNECT</span>

          <h1>Submit a Complaint</h1>

          <p>
            Report a civic issue to your local municipality.
          </p>
        </div>

        <div className="submit-user-info">
          <strong>
            {user.name || "Citizen"}
          </strong>

          <small>
            {user.email || ""}
          </small>
        </div>

      </div>

      {message && (
        <div className="complaint-success">
          {message}
        </div>
      )}

      {error && (
        <div className="complaint-error">
          {error}
        </div>
      )}

      <form
        className="complaint-form"
        onSubmit={handleSubmit}
      >

        {/* MUNICIPALITY */}

        <div className="form-group">

          <label>
            Municipality *
          </label>

          <select
            name="municipality_id"
            value={formData.municipality_id}
            onChange={handleChange}
          >

            <option value="">
              Select Municipality
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

        </div>

        {/* GENDER */}

        <div className="form-group">

          <label>
            Gender *
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >

            <option value="">
              Select Gender
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

          </select>

        </div>

        {/* STREET ADDRESS */}

        <div className="form-group">

          <label>
            Street Address *
          </label>

          <input
            type="text"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            placeholder="Enter street address"
          />

        </div>

        {/* PIN CODE */}

        <div className="form-group">

          <label>
            PIN Code *
          </label>

          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            placeholder="Enter PIN code"
            maxLength="6"
          />

        </div>

        {/* CATEGORY */}

        <div className="form-group">

          <label>
            Complaint Category *
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >

            <option value="">
              Select Category
            </option>

            <option value="Waste Management">
              Waste Management
            </option>

            <option value="Roads and Footpaths">
              Roads and Footpaths
            </option>

            <option value="Storm Water Drainage">
              Storm Water Drainage
            </option>

            <option value="Street Lighting / Electrical">
              Street Lighting / Electrical
            </option>

            <option value="Water Supply">
              Water Supply
            </option>

            <option value="Public Health">
              Public Health
            </option>

            <option value="Parks and Playgrounds">
              Parks and Playgrounds
            </option>

            <option value="Trees and Environment">
              Trees and Environment
            </option>

            <option value="Buildings and Construction">
              Buildings and Construction
            </option>

            <option value="Revenue / Tax / Licensing">
              Revenue / Tax / Licensing
            </option>

            <option value="Public Facilities">
              Public Facilities
            </option>

            <option value="Education">
              Education
            </option>

            <option value="General">
              General
            </option>

          </select>

        </div>

        {/* SUBCATEGORY */}

        <div className="form-group">

          <label>
            Subcategory
          </label>

          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            placeholder="Enter subcategory"
          />

        </div>

        {/* TITLE */}

        <div className="form-group">

          <label>
            Complaint Title *
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter complaint title"
          />

        </div>

        {/* DESCRIPTION */}

        <div className="form-group">

          <label>
            Complaint Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the civic issue"
            rows="5"
          />

        </div>

        {/* LOCATION */}

        <div className="form-group">

          <label>
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter exact location"
          />

        </div>

        {/* IMAGE */}

        <div className="form-group">

          <label>
            Upload Image
          </label>

          <input
            id="complaint-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

        </div>

        {/* BUTTONS */}

        <div className="complaint-buttons">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Complaint"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default SubmitComplaint;

