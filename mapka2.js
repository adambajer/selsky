
document.addEventListener("DOMContentLoaded", function () {
    const svg = document.getElementById("map-svg");
    const hoverElements = document.querySelectorAll('.hover-effect');
    const infoPopup = document.getElementById('info-popup');
    const infoContent = document.querySelector('.info-content');
    hoverElements.forEach(function (element) {
        const bbox = element.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        if (element.classList.contains('pokoj')) {
        }
        else {
            const staticDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            staticDot.setAttribute('class', 'static-dot red');
            staticDot.setAttribute('cx', cx);
            staticDot.setAttribute('cy', cy);
            staticDot.setAttribute('r', '0.7');
            const staticdataTitle = element.getAttribute('data-title');
            staticDot.setAttribute('data-title', staticdataTitle);
            const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            titleElement.textContent = staticdataTitle;
            staticDot.appendChild(titleElement);
            svg.appendChild(staticDot);
            staticDot.addEventListener('click', function () {
                const linkedElement = document.querySelector(`.hover-effect[data-title="${staticdataTitle}"]`);
                if (linkedElement) {
                    const description = linkedElement.getAttribute('data-description');
                    const staticDotimageSrc = linkedElement.getAttribute('data-src');
                    content = staticdataTitle;
                    contentDescription = description;
                    imageSrc = staticDotimageSrc;
                    showOverlay(content, contentDescription, imageSrc);
                }
            });
        }
        element.addEventListener('mousemove', function (evt) {
            const imageSrc = this.getAttribute('data-src');
            const description = this.getAttribute('data-description');
            const title = this.getAttribute('data-title');
            const content = `<div class="nazev">${title}</div>`;
            const contentdescription = `<p>${description}</p>`;
            showPopup(evt, content, contentdescription, imageSrc);
        });
        element.addEventListener('mouseleave', hidePopup);
        element.addEventListener('click', function () {
            //setActiveElement(this);
        });
    });
    function showPopup(evt, content, contentdescription, imageSrc) {
        infoContent.innerHTML = `<div class="popup-image"><img data-src="${imageSrc}" alt="Popup Image" "></div>
                                <div class="popup-text">${content}</div> 
                                <div class="popup-description">${contentdescription}</div>`;
        infoPopup.style.display = 'block';
        infoPopup.style.opacity = 1;
        const img = infoContent.querySelector('.popup-image img');
        const loader = infoContent.querySelector('.loader');
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = function () {
            updatePopupPosition(evt);      // Reposition the popup
        };
        if (img.complete) {
            img.onload();
        }
        updatePopupPosition(evt);
    }
    function updatePopupPosition(evt) {
        const popupWidth = infoPopup.offsetWidth;
        const popupHeight = infoPopup.offsetHeight;
        let offsetX = 20;
        let offsetY = 20;
        let left = evt.pageX + offsetX;
        let top = evt.pageY + offsetY;
        if ((left + popupWidth) > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10;
        }
        if (left < 0) {
            left = 10;
        }
        if ((top + popupHeight) > window.innerHeight) {
            top = evt.pageY - popupHeight - offsetY;
            if (top < 0) {
                top = 10;
            }
        }
        infoPopup.style.left = left + 'px';
        infoPopup.style.top = top + 'px';
    }
    function hidePopup() {
        infoPopup.style.display = 'none';
    }
    const zoomSlider = document.getElementById("zoom-slider");
    const zoomIndicator = document.getElementById("zoom-indicator");

    let viewBox = { x: 0, y: 0, width: 200, height: 124 }; // Initial viewBox
    let initialWidth = viewBox.width; // Initial width for calculating zoom
    const maxZoom = 300; // Max zoom percentage
    const minZoom = 100; // Min zoom percentage 
    let isPanning = false;
    let startX, startY, startViewBoxX, startViewBoxY;
    function setViewBox() {
        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }
    function setViewBox() {
        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }
    // Function to update the zoom indicator and slider value
    function updateZoomIndicator() {
        const zoomPercent = Math.round((initialWidth / viewBox.width) * 100);

        zoomSlider.value = zoomPercent;
    }
    // Mousewheel event for zooming
    svg.addEventListener("wheel", function (e) {
        e.preventDefault();
        const zoomScale = 0.1;
        const mouseX = (e.offsetX / svg.clientWidth) * viewBox.width + viewBox.x;
        const mouseY = (e.offsetY / svg.clientHeight) * viewBox.height + viewBox.y;

        if (e.deltaY < 0 && (initialWidth / viewBox.width) * 100 < maxZoom) {
            // Zoom in
            viewBox.width *= (1 - zoomScale);
            viewBox.height *= (1 - zoomScale);
        } else if (e.deltaY > 0 && (initialWidth / viewBox.width) * 100 > minZoom) {
            // Zoom out
            viewBox.width *= (1 + zoomScale);
            viewBox.height *= (1 + zoomScale);
        }

        // Keep zoom centered on the mouse
        viewBox.x = mouseX - (e.offsetX / svg.clientWidth) * viewBox.width;
        viewBox.y = mouseY - (e.offsetY / svg.clientHeight) * viewBox.height;

        setViewBox();
        updateZoomIndicator();
    });
    // Handle zoom changes via the slider
    zoomSlider.addEventListener("input", function () {
        const zoomPercent = this.value;
        const newWidth = initialWidth * (100 / zoomPercent);
        const newHeight = (viewBox.height / viewBox.width) * newWidth;

        // Adjust the viewBox size
        viewBox.width = newWidth;
        viewBox.height = newHeight;

        setViewBox();
        updateZoomIndicator();
    });
    svg.addEventListener("mousedown", function (e) {
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        startViewBoxX = viewBox.x;
        startViewBoxY = viewBox.y;
        svg.style.cursor = "move";
    });
    svg.addEventListener("mousemove", function (e) {
        if (!isPanning) return;
        const dx = (startX - e.clientX) * (viewBox.width / svg.clientWidth);
        const dy = (startY - e.clientY) * (viewBox.height / svg.clientHeight);
        viewBox.x = startViewBoxX + dx;
        viewBox.y = startViewBoxY + dy;
        setViewBox();
    });
    svg.addEventListener("mouseup", function () {
        isPanning = false;
        svg.style.cursor = "grab";
    });
    svg.addEventListener("mouseleave", function () {
        isPanning = false;
        svg.style.cursor = "grab";
    });

    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay-content');
    const titleContent = document.querySelector('.title-content');
    const descriptionContent = document.querySelector('.description-content');
    const img = overlayContent.querySelector('img'); 
    function showOverlay(content, contentDescription, imageSrc) {
        overlay.style.display = 'block';
        img.setAttribute('src', imageSrc);
        titleContent.innerText = content;
        descriptionContent.innerText = contentDescription;
        svg.classList.add('mini-map'); // Add class to make the map smaller and move it to the bottom-right


    }
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener("click", function () {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
        svg.classList.remove('mini-map'); // Restore the map to its original size and position
        pokoje.forEach(function (p) {
            p.style.fill = 'white'; // Reset the fill when overlay is closed
        });

    });
    const pokoje = document.querySelectorAll('.pokoj');
 
    let currentIndex = 0;
    const popupTitle = document.querySelector('.title-content');
    const popupDescription = document.querySelector('.description-content');
    const roomImage = overlayContent.querySelector('img');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
 

    // Function to update the overlay with room information
    function updateOverlay(index) {
        if (index < 0 || index >= pokoje.length) {
            return; // Index out of bounds, prevent update
        }

        const pokoj = pokoje[index];

        // Reset the fill for all rooms to white
        pokoje.forEach(function (p) {
            p.style.fill = 'white';
        });

        // Highlight the selected room in the map
        pokoj.style.fill = 'lightgreen';

        // Update the title, description, and image in the overlay
        const title = `Apartmán A > ${pokoj.getAttribute('data-patro')} > ${pokoj.getAttribute('data-title')}`;
        const description = pokoj.getAttribute('data-description');
        const imageSrc = pokoj.getAttribute('data-src');

        titleContent.textContent = title;
        descriptionContent.textContent = description;
        roomImage.setAttribute('src', imageSrc);

        // Make sure the overlay is visible
        overlay.style.display = 'block';
    }

    // Add click event listener to each pokoj element
    pokoje.forEach(function (pokoj) {
        pokoj.addEventListener('click', function () {
            // Remove light green fill from any previously selected pokoj
            pokoje.forEach(function (p) {
                p.style.fill = 'white'; // Reset to default
            }); 
            // Set light green fill to the clicked pokoj
            this.style.fill = 'lightgreen';

            // Get the data attributes for the clicked pokoj
            const title = 'Apartmán A > '+this.getAttribute('data-patro') +' > '+this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const datasrc = this.getAttribute('data-src');

            // Show the overlay with the clicked pokoj's details
            showOverlay(title, description, datasrc);
        });
    });
  // Show the next room
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % pokoje.length; // Increment index and wrap around
    updateOverlay(currentIndex);
});
 // Show the previous room
 prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + pokoje.length) % pokoje.length; // Decrement index and wrap around
    updateOverlay(currentIndex);
});
  // Close the overlay
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';  // Hide the overlay

    // Reset the fill for all rooms to white
    pokoje.forEach(function (p) {
        p.style.fill = 'white';
    });
});

 
 

    // Check if SVG element exists
    if (!svg) {
        console.error('SVG element with id "map-svg" not found.');
        return;
    }

  
    // Handle the room list for mistnost elements
    const patroGroups = svg.querySelectorAll('g[data-patro]');
    let treeStructure = [];

    patroGroups.forEach(function (patroGroup) {
        const patroTitle = patroGroup.getAttribute('data-patro') || 'Unnamed Floor';
        const patroColor = patroGroup.getAttribute('data-color') || 'green';

        const mistnostGroups = patroGroup.querySelectorAll('g[class*="mistnost"]');
        let mistnosti = [];

        mistnostGroups.forEach(function (mistnostGroup) {
            const mistnostTitle = mistnostGroup.getAttribute('data-title') || mistnostGroup.getAttribute('id') || 'Unnamed Room';
            const hoverElements = mistnostGroup.querySelectorAll('.hover-effect');
            let elements = [];

            hoverElements.forEach(function (element) {
                const title = element.getAttribute('data-title');
                const description = element.getAttribute('data-description');
                const imageSrc = element.getAttribute('data-src');

                elements.push({
                    element: element,
                    title: title,
                    description: description,
                    imageSrc: imageSrc
                });
            });

            mistnosti.push({
                group: mistnostGroup,
                mistnostTitle: mistnostTitle,
                elements: elements
            });
        });

        treeStructure.push({
            patroGroup: patroGroup,
            patroTitle: patroTitle, 
            
            patroColor: patroColor, 
            mistnosti: mistnosti
        });
    });

    // Append the new list to div.panel1
    const panel1 = document.querySelector('div.panel1'); // Select div.panel1

    if (!panel1) {
        console.error('Element div.panel1 not found.');
        return;
    }

    const listContainer = document.createElement('div');
    listContainer.id = 'new-list-container'; // Optional: assign an ID
    panel1.appendChild(listContainer); // Append it to div.panel1

    treeStructure.forEach(function (patroItem) {
        const patroDiv = document.createElement('div');
        patroDiv.classList.add('patro');

        const patroTitleDiv = document.createElement('div');
        patroTitleDiv.classList.add('patro-title'); 
        //patroTitleDiv.classList.add();
        patroTitleDiv.textContent = patroItem.patroTitle;

        patroDiv.appendChild(patroTitleDiv);

        // List of mistnosti in this patro
        const mistnostiList = document.createElement('ul');
        mistnostiList.classList.add('mistnost');

        patroItem.mistnosti.forEach(function (mistnostItem) {
            const mistnostLi = document.createElement('li');
            const mistnostDiv = document.createElement('div');
            mistnostDiv.classList.add('mistnost-title', 'collapsed',patroItem.patroColor);  
            mistnostDiv.textContent = mistnostItem.mistnostTitle;

            // Elements list for this mistnost
            const elementsList = document.createElement('ul');
            elementsList.style.display = 'none'; // Hide elements by default

            // Toggle the display of elements list on click
            mistnostDiv.addEventListener('click', function () {
                // Highlight the corresponding room on the map
                highlightRoomOnMap(mistnostItem.mistnostTitle);

                if (elementsList.style.display === 'none') {
                    elementsList.style.display = 'block';
                    elementsList.style.background = 'white';
                    mistnostDiv.classList.remove('collapsed');
                } else {
                    elementsList.style.display = 'none';
                    mistnostDiv.classList.add('collapsed');
                }
            });

            mistnostItem.elements.forEach(function (elementItem) {
                const elementLi = document.createElement('li');
                elementLi.textContent = elementItem.title;
                elementsList.appendChild(elementLi);
            });

            mistnostLi.appendChild(mistnostDiv);
            mistnostLi.appendChild(elementsList);
            mistnostiList.appendChild(mistnostLi);
        });

        patroDiv.appendChild(mistnostiList);
        listContainer.appendChild(patroDiv);
    });

    // Function to highlight the selected room on the map
    function highlightRoomOnMap(roomTitle) {
        hoverElements.forEach(function (element) {
            const title = element.getAttribute('data-title');

            // Reset the fill for all rooms
            element.style.fill = 'white';  // Default fill

            // If this room matches the clicked title, change its fill
            if (title === roomTitle) {
                element.style.fill = 'lightgreen';  // Highlight color
            }
        });
    }
});