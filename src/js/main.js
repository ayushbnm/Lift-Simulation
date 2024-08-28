// Data Store
let liftStore = {
    lifts: [],
    floors: 0,
};

// Lift Class
class Lift {
    constructor(id) {
        this.queue = [];
        this.id = id;
        this.currentFloor = 1;
        this.busy = false;
        this.element = this.createLiftElement();
    }

    createLiftElement() {
        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.dataset.currentFloor = this.currentFloor;
    
        const leftDoor = document.createElement('div');
        leftDoor.className = 'lift-door lift-door-left';
    
        const rightDoor = document.createElement('div');
        rightDoor.className = 'lift-door lift-door-right';
    
        lift.appendChild(leftDoor);
        lift.appendChild(rightDoor);
    
        // Calculate the horizontal position based on the lift id
        const liftSpacing = 100; // Adjust this value to control the spacing between lifts
        lift.style.left = `${this.id * liftSpacing}px`; // Space lifts horizontally
    
        // Initialize lift position to the ground floor (first floor)
        const floorHeight = 80; // This should match the height of the .floor element in CSS
        lift.style.transform = `translateY(0px)`; // Start at the ground floor (0 offset)
    
        return lift;
    }
    

    addToQueue(floor) {
        this.queue.push(floor);
        if (!this.busy) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) return;
        const targetFloor = this.queue.shift();
        this.moveToFloor(targetFloor);
    }
    moveToFloor(targetFloor) {
        // Ensure the target floor is within the valid range
        if (targetFloor < 1 || targetFloor > liftStore.floors) {
            console.error(`Invalid target floor: ${targetFloor}. It should be between 1 and ${liftStore.floors}.`);
            this.processQueue(); // Skip the invalid floor and continue with the queue
            return;
        }
    
        this.busy = true;
        const distance = Math.abs(targetFloor - this.currentFloor); // Calculate the number of floors to travel
        const floorHeight = 60; // This should match the height of the .floor element in CSS
        const speedPerFloor = 2000; // 2 seconds per floor
    
        // Calculate the exact translateY value to move the lift to the correct position, aligning with the floor surface
        const targetPosition = (targetFloor - 1) * floorHeight;
    
        const transitionDuration = `${distance * speedPerFloor / 1000}s`; // Set the transition duration based on the number of floors
    
        // Debugging output
        console.log(`Moving lift ${this.id} to floor ${targetFloor}`);
        console.log(`Target position: ${targetPosition}px`);
        console.log(`Transition duration: ${transitionDuration}`);
    
        // Ensure the lift stops accurately at the target floor surface
        this.element.style.transition = `transform ${transitionDuration} linear`; // Set the transition duration
        this.element.style.transform = `translateY(-${targetPosition}px)`; // Move the lift to the target floor
    
        // Wait for the lift to reach the target floor
        setTimeout(() => {
            this.currentFloor = targetFloor; // Update the lift's current floor to the target floor
            this.element.dataset.currentFloor = targetFloor; // Update the data attribute for the current floor
    
            this.openDoors(); // Open the doors once the lift reaches the target floor
            setTimeout(() => {
                this.closeDoors(); // Close the doors after a delay
                setTimeout(() => {
                    this.busy = false; // Mark the lift as not busy
                    this.processQueue(); // Process the next request in the queue
                }, 2500); // Time for doors to close
            }, 2500); // Time for doors to stay open
        }, distance * speedPerFloor); // Time to move the lift to the target floor
    }
    
    
    
    
    
    
    
    
    
    
    

    openDoors() {
        const doors = this.element.querySelectorAll('.lift-door');
        doors.forEach((door) => {
            door.classList.add('open');
        });
    }

    closeDoors() {
        const doors = this.element.querySelectorAll('.lift-door');
        doors.forEach((door) => {
            door.classList.remove('open');
        });
    }
}
 
// Function to call the lift
function callLift(floorNumber, direction) {
    let closestLift = null;
    let closestDistance = Infinity;

    liftStore.lifts.forEach((lift) => {
        // Calculate the distance between the lift's current floor and the requested floor
        const distance = Math.abs(lift.currentFloor - floorNumber);
        
        // Check if the lift is not busy and closer than the current closest lift
        if (!lift.busy && distance < closestDistance) {
            closestDistance = distance;
            closestLift = lift;
        }
    });

    // If a suitable lift is found, add the requested floor to its queue
    if (closestLift) {
        closestLift.addToQueue(floorNumber);
    } else {
        console.log('All lifts are busy. Please wait.');
    }
}


// Function to create and append floors
// Function to create and append floors
// Function to create and append floors
function createFloors(building, numberOfFloors) {
    for (let i = 0; i < numberOfFloors; i++) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.dataset.floorNumber = i + 1;

        // Create a floor number label
        const floorNumberLabel = document.createElement('div');
        floorNumberLabel.className = 'floor-number';
        floorNumberLabel.innerText = `Floor ${i + 1}`;

        // Create the button container
        const buttons = document.createElement('div');
        buttons.className = 'floor-buttons';

        if (i === 0) {
            // For the ground floor, only add the "Up" button
            const upButton = document.createElement('button');
            upButton.innerText = `Up`;
            upButton.addEventListener('click', () => callLift(i + 1, 'up'));
            buttons.appendChild(upButton);
        } else if (i === numberOfFloors - 1) {
            // For the topmost floor, only add the "Down" button
            const downButton = document.createElement('button');
            downButton.innerText = `Down`;
            downButton.addEventListener('click', () => callLift(i + 1, 'down'));
            buttons.appendChild(downButton);
        } else {
            // For all other floors, add both "Up" and "Down" buttons
            const upButton = document.createElement('button');
            upButton.innerText = `Up`;
            upButton.addEventListener('click', () => callLift(i + 1, 'up'));

            const downButton = document.createElement('button');
            downButton.innerText = `Down`;
            downButton.addEventListener('click', () => callLift(i + 1, 'down'));

            buttons.appendChild(upButton);
            buttons.appendChild(downButton);
        }

        floor.appendChild(floorNumberLabel); // Add the floor number label
        floor.appendChild(buttons);
        building.appendChild(floor);
    }


}



// Function to initialize the building
function initializeBuilding(numberOfLifts, numberOfFloors) {
    liftStore.lifts = [];
    liftStore.floors = numberOfFloors;
    
    const building = document.querySelector('.building');
    building.innerHTML = ''; // Clear previous building content
    
     // Set the width of the building based on the number of lifts
     const liftWidth = 60; // Width of each lift
     const liftSpacing = 100; // Spacing between lifts
     const buildingWidth = numberOfLifts * liftSpacing; // Total width based on the number of lifts
     if (numberOfFloors === 1) {
       // alert("No lifts are required when there's only one floor.");
        createFloors(building, numberOfFloors); // Create and append the single floor
        return; // Exit the function early, no lifts will be created
    }
     building.style.width = `${buildingWidth + 120}px`; 

    createFloors(building, numberOfFloors); // Create and append floors

    // Create and append lifts
    for (let i = 0; i < numberOfLifts; i++) {
        const lift = new Lift(i + 1);
        liftStore.lifts.push(lift);
        building.children[0].appendChild(lift.element);
        console.log("Lift Created: ", lift); // Place lift on the ground floor
    }
}

// Event listener for generating the building
const generateBuildingButton = document.getElementById('generate-building');
const buildingContainer = document.querySelector('.building');

generateBuildingButton.addEventListener('click', () => {
    // Get the values from the input fields
    const totalFloors = parseInt(document.getElementById('total-floors').value);
    const totalLifts = parseInt(document.getElementById('total-lifts').value);

    // Validate the inputs
    if (isNaN(totalFloors) || isNaN(totalLifts) || totalFloors <= 0 || totalLifts <= 0) {
        alert('Please enter valid numbers for floors and lifts.');
        return;
    }

    // Call the initializeBuilding function with the user inputs
    initializeBuilding(totalLifts, totalFloors);
});
