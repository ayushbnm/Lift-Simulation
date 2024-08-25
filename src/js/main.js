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
        const floorHeight = 80; // This should match the height of the .floor element in CSS
        const speedPerFloor = 1000; // 1 second per floor (adjusted to 1000ms for more accurate timing)
    
        // Calculate the translateY value to move the lift to the correct floor
        const targetPosition = (targetFloor - 1) * floorHeight;
        this.element.style.transitionDuration = `${distance * speedPerFloor / 1000}s`; // Set the transition duration based on the number of floors
        this.element.style.transform = `translateY(-${targetPosition}px)`; // Adjust for lift movement
    
        setTimeout(() => {
            this.currentFloor = targetFloor;
            this.element.dataset.currentFloor = targetFloor;
    
            this.openDoors();
            setTimeout(() => {
                this.closeDoors();
                setTimeout(() => {
                    this.busy = false;
                    this.processQueue();
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
        const distance = direction === 'up'
            ? Math.max(lift.currentFloor - floorNumber, 0) // Distance only if going up
            : Math.max(floorNumber - lift.currentFloor, 0); // Distance only if going down
        
        if (!lift.busy && distance < closestDistance) {
            closestDistance = distance;
            closestLift = lift;
        }
    });

    if (closestLift) {
        closestLift.addToQueue(floorNumber);
    }
}

// Function to create and append floors
function createFloors(building, numberOfFloors) {
    for (let i = 0; i < numberOfFloors; i++) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.dataset.floorNumber = i + 1;

        const buttons = document.createElement('div');
        buttons.className = 'floor-buttons';

        // Create "Up" button
        const upButton = document.createElement('button');
        upButton.innerText = `Up`;
        upButton.addEventListener('click', () => callLift(i + 1, 'up'));

        // Create "Down" button
        const downButton = document.createElement('button');
        downButton.innerText = `Down`;
        downButton.addEventListener('click', () => callLift(i + 1, 'down'));

        buttons.appendChild(upButton);
        buttons.appendChild(downButton);
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
     
     building.style.width = `${buildingWidth + 120}px`; 

    createFloors(building, numberOfFloors); // Create and append floors

    // Create and append lifts
    for (let i = 0; i < numberOfLifts; i++) {
        const lift = new Lift(i + 1);
        liftStore.lifts.push(lift);
        building.children[1].appendChild(lift.element);
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
