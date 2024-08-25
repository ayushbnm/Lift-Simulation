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
        this.busy = true;
        const distance = Math.abs(targetFloor - this.currentFloor);
        const floorHeight = 80; // This should match the height of the .floor element in CSS
    
        // Calculate the translateY value based on the target floor and floor height
        this.element.style.transform = `translateY(${((targetFloor-1) * floorHeight)}px)`;
    
        setTimeout(() => {
            this.currentFloor = targetFloor;
            this.element.dataset.currentFloor = targetFloor;
    
            this.openDoors();
            setTimeout(() => {
                this.closeDoors();
                setTimeout(() => {
                    this.busy = false;
                    this.processQueue();
                }, 2500);
            }, 2500);
        }, distance * 2000);
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
 
// Function to create and append floors
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
    console.log("create floors function",numberOfFloors);
    
    for (let i = 0; i < numberOfFloors; i++) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.dataset.floorNumber = i + 1;
        // floor.style.paddingTop=`${i*60}px`
       // floor.style.top=`${i*200}px`

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

// Call lift function
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

// Function to initialize the building
function initializeBuilding(numberOfLifts, numberOfFloors) {
    liftStore.lifts = [];
    liftStore.floors = numberOfFloors;
    console.log("intialize building",numberOfFloors);
    
    const building = document.querySelector('.building');
    building.innerHTML = ''; // Clear previous building content
    
     // Set the width of the building based on the number of lifts
     const liftWidth = 60; // Width of each lift
     const liftSpacing = 100; // Spacing between lifts (adjust this as needed)
     const buildingWidth = numberOfLifts * liftSpacing; // Total width based on the number of lifts
     
     building.style.width = `${buildingWidth+120}px`; 

    createFloors(building, numberOfFloors); // Create and append floors

    // Create and append lifts
    for (let i = 0; i < numberOfLifts; i++) {
        const lift = new Lift(i + 1);
        liftStore.lifts.push(lift);
        building.children[0].appendChild(lift.element);
        console.log("Lift Created: ", lift); // Place lift on the ground floor
    }
}

const generateBuildingButton = document.getElementById('generate-building');
const buildingContainer = document.querySelector('.building');

generateBuildingButton.addEventListener('click', () => {
    // Get the values from the input fields
    const totalFloors = parseInt(document.getElementById('total-floors').value);
    const totalLifts = parseInt(document.getElementById('total-lifts').value);
   console.log("button clicked",totalFloors);
   
    // Validate the inputs
    if (isNaN(totalFloors) || isNaN(totalLifts) || totalFloors <= 0 || totalLifts <= 0) {
        alert('Please enter valid numbers for floors and lifts.');
        return;
    }

    // Call the initializeBuilding function with the user inputs
    initializeBuilding( totalLifts,totalFloors);
});


