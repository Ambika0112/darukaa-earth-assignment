import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Map from "./Map";
import SiteDetails from "./SiteDetails";
import "./style.css";


const API = import.meta.env.VITE_API_URL;   axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      if (isRegister) {
        // Register
        await axios.post(`${API}/auth/register`, {
          email,
          password,
        });

        alert("Registration successful. Please login.");

        // Switch back to login
        setIsRegister(false);
        setPassword("");
      } else {
        // Login
        const response = await axios.post(`${API}/auth/login`, {
          email,
          password,
        });

        // Save JWT
        localStorage.setItem("token", response.data.access_token);

        alert("Login successful!");

        onLogin();
      }
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.detail || "Something went wrong.";

      alert(message);
    }
  }

  return (
    <div className="login-container">
      <h1>Darukaa Earth</h1>

      <h2>{isRegister ? "Create Account" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsRegister(!isRegister);
          setPassword("");
        }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Create account"}
      </button>
    </div>
  );
}



function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [sites, setSites] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [name, setName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [siteName, setSiteName] = useState("");

  async function loadProjects() {
    const response = await axios.get(`${API}/projects/`);
    setProjects(response.data);
  }

  async function loadSites(projectId) {
    try {
      console.log("Loading sites for project:", projectId);

      const response = await axios.get(
        `${API}/sites/project/${projectId}`
      );

      console.log("Sites received:", response.data);

      setSites(response.data);
    } catch (error) {
      console.error("Could not load sites:", error);
    }
  }

  async function loadAllSites() {
    try {
      const response = await axios.get(`${API}/sites/`);
      console.log("All sites:", response.data);
      setAllSites(response.data);
    } catch (error) {
      console.error("Could not load all sites:", error);
    }
  }

  async function createProject() {
    if (!name.trim()) return;

    await axios.post(`${API}/projects/`, {
      name,
      description: "Environmental restoration project"
    });

    setName("");
    loadProjects();
  }

  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(response.data);
    } catch (error) {
      console.error("Could not load profile:", error);
    }
  }

  async function saveSite() {
    if (!selectedProject || !polygon || !siteName.trim()) {
      alert("Select a project, draw a polygon and enter a site name.");
      return;
    }

    try {
      const response = await axios.post(`${API}/sites/`, {
        project_id: selectedProject.id,
        name: siteName,
        description: "Geographical project site",
        geometry: polygon
      });

      alert(
        `Site created successfully. Area: ${response.data.area_hectares} hectares`
      );

      setSiteName("");
      setPolygon(null);
      loadSites(selectedProject.id);
      loadAllSites();
    } catch (error) {
      console.error(error);
      alert("Could not create site.");
    }
  }

  useEffect(() => {
    loadProjects();
    loadAllSites();
    loadProfile();
  }, []);
  if (selectedSite) {
    return (
      <SiteDetails
        site={selectedSite}
        onBack={() => setSelectedSite(null)}
      />
    );
  }

  return (
    <div>
      <header>
        <div>
          <h1>Darukaa Earth</h1>
          <span>Project Dashboard</span>
        </div>

        <div className="header-actions">
          {profile && (
            <span className="user-email">
              👤 {profile.email}
            </span>
          )}

          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <h2>Environmental Projects</h2>
          <p>Manage carbon and biodiversity sites.</p>
        </section>
        <section className="overview-map">
          <h2>Project & Site Map</h2>
          <p>View all registered environmental sites.</p>

          <Map
            onPolygonCreated={() => { }}
            sites={allSites}
          />
        </section>

        <section className="create">
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={createProject}>
            Create Project
          </button>
        </section>

        <section className="grid">
          {projects.map((project) => (
            <div
              className={`project ${selectedProject?.id === project.id ? "selected" : ""
                }`}
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setPolygon(null);
                setSiteName("");
                loadSites(project.id);
              }}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <small>Project #{project.id}</small>
            </div>
          ))}
        </section>

        {selectedProject && (
          <section className="site-section">

            <h2>Add Site to {selectedProject.name}</h2>

            <p>
              Draw a polygon on the map to create a geographical site.
            </p>

            <Map onPolygonCreated={setPolygon} sites={sites} />

            <div className="site-form">
              <input
                placeholder="Site name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />

              <button onClick={saveSite}>
                Save Site
              </button>
            </div>

            <div className="sites">
              <h3>Sites</h3>

              {sites.length === 0 ? (
                <p>No sites created yet.</p>
              ) : (
                sites.map((site) => (
                  <div className="site-card" key={site.id} onClick={() => setSelectedSite(site)}>
                    <h4>{site.name}</h4>

                    <p>{site.description}</p>

                    <small>
                      Area: {site.area_hectares} hectares
                    </small>
                  </div>
                ))
              )}
            </div>

          </section>
        )}

      </main>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return loggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

createRoot(document.getElementById("root")).render(<App />);
