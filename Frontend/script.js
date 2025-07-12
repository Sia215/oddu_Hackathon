
// Function to get users from localStorage or initialize an empty array
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

// Function to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Function to get the currently logged-in user's email
const getLoggedInUserEmail = () => localStorage.getItem("loggedInUserEmail");

// Function to set the logged-in user's email
const setLoggedInUserEmail = (email) => {
  localStorage.setItem("loggedInUserEmail", email);
};

// Function to remove the logged-in user's email (logout)
const removeLoggedInUserEmail = () => {
  localStorage.removeItem("loggedInUserEmail");
};

// Function to display a custom alert message (instead of native alert)
function showMessage(message, type = "info") {
  const messageBox = document.createElement("div");
  messageBox.className = `message-box ${type}`;
  messageBox.innerText = message;
  document.body.appendChild(messageBox);

  // Basic styling for the message box
  messageBox.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  if (type === "success") {
    messageBox.style.backgroundColor = "#28a745";
  } else if (type === "error") {
    messageBox.style.backgroundColor = "#dc3545";
  } else {
    messageBox.style.backgroundColor = "#007bff"; // Info color
  }

  // Fade in
  setTimeout(() => {
    messageBox.style.opacity = 1;
  }, 10);

  // Fade out and remove after 3 seconds
  setTimeout(() => {
    messageBox.style.opacity = 0;
    messageBox.addEventListener('transitionend', () => messageBox.remove());
  }, 3000);
}


// --- Global functions for event listeners ---

// Handles request button click on home.html
window.handleRequest = function(userId) {
  const loggedInUserEmail = getLoggedInUserEmail();
  if (!loggedInUserEmail) {
    showMessage("Please login to send a request.", "error");
    window.location.href = "login.html";
  } else {
    // Store the ID of the user whose profile is being requested
    localStorage.setItem("requestTargetUserId", userId);
    window.location.href = "profile.html?user=" + userId;
  }
};

// Accepts a swap request
window.acceptRequest = function(targetUserId, requestIndex) {
  let users = getUsers();
  const targetUser = users.find(u => u.id === targetUserId);

  if (targetUser && targetUser.requests && targetUser.requests[requestIndex]) {
    targetUser.requests[requestIndex].status = "accepted";
    // Optionally, implement skill swap logic here if needed
    // For now, just update the status
    saveUsers(users);
    showMessage("Request accepted!", "success");
    renderRequests(targetUser); // Re-render requests for the current user
  }
};

// Rejects a swap request
window.rejectRequest = function(targetUserId, requestIndex) {
  let users = getUsers();
  const targetUser = users.find(u => u.id === targetUserId);

  if (targetUser && targetUser.requests && targetUser.requests[requestIndex]) {
    targetUser.requests[requestIndex].status = "rejected";
    saveUsers(users);
    showMessage("Request rejected.", "info");
    renderRequests(targetUser); // Re-render requests for the current user
  }
};

// Deletes a swap request (only if not accepted)
window.deleteRequest = function(targetUserId, requestIndex) {
    let users = getUsers();
    const targetUser = users.find(u => u.id === targetUserId);

    if (targetUser && targetUser.requests && targetUser.requests[requestIndex]) {
        if (targetUser.requests[requestIndex].status !== "accepted") {
            targetUser.requests.splice(requestIndex, 1); // Remove the request
            saveUsers(users);
            showMessage("Request deleted successfully.", "info");
            renderRequests(targetUser); // Re-render requests
        } else {
            showMessage("Accepted requests cannot be deleted.", "error");
        }
    }
};

// Function to delete a single user profile (only the logged-in user's own profile)
// This function is kept for potential use on the profile page or for debugging,
// but the button on the home page is removed.
window.deleteProfile = function(userIdToDelete) {
  const confirmDelete = (callback) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
        z-index: 1001;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Are you sure you want to delete this profile? This action cannot be undone.</p>
            <button id="confirmYes" style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Yes, Delete</button>
            <button id="confirmNo" style="background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">No, Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("confirmYes").onclick = () => { modal.remove(); callback(true); };
    document.getElementById("confirmNo").onclick = () => { modal.remove(); callback(false); };
  };

  confirmDelete((result) => {
    if (result) {
      let users = getUsers();
      const loggedInUserEmail = getLoggedInUserEmail();
      const userToDelete = users.find(u => u.id === userIdToDelete);

      if (userToDelete && userToDelete.email === loggedInUserEmail) {
        // Filter out the user to be deleted
        users = users.filter(user => user.id !== userIdToDelete);
        saveUsers(users);
        removeLoggedInUserEmail(); // Log out the user after deleting their profile
        showMessage("Profile deleted successfully. Redirecting to login.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        showMessage("You can only delete your own profile.", "error");
      }
    }
  });
};

// Function to clear ALL user profiles from localStorage
// This function is kept for potential debugging/resetting purposes,
// but the button on the home page is removed.
window.clearAllProfiles = function() {
  const confirmClear = (callback) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
        z-index: 1001;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">Are you sure you want to delete ALL profiles? This will reset all data.</p>
            <button id="confirmYes" style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Yes, Clear All</button>
            <button id="confirmNo" style="background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">No, Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("confirmYes").onclick = () => { modal.remove(); callback(true); };
    document.getElementById("confirmNo").onclick = () => { modal.remove(); callback(false); };
  };

  confirmClear((result) => {
    if (result) {
      localStorage.removeItem("users"); // Remove all users
      removeLoggedInUserEmail(); // Ensure no one is logged in
      showMessage("All profiles cleared successfully. Redirecting to login.", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }
  });
};


// --- DOMContentLoaded Event Listener ---
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  // --- Login/Register Page Logic (login.html) ---
  if (path.includes("login.html")) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const registerNowLink = document.getElementById("registerNow");
    const loginNowLink = document.getElementById("loginNow");

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        let users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          setLoggedInUserEmail(email);
          showMessage("Login successful!", "success");
          window.location.href = "home.html";
        } else {
          showMessage("Invalid email or password.", "error");
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const skills = document.getElementById("regSkills").value.split(",").map(s => s.trim()).filter(s => s !== "");
        const availability = document.getElementById("regAvailability").value.trim();
        const location = document.getElementById("regLocation").value.trim();
        const bio = document.getElementById("regBio").value.trim();

        if (!name || !email || !password || !skills.length || !availability || !location || !bio) {
          showMessage("Please fill all required fields for registration.", "error");
          return;
        }

        let users = getUsers();
        if (users.some(u => u.email === email)) {
          showMessage("An account with this email already exists.", "error");
          return;
        }

        const newUser = {
          id: Date.now(), // Unique ID for the user
          name,
          email,
          password, // In a real app, hash this password!
          image: "https://placehold.co/60x60/cccccc/333333?text=User", // Default placeholder image
          rating: 0, // Initial rating
          skills,
          availability,
          location,
          bio,
          requests: [] // Array to store incoming swap requests
        };
        users.push(newUser);
        saveUsers(users);
        showMessage("Registration successful! Please login.", "success");
        // Switch back to login form after successful registration
        loginForm.style.display = "flex";
        registerForm.style.display = "none";
      });
    }

    if (registerNowLink) {
      registerNowLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "flex";
      });
    }

    if (loginNowLink) {
      loginNowLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "flex";
        registerForm.style.display = "none";
      });
    }
  }

  // --- Home Page Logic (home.html) ---
  if (path.includes("home.html")) {
    const userCardsContainer = document.getElementById("userCards");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const availabilityFilter = document.getElementById("availabilityFilter");
    const addProfileBtn = document.getElementById("addProfileBtn");
    // const clearAllProfilesBtn = document.getElementById("clearAllProfilesBtn"); // Removed this button from HTML

    // Redirect to login if not logged in
    if (!getLoggedInUserEmail()) {
      window.location.href = "login.html";
      return; // Stop further execution
    }

    // Function to render user cards
    function renderUsers(userList) {
      userCardsContainer.innerHTML = "";
      // const loggedInUserEmail = getLoggedInUserEmail(); // No longer needed for conditional button

      userList.forEach(user => {
        const card = document.createElement("div");
        card.className = "card";
        // Added onerror to the img tag to provide a fallback placeholder image
        card.innerHTML = `
          <img src="${user.image}" class="profile-img" alt="Profile Photo of ${user.name}" onerror="this.onerror=null;this.src='https://placehold.co/60x60/cccccc/333333?text=User';">
          <div class="user-details">
            <h3>${user.name}</h3>
            <p>${user.location}</p>
            <div class="skills">${user.skills.map(skill => `<span>${skill}</span>`).join(" ")}</div>
            <div class="card-footer">
              <div class="rating">⭐ ${user.rating}</div>
              <button class="request-btn" onclick="handleRequest(${user.id})">Request Swap</button>
            </div>
          </div>`;
        userCardsContainer.appendChild(card);
      });

      if (userCardsContainer.innerHTML === "") {
        userCardsContainer.innerHTML = "<p style='text-align: center; width: 100%;'>No users found matching your criteria.</p>";
      }
    }

    // Initial render of all users
    renderUsers(getUsers());

    // Search and Filter functionality
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const filter = availabilityFilter.value;
        let users = getUsers();

        const filtered = users.filter(user => {
          const nameMatch = user.name.toLowerCase().includes(keyword);
          const skillMatch = user.skills.some(skill => skill.toLowerCase().includes(keyword));
          const availabilityMatch = filter === "" || user.availability === filter;

          return (nameMatch || skillMatch) && availabilityMatch;
        });
        renderUsers(filtered);
      });
    }

    // Add New Profile button
    if (addProfileBtn) {
      addProfileBtn.addEventListener("click", () => {
        // Redirect to profile page for adding a new profile (no user ID in URL)
        window.location.href = "profile.html";
      });
    }

    // Event listener for Clear All Profiles button (removed from HTML, so this block is effectively inactive)
    // if (clearAllProfilesBtn) {
    //   clearAllProfilesBtn.addEventListener("click", () => {
    //     window.clearAllProfiles(); // Call the global function
    //   });
    // }
  }

  // --- Profile Page Logic (profile.html) ---
  if (path.includes("profile.html")) {
    const profileBox = document.getElementById("profileBox");
    const logoutBtn = document.getElementById("logoutBtn");
    const loggedInUserEmail = getLoggedInUserEmail();
    let users = getUsers();
    let currentUser = null; // This will be the user whose profile is displayed/edited

    // Determine which user's profile to display/edit
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = parseInt(urlParams.get("user")); // User ID if viewing another's profile
    const requestTargetUserId = parseInt(localStorage.getItem("requestTargetUserId")); // User ID if coming from a request

    if (targetUserId) {
        // Viewing another user's profile (from home page request)
        currentUser = users.find(u => u.id === targetUserId);
    } else if (loggedInUserEmail) {
        // Viewing logged-in user's own profile or adding a new profile
        currentUser = users.find(u => u.email === loggedInUserEmail);
        if (!currentUser) {
            // If logged in but no profile, allow creating a new one
            renderProfileForm(null); // Render empty form for new profile
            return;
        }
    } else {
        // Not logged in and no target user specified, redirect to login
        window.location.href = "login.html";
        return;
    }

    // Render the profile or form
    if (currentUser) {
      if (currentUser.email === loggedInUserEmail) {
        // Logged-in user viewing their own profile (editable)
        renderProfileForm(currentUser);
        // If there was a pending request, show the message box for sending a request
        if (requestTargetUserId && requestTargetUserId !== currentUser.id) {
            const targetUserForRequest = users.find(u => u.id === requestTargetUserId);
            if (targetUserForRequest) {
                renderSendRequestSection(targetUserForRequest);
            }
            localStorage.removeItem("requestTargetUserId"); // Clear the stored ID
        }
      } else {
        // Logged-in user viewing another user's profile (read-only + send request)
        renderReadOnlyProfile(currentUser);
        renderSendRequestSection(currentUser);
      }
    } else if (targetUserId && !currentUser) {
        // If a target user ID was provided but not found
        profileBox.innerHTML = "<p>User not found.</p>";
    }


    // Function to render the profile form (for logged-in user to edit/create)
    function renderProfileForm(user) {
      profileBox.innerHTML = `
        <div class="profile-left">
          <h2>${user ? 'Edit Your Profile' : 'Create New Profile'}</h2>
          <label for="nameInput">Name</label>
          <input type="text" id="nameInput" value="${user ? user.name : ''}" placeholder="Your Name" required>

          <label for="imageUpload">Profile Image</label>
          <input type="file" id="imageUpload" accept="image/*">
          ${user && user.image ? `<img src="${user.image}" alt="Current Profile Photo" class="profile-img-preview" style="max-width: 100px; max-height: 100px; border-radius: 8px; margin-top: 10px; display: block;">` : ''}


          <label for="ratingInput">Rating (1-5)</label>
          <input type="number" id="ratingInput" value="${user ? user.rating : 0}" min="0" max="5" step="0.1">

          <label for="skillsInput">Skills Offered (comma-separated)</label>
          <input type="text" id="skillsInput" value="${user ? user.skills.join(', ') : ''}" placeholder="e.g., Photoshop, Web Design" required>

          <label for="availabilityInput">Availability</label>
          <select id="availabilityInput" required>
            <option value="">Select Availability</option>
            <option value="Weekends" ${user && user.availability === 'Weekends' ? 'selected' : ''}>Weekends</option>
            <option value="Weekdays" ${user && user.availability === 'Weekdays' ? 'selected' : ''}>Weekdays</option>
            <option value="Evenings" ${user && user.availability === 'Evenings' ? 'selected' : ''}>Evenings</option>
          </select>

          <label for="locationInput">Location</label>
          <input type="text" id="locationInput" value="${user ? user.location : ''}" placeholder="Your city/region" required>

          <label for="bioInput">Bio</label>
          <textarea id="bioInput" placeholder="Tell us about yourself and what you're looking for..." rows="4" required>${user ? user.bio : ''}</textarea>

          <button id="saveBtn" class="save">Save Profile</button>
          <button id="discardBtn" class="discard">Discard Changes</button>

          <div id="requestList" style="margin-top:2rem;"></div>
        </div>
        <div class="profile-right">
          <img src="${user ? user.image : 'https://placehold.co/120x120/cccccc/333333?text=User'}" alt="Profile Photo" class="profile-img" id="profileImgDisplay">
          <p><strong>Email:</strong> ${user ? user.email : 'N/A'}</p>
        </div>
      `;

      // Handle image file selection
      const imageUploadInput = document.getElementById("imageUpload");
      const profileImgDisplay = document.getElementById("profileImgDisplay");
      const profileImgPreview = document.querySelector(".profile-img-preview"); // Select the preview image

      if (imageUploadInput) {
        imageUploadInput.addEventListener("change", function(event) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              const base64Image = e.target.result;
              if (profileImgDisplay) {
                profileImgDisplay.src = base64Image; // Update the main profile image
              }
              if (profileImgPreview) {
                profileImgPreview.src = base64Image; // Update the preview image
                profileImgPreview.style.display = 'block'; // Make sure preview is visible
              } else {
                // If no preview exists, create one
                const newPreview = document.createElement('img');
                newPreview.src = base64Image;
                newPreview.className = 'profile-img-preview';
                newPreview.style.cssText = 'max-width: 100px; max-height: 100px; border-radius: 8px; margin-top: 10px; display: block;';
                imageUploadInput.parentNode.insertBefore(newPreview, imageUploadInput.nextSibling);
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // Event listeners for save/discard
      document.getElementById("saveBtn").addEventListener("click", function (e) {
        e.preventDefault();
        const name = document.getElementById("nameInput").value.trim();
        // Get image from the displayed source, which could be Base64 or a URL
        const image = profileImgDisplay ? profileImgDisplay.src : "https://placehold.co/60x60/cccccc/333333?text=User";
        const rating = parseFloat(document.getElementById("ratingInput").value);
        const skills = document.getElementById("skillsInput").value.split(",").map(s => s.trim()).filter(s => s !== "");
        const availability = document.getElementById("availabilityInput").value.trim();
        const location = document.getElementById("locationInput").value.trim();
        const bio = document.getElementById("bioInput").value.trim();

        if (!name || !skills.length || !availability || !location || !bio) {
          showMessage("Please fill all required fields.", "error");
          return;
        }

        let updatedUser = {
          id: user ? user.id : Date.now(),
          name,
          email: user ? user.email : loggedInUserEmail, // For new profiles, email comes from loggedInUserEmail
          password: user ? user.password : 'default_password', // Placeholder, should be handled during registration
          image: image, // Use the Base64 or URL from the display
          rating: isNaN(rating) ? 0 : rating,
          skills,
          availability,
          location,
          bio,
          requests: user ? user.requests : []
        };

        if (user) {
          // Update existing user
          users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        } else {
          // Add new user (for newly registered users who don't have a full profile yet)
          // This path might be less common if registration creates a basic profile
          users.push(updatedUser);
          setLoggedInUserEmail(updatedUser.email); // Ensure the new user is logged in
        }
        saveUsers(users);
        showMessage("Profile saved successfully!", "success");
        window.location.href = "home.html"; // Redirect after saving
      });

      document.getElementById("discardBtn").addEventListener("click", function (e) {
        e.preventDefault();
        // Custom confirmation message box
        const confirmDiscard = (callback) => {
            const modal = document.createElement("div");
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
                z-index: 1001;
            `;
            modal.innerHTML = `
                <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">Are you sure you want to discard changes?</p>
                    <button id="confirmYes" style="background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Yes</button>
                    <button id="confirmNo" style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">No</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById("confirmYes").onclick = () => { modal.remove(); callback(true); };
            document.getElementById("confirmNo").onclick = () => { modal.remove(); callback(false); };
        };

        confirmDiscard((result) => {
            if (result) {
                window.location.reload(); // Reload the page to discard changes
            }
        });
      });

      // Render incoming requests for the logged-in user
      if (user) {
        renderRequests(user);
      }
    }

    // Function to render a read-only profile (for other users)
    function renderReadOnlyProfile(user) {
      profileBox.innerHTML = `
        <div class="profile-left">
          <h2>${user.name}'s Profile</h2>
          <p><strong>Location:</strong> ${user.location}</p>
          <p><strong>Availability:</strong> ${user.availability}</p>
          <p><strong>Skills Offered:</strong> ${user.skills.join(", ")}</p>
          <p><strong>Bio:</strong> ${user.bio}</p>
          <p><strong>Rating:</strong> ⭐ ${user.rating}</p>
          <div id="sendMessageSection" style="margin-top:2rem;"></div>
        </div>
        <div class="profile-right">
          <img src="${user.image}" alt="${user.name}'s Profile Photo" class="profile-img">
        </div>
      `;
    }

    // Function to render the section for sending a request
    function renderSendRequestSection(targetUser) {
      const sendMessageSection = document.getElementById("sendMessageSection");
      if (sendMessageSection) {
        sendMessageSection.innerHTML = `
          <h3>Send a Swap Request to ${targetUser.name}</h3>
          <textarea id="messageBox" placeholder="Write your request message here..." rows="4" style="width:100%; margin-top:1rem;"></textarea>
          <button id="sendRequestBtn" class="request-btn" style="margin-top:0.5rem;">Send Request</button>
        `;

        document.getElementById("sendRequestBtn").addEventListener("click", () => {
          const msg = document.getElementById("messageBox").value.trim();
          if (msg === "") {
            showMessage("Please enter a message before sending your request.", "error");
          } else {
            const loggedInUser = users.find(u => u.email === loggedInUserEmail);
            if (loggedInUser) {
              targetUser.requests.push({
                from: loggedInUser.name, // The name of the person sending the request
                message: msg,
                status: "pending",
                senderId: loggedInUser.id // Store sender's ID for potential future use
              });
              saveUsers(users);
              showMessage("Swap request sent successfully!", "success");
              document.getElementById("messageBox").value = "";
            } else {
              showMessage("You must be logged in to send a request.", "error");
              window.location.href = "login.html";
            }
          }
        });
      }
    }


    // Function to render incoming requests for the current user
    function renderRequests(user) {
      const requestList = document.getElementById("requestList");
      if (requestList) {
        requestList.innerHTML = "<h3>Incoming Swap Requests</h3>";
        if (!user.requests || user.requests.length === 0) {
          requestList.innerHTML += "<p>No incoming requests yet.</p>";
        } else {
          user.requests.forEach((req, i) => {
            const reqEl = document.createElement("div");
            reqEl.innerHTML = `
              <p><strong>From:</strong> ${req.from}</p>
              <p><strong>Message:</strong> ${req.message}</p>
              <p><strong>Status:</strong> <span id="status-${user.id}-${i}">${req.status}</span></p>
              ${req.status === 'pending' ? `
                <button onclick="acceptRequest(${user.id}, ${i})">Accept</button>
                <button onclick="rejectRequest(${user.id}, ${i})">Reject</button>
              ` : ''}
              <button onclick="deleteRequest(${user.id}, ${i})" style="background-color:#6c757d;">Delete</button>
            `;
            requestList.appendChild(reqEl);
          });
        }
      }
    }

    // Logout button functionality
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        removeLoggedInUserEmail();
        showMessage("Logged out successfully.", "info");
        window.location.href = "login.html";
      });
    }
  }
});
