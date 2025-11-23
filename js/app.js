const API_URL = "https://eventhubbackend-4.onrender.com/events";

const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");

const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editEventForm = document.getElementById("editEventForm");
const editEventId = document.getElementById("editEventId");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editDate = document.getElementById("editDate");
const editTime = document.getElementById("editTime");
const editLocation = document.getElementById("editLocation");

async function fetchEvents() {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();
    eventList.innerHTML = "";

    if (!events.length) {
      eventList.innerHTML = "<p>No events found</p>";
      return;
    }

    events.forEach(event => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card p-3 mb-3 shadow-sm">
          <h5>${event.title}</h5>
          <p>${event.description}</p>
          <p><strong>Date:</strong> ${event.date} <strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <button class="btn btn-warning btn-sm me-1" onclick="showEditModal(${event.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">Delete</button>
        </div>
      `;
      eventList.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    eventList.innerHTML = "<p>Error fetching events</p>";
  }
}

eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const event = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    location: document.getElementById("location").value.trim()
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
    eventForm.reset();
    fetchEvents();
  } catch (err) {
    console.error(err);
  }
});

async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchEvents();
  } catch (err) {
    console.error(err);
  }
}

async function showEditModal(id) {
  try {
    const res = await fetch(`${API_URL}`);
    const events = await res.json();
    const event = events.find(ev => ev.id === id);
    if (!event) return;

    editEventId.value = event.id;
    editTitle.value = event.title;
    editDescription.value = event.description;
    editDate.value = event.date;
    editTime.value = event.time;
    editLocation.value = event.location;

    editModal.show();
  } catch (err) {
    console.error(err);
  }
}

editEventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editEventId.value;
  const updatedEvent = {
    title: editTitle.value.trim(),
    description: editDescription.value.trim(),
    date: editDate.value,
    time: editTime.value,
    location: editLocation.value.trim()
  };

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent)
    });
    editModal.hide();
    fetchEvents();
  } catch (err) {
    console.error(err);
  }
});

fetchEvents();
