import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Announcements.css";

function Announcements() {

  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcementType, setAnnouncementType] = useState("General");
  const [isImportant, setIsImportant] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  // ========================================================
  // LOAD ANNOUNCEMENTS
  // ========================================================

  const loadAnnouncements = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/announcements`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Unable to load announcements."
        );
      }

      setAnnouncements(
        Array.isArray(data.announcements)
          ? data.announcements
          : []
      );

    } catch (error) {

      console.error(
        "ANNOUNCEMENTS LOAD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to backend."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadAnnouncements();

  }, []);


  // ========================================================
  // RESET FORM
  // ========================================================

  const resetForm = () => {

    setTitle("");
    setMessage("");
    setAnnouncementType("General");
    setIsImportant(false);
    setEditingId(null);

  };


  // ========================================================
  // CREATE / UPDATE ANNOUNCEMENT
  // ========================================================

  const saveAnnouncement = async (e) => {

    e.preventDefault();

    setSuccess("");
    setError("");

    if (!title.trim()) {

      setError("Please enter an announcement title.");
      return;

    }

    if (!message.trim()) {

      setError("Please enter an announcement message.");
      return;

    }

    try {

      setSaving(true);

      const url = editingId
        ? `${API_BASE_URL}/announcements/${editingId}`
        : `${API_BASE_URL}/announcements`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            title: title.trim(),

            message: message.trim(),

            announcement_type:
              announcementType,

            is_important:
              isImportant

          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Unable to save announcement."
        );

      }


      if (editingId) {

        setSuccess(
          "Announcement updated successfully."
        );

      } else {

        setSuccess(
          "Announcement published successfully."
        );

      }

      resetForm();

      await loadAnnouncements();

    } catch (error) {

      console.error(
        "SAVE ANNOUNCEMENT ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to save announcement."
      );

    } finally {

      setSaving(false);

    }

  };


  // ========================================================
  // EDIT ANNOUNCEMENT
  // ========================================================

  const editAnnouncement = (announcement) => {

    setEditingId(announcement.id);

    setTitle(
      announcement.title || ""
    );

    setMessage(
      announcement.message || ""
    );

    setAnnouncementType(
      announcement.announcement_type ||
      "General"
    );

    setIsImportant(
      Boolean(announcement.is_important)
    );

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ========================================================
  // DELETE ANNOUNCEMENT
  // ========================================================

  const deleteAnnouncement = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setSuccess("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/announcements/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Unable to delete announcement."
        );

      }

      setSuccess(
        "Announcement deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await loadAnnouncements();

    } catch (error) {

      console.error(
        "DELETE ANNOUNCEMENT ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to delete announcement."
      );

    }

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="announcements-admin-page">

      {/* HEADER */}

      <section className="announcement-admin-header">

        <div>

          <span>
            ADMINISTRATION PORTAL
          </span>

          <h1>
            Announcement Management
          </h1>

          <p>
            Create and manage public announcements
            displayed on the CivicConnect homepage.
          </p>

        </div>

      </section>


      {/* SUCCESS */}

      {success && (

        <div className="announcement-success">
          ✓ {success}
        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="announcement-error">
          {error}
        </div>

      )}


      <div className="announcement-admin-layout">


        {/* ==================================================
            CREATE / EDIT FORM
        ================================================== */}

        <section className="announcement-form-card">

          <div className="announcement-section-title">

            <span>
              {editingId
                ? "EDIT ANNOUNCEMENT"
                : "NEW ANNOUNCEMENT"}
            </span>

            <h2>
              {editingId
                ? "Update Announcement"
                : "Create Announcement"}
            </h2>

          </div>


          <form
            onSubmit={saveAnnouncement}
            className="announcement-form"
          >

            {/* TITLE */}

            <div className="announcement-field">

              <label>
                Announcement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter announcement title"
                maxLength={200}
              />

            </div>


            {/* MESSAGE */}

            <div className="announcement-field">

              <label>
                Announcement Message
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Enter announcement details"
                rows="6"
              />

            </div>


            {/* TYPE */}

            <div className="announcement-field">

              <label>
                Announcement Type
              </label>

              <select
                value={announcementType}
                onChange={(e) =>
                  setAnnouncementType(
                    e.target.value
                  )
                }
              >

                <option value="General">
                  General
                </option>

                <option value="Roads">
                  Roads
                </option>

                <option value="Water">
                  Water
                </option>

                <option value="Sanitation">
                  Sanitation
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Drainage">
                  Drainage
                </option>

                <option value="Public Health">
                  Public Health
                </option>

                <option value="Environment">
                  Environment
                </option>

                <option value="Municipality">
                  Municipality
                </option>

              </select>

            </div>


            {/* IMPORTANT */}

            <label className="important-checkbox">

              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) =>
                  setIsImportant(
                    e.target.checked
                  )
                }
              />

              <span>
                Mark as Important
              </span>

            </label>


            {/* BUTTONS */}

            <div className="announcement-form-actions">

              <button
                type="submit"
                className="publish-announcement-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Announcement"
                    : "Publish Announcement"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-announcement-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        {/* ==================================================
            EXISTING ANNOUNCEMENTS
        ================================================== */}

        <section className="announcement-list-section">

          <div className="announcement-section-title">

            <span>
              PUBLISHED NOTICES
            </span>

            <h2>
              Existing Announcements
            </h2>

          </div>


          {loading ? (

            <div className="announcement-empty">

              <h3>
                Loading announcements...
              </h3>

            </div>

          ) : announcements.length === 0 ? (

            <div className="announcement-empty">

              <div>
                📢
              </div>

              <h3>
                No announcements yet
              </h3>

              <p>
                Create your first public announcement.
              </p>

            </div>

          ) : (

            <div className="announcement-list">

              {announcements.map(
                (announcement) => (

                  <article
                    className="announcement-admin-card"
                    key={announcement.id}
                  >

                    <div className="announcement-card-top">

                      <div>

                        <span className="announcement-type">
                          {announcement.announcement_type}
                        </span>

                        <h3>
                          {announcement.title}
                        </h3>

                      </div>


                      {announcement.is_important && (

                        <span className="important-badge">
                          ⭐ Important
                        </span>

                      )}

                    </div>


                    <p>
                      {announcement.message}
                    </p>


                    <div className="announcement-card-footer">

                      <small>
                        {announcement.created_at
                          ? new Date(
                              announcement.created_at
                            ).toLocaleString()
                          : ""}
                      </small>


                      <div className="announcement-card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            editAnnouncement(
                              announcement
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteAnnouncement(
                              announcement.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </div>

  );

}

export default Announcements;