const defaultServices = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Leak repairs, pipe replacement, bathroom installations, and emergency fixes.",
    category: "repair",
    icon: "🔧"
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Custom furniture, door fittings, cupboards, repair work, and wood restoration.",
    category: "maintenance",
    icon: "🪵"
  },
  {
    id: "masonry",
    name: "Masonry",
    description: "Wall construction, tiling, concrete repairs, and structural improvements.",
    category: "repair",
    icon: "🧱"
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Routine cleaning, deep sanitizing, kitchen detailing, and move-in refreshes.",
    category: "care",
    icon: "🧼"
  },
  {
    id: "laundry",
    name: "Laundry",
    description: "Wash, fold, ironing, stain removal, and tailored household apparel care.",
    category: "care",
    icon: "🧺"
  },
  {
    id: "security",
    name: "Security",
    description: "CCTV setup, alarm maintenance, access control, and home monitoring support.",
    category: "security",
    icon: "🔒"
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring assistance, lighting upgrades, fan installation, and fault repair.",
    category: "repair",
    icon: "💡"
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior refreshes, exterior coating, wall prep, and color consultation.",
    category: "maintenance",
    icon: "🎨"
  },
  {
    id: "maintenance",
    name: "General Maintenance",
    description: "Routine upkeep, checks, and small home repairs to prevent bigger problems.",
    category: "maintenance",
    icon: "🛠️"
  }
];

let services = [...defaultServices];
const serviceGrid = document.getElementById("serviceGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");

function renderServices(filter = "all") {
  if (!serviceGrid) return;

  const visibleServices =
    filter === "all"
      ? services
      : services.filter((service) => service.category === filter);

  serviceGrid.innerHTML = visibleServices
    .map(
      (service) => `
        <article class="service-card">
          <div class="service-icon" aria-hidden="true">${service.icon}</div>
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <span class="service-badge">${service.category}</span>
            <span class="service-note">Quote-based</span>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadServices() {
  try {
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Unable to load services");
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length) {
      services = data;
    }
  } catch (error) {
    services = [...defaultServices];
  }

  renderServices();
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderServices(button.dataset.filter);
    });
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      date: formData.get("date"),
      location: formData.get("location"),
      details: formData.get("details")
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      formMessage.textContent = `Thanks, ${payload.name}! Your ${payload.service} request for ${payload.date} has been received. Our team will confirm shortly.`;
      bookingForm.reset();
    } catch (error) {
      formMessage.textContent = error.message;
    }
  });
}

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

loadServices();
