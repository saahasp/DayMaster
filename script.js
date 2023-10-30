document.addEventListener("DOMContentLoaded", function() {
    const eventDateInput = document.getElementById("event-date");
    const startTimeInput = document.getElementById("start-time");
    const addEventButton = document.getElementById("add-event");
    const scheduleEventsButton = document.getElementById("schedule-events");
    const restartScheduleButton = document.getElementById("restart-schedule");
    const eventsContainer = document.getElementById("events");
    const scheduleContainer = document.getElementById("schedule");

    let events = [];

    addEventButton.addEventListener("click", function() {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event";
        eventDiv.innerHTML = `
            <input type="text" placeholder="Event Name">
            <input type="number" placeholder="Duration (minutes)">
            <input type="time" placeholder="Due Time">
            <select class="event-order">
                <!-- Order numbers will be dynamically generated -->
            </select>
        `;
        eventsContainer.appendChild(eventDiv);

        // Update the order numbers for all events
        updateOrderNumbers();
    });

    scheduleEventsButton.addEventListener("click", function() {
        events = [];

        // Gather event data including the order
        const eventInputs = eventsContainer.querySelectorAll(".event");
        eventInputs.forEach(input => {
            const name = input.querySelector("input[type='text']").value;
            const duration = parseInt(input.querySelector("input[type='number']").value);
            const dueTime = input.querySelector("input[type='time']").value;
            const order = parseInt(input.querySelector(".event-order").value);

            if (name && !isNaN(duration) && duration > 0 && dueTime) {
                events.push({ name, duration, dueTime, order });
            }
        });

        // Sort events based on the order
        events.sort((a, b) => a.order - b.order);

        const eventDate = eventDateInput.value;
        const startTime = startTimeInput.value;
        scheduleContainer.innerHTML = "";

        const start = new Date(eventDate + " " + startTime);
        let currentTime = new Date(start);

        for (const event of events) {
            const eventStart = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const eventEnd = new Date(currentTime.getTime() + event.duration * 60000);
            const eventEndTime = eventEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (eventEnd > new Date(eventDate + " 23:59")) {
                console.error("Your day is full. Adjust your start time or date.");
                alert("Your day is full. Adjust your start time or date.");
                return;
            } else if (eventEnd > new Date(eventDate + " " + event.dueTime)) {
                console.error("There is not enough time to complete this event. Please reschedule.");
                alert("There is not enough time to complete this event. Please reschedule.");
                return;
            }

            const eventDiv = document.createElement("div");
            eventDiv.textContent = `${event.name} - ${eventStart} - ${eventEndTime}`;
            scheduleContainer.appendChild(eventDiv);

            const nextEventStart = new Date(eventEnd.getTime() + 10 * 60000); // Add 10 minutes of break
            currentTime = nextEventStart;
        }
    });

    restartScheduleButton.addEventListener("click", function() {
        events = [];
        eventsContainer.innerHTML = ""; // Clear event inputs
        scheduleContainer.innerHTML = ""; // Clear the schedule
    });

    // Function to update the order numbers for all events
    function updateOrderNumbers() {
        const eventInputs = eventsContainer.querySelectorAll(".event");
        const numEvents = eventInputs.length;

        eventInputs.forEach((input, index) => {
            const selectOrder = input.querySelector(".event-order");
            selectOrder.innerHTML = "";

            for (let i = 1; i <= numEvents; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.text = `${i}${ordinalSuffix(i)}`;
                selectOrder.appendChild(option);
            }
        });
    }

    // Function to add ordinal suffix to numbers (e.g., 1st, 2nd, 3rd)
    function ordinalSuffix(i) {
        const j = i % 10;
        const k = i % 100;
        if (j === 1 && k !== 11) {
            return "st";
        }
        if (j === 2 && k !== 12) {
            return "nd";
        }
        if (j === 3 && k !== 13) {
            return "rd";
        }
        return "th";
    }
});